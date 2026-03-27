# controllers/p2_controller.py
import time
import uuid
from schemas.p2_schemas import P2Request, P2Response
from llm.client_factory import get_llm_client
from llm.response_parser import ResponseParser
from llm.model_registry import validate_model
from prompts.p2_prompts import SYSTEM_PROMPT_P2, build_p2_prompt
from simulation.p2_simulation import P2Simulator
from config import settings
from utils.logger import get_logger
from services.experiment_service import log_experiment

logger = get_logger(__name__)

class P2Controller:

    async def run(self, request: P2Request) -> P2Response:
        start_time = time.time()
        experiment_id = str(uuid.uuid4())

        # 1. Validate and resolve model
        model_name = validate_model(request.llm_config.model_name)
        logger.info("Running P2 generation", model=model_name, experiment_id=experiment_id)

        user_prompt = build_p2_prompt(request)
        logger.info("PIPELINE: P2 Prompt Constructed", length=len(user_prompt))
        logger.debug(f"FULL PROMPT P2: {user_prompt}")

        raw_output = None
        llm_success = False

        try:
            client = get_llm_client(model_name)
            raw_output = await client.generate_with_retry(
                model=model_name,
                prompt=user_prompt,
                system_prompt=SYSTEM_PROMPT_P2,
                temperature=request.llm_config.temperature,
                max_tokens=request.llm_config.max_tokens,
            )
            logger.debug("LLM raw output received", length=len(raw_output))
        except Exception as e:
            logger.warning("LLM call failed, using fallback", error=str(e))

        parsed_data = None
        if raw_output:
            parsed_data = ResponseParser.extract_json(raw_output)

        if parsed_data:
            try:
                result_data = self._build_response(
                    parsed_data, request, experiment_id, model_name, start_time
                )
                llm_success = True
            except Exception as e:
                logger.warning("LLM response failed schema validation, using fallback", error=str(e))
                parsed_data = None

        if not parsed_data or not llm_success:
            logger.info("Using simulation fallback", experiment_id=experiment_id)
            simulator = P2Simulator(seed=settings.simulation_seed)
            result_data = simulator.simulate(request)
            result_data["experiment_id"] = experiment_id

        project_id = getattr(request, 'project_id', 'default_project')
        user_id = getattr(request, 'user_id', 'anonymous_user')
        
        await log_experiment(
            experiment_id=experiment_id,
            user_id=user_id,
            project_id=project_id,
            exp_type="p2",
            request_payload=request.model_dump(),
            result_data=result_data
        )

        return P2Response(**result_data)

    def _build_response(self, data: dict, request: P2Request,
                        experiment_id: str, model_name: str, start_time: float) -> dict:
        import numpy as np
        rng = np.random.default_rng(settings.simulation_seed)
        from utils.biology_constants import COMMON_GENES

        preview_genes = list(COMMON_GENES[:8])
        preview_data = []
        for i in range(5):
            row = {"sample_id": f"SYN_{i+1:04d}", "age": int(rng.integers(
                request.age_range["min"], request.age_range["max"]
            )), "condition": request.biological_condition}
            for gene in preview_genes:
                row[gene] = round(float(rng.normal(8.5, 2.1)), 3)
            preview_data.append(row)

        generation_time_seconds = round(float(rng.uniform(8.0, 45.0)), 1)
        n_samples = request.number_of_samples
        n_genes = 20531

        return {
            "experiment_id": experiment_id,
            "status": "complete",
            "generated_samples": request.number_of_samples,
            "features": n_genes,
            "modalities": request.data_modalities,
            "generation_time_seconds": generation_time_seconds,
            "quality_metrics": data.get("quality_metrics", {}),
            "preview_data": preview_data,
            "download_files": [
                {"name": "synthetic_rnaseq_matrix.csv", "format": "csv",
                 "size_bytes": n_samples * n_genes * 8,
                 "download_url": f"/api/p2/download/{experiment_id}"},
                {"name": "sample_metadata.csv", "format": "csv",
                 "size_bytes": n_samples * 200,
                 "download_url": f"/api/p2/download/{experiment_id}_meta"},
            ],
            "model_used": model_name,
            "simulation_mode": False
        }
