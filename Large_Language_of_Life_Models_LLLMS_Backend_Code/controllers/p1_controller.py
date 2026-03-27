# controllers/p1_controller.py
import time
import uuid
from schemas.p1_schemas import P1Request, P1Response
from llm.client_factory import get_llm_client
from llm.response_parser import ResponseParser
from llm.model_registry import validate_model
from prompts.p1_prompts import SYSTEM_PROMPT_P1, build_p1_prompt
from simulation.p1_simulation import P1Simulator
from config import settings
from utils.logger import get_logger
from services.experiment_service import log_experiment

logger = get_logger(__name__)


class P1Controller:

    async def run(self, request: P1Request) -> P1Response:
        start_time = time.time()
        experiment_id = str(uuid.uuid4())

        # 1. Validate and resolve model
        model_name = validate_model(request.llm_config.model_name)
        logger.info("Running P1 experiment", model=model_name, experiment_id=experiment_id)

        # 2. Build prompt
        user_prompt = build_p1_prompt(request)
        logger.info("PIPELINE: P1 Prompt Constructed", length=len(user_prompt))
        logger.debug(f"FULL PROMPT P1: {user_prompt}")

        # 3. Call LLM
        raw_output = None
        llm_success = False

        try:
            client = get_llm_client(model_name)
            raw_output = await client.generate_with_retry(
                model=model_name,
                prompt=user_prompt,
                system_prompt=SYSTEM_PROMPT_P1,
                temperature=request.llm_config.temperature,
                max_tokens=request.llm_config.max_tokens,
            )
            logger.debug("LLM raw output received", length=len(raw_output))
        except Exception as e:
            logger.warning("LLM call failed, using fallback", error=str(e))

        # 4. Parse JSON from LLM output
        parsed_data = None
        if raw_output:
            parsed_data = ResponseParser.extract_json(raw_output)

        # 5. Validate against schema or use fallback
        if parsed_data:
            try:
                result_data = self._build_response(
                    parsed_data, request, experiment_id, model_name, start_time
                )
                llm_success = True
                logger.info("LLM response validated successfully", experiment_id=experiment_id)
            except Exception as e:
                logger.warning("LLM response failed schema validation, using fallback",
                               error=str(e))
                parsed_data = None

        if not parsed_data or not llm_success:
            logger.info("Using simulation fallback", experiment_id=experiment_id)
            simulator = P1Simulator(seed=settings.simulation_seed)
            result_data = simulator.simulate(request.chronological_age, request.tissue_type)
            result_data["experiment_id"] = experiment_id

        # Async save to DB using stubbed request info (assuming token extracted in router or mock for now)
        project_id = getattr(request, 'project_id', 'default_project')
        user_id = getattr(request, 'user_id', 'anonymous_user')
        
        await log_experiment(
            experiment_id=experiment_id,
            user_id=user_id,
            project_id=project_id,
            exp_type="p1",
            request_payload=request.model_dump(),
            result_data=result_data
        )

        return P1Response(**result_data)

    def _build_response(self, data: dict, request: P1Request,
                        experiment_id: str, model_name: str, start_time: float) -> dict:
        """Map LLM parsed output to P1Response schema."""
        runtime_ms = int((time.time() - start_time) * 1000)
        bio_age = float(data["predicted_biological_age"])
        chron_age = request.chronological_age
        acceleration = bio_age - chron_age

        age_class = "normal"
        if acceleration > 3.0:
            age_class = "accelerated"
        elif acceleration < -3.0:
            age_class = "decelerated"

        return {
            "experiment_id": experiment_id,
            "status": "complete",
            "predicted_biological_age": round(bio_age, 1),
            "chronological_age": chron_age,
            "age_acceleration_score": round(acceleration, 2),
            "age_acceleration_class": age_class,
            "shap_genes": data.get("shap_genes", []),
            "disease_classification": data.get("disease_classification", {}),
            "therapeutic_targets": data.get("therapeutic_targets", []),
            "model_used": model_name,
            "simulation_mode": False,
            "runtime_ms": runtime_ms
        }
