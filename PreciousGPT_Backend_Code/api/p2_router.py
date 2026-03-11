# api/p2_router.py
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from schemas.p2_schemas import P2Request, P2Response
from controllers.p2_controller import P2Controller
from utils.logger import get_logger
from database import db
import io

router = APIRouter()
logger = get_logger(__name__)


@router.post("/generate-data", response_model=P2Response)
async def generate_synthetic_data(request: P2Request):
    """Generate a synthetic multi-omics dataset."""
    logger.info("PIPELINE: P2 Request Received", payload=request.model_dump())
    logger.info(f"BANNER: {'='*20} P2 GENERATOR STARTING {'='*20}")
    try:
        controller = P2Controller()
        result = await controller.run(request)
        logger.info(f"BANNER: {'='*20} P2 GENERATOR COMPLETED {'='*20}")
        return result
    except Exception as e:
        logger.error("PIPELINE: P2 generation failed", error=str(e))
        logger.info(f"BANNER: {'='*20} P2 GENERATOR FAILED {'='*20}")
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@router.get("/results/{experiment_id}", response_model=P2Response)
async def get_p2_result(experiment_id: str):
    experiment = await db.db.experiments.find_one({"_id": experiment_id, "type": "p2"})
    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found")
    return P2Response(**experiment["result_data"])

@router.get("/download/{experiment_id}")
async def download_dataset(experiment_id: str):
    """Download a previously generated synthetic dataset as CSV."""
    # In production: retrieve from storage. For demo: regenerate.
    from simulation.p2_simulation import P2Simulator
    sim = P2Simulator(seed=42)
    csv_bytes = sim.generate_csv_bytes(n_samples=100, n_genes=500)
    return StreamingResponse(
        io.BytesIO(csv_bytes),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=synthetic_{experiment_id}.csv"}
    )
