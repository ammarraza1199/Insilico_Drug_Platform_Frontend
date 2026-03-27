# api/p3_router.py
from fastapi import APIRouter, HTTPException
from schemas.p3_schemas import P3Request, P3Response
from controllers.p3_controller import P3Controller
from utils.logger import get_logger
from database import db

router = APIRouter()
logger = get_logger(__name__)


@router.post("/drug-screen", response_model=P3Response)
async def run_drug_screen(request: P3Request):
    """Run an in-silico drug screening experiment."""
    logger.info("PIPELINE: P3 Request Received", payload=request.model_dump())
    logger.info(f"BANNER: {'='*20} P3 SCREENING STARTING {'='*20}")
    try:
        controller = P3Controller()
        result = await controller.run(request)
        logger.info(f"BANNER: {'='*20} P3 SCREENING COMPLETED {'='*20}")
        return result
    except Exception as e:
        logger.error("PIPELINE: P3 screening failed", error=str(e))
        logger.info(f"BANNER: {'='*20} P3 SCREENING FAILED {'='*20}")
        raise HTTPException(status_code=500, detail=f"Drug screen failed: {str(e)}")

@router.get("/results/{experiment_id}", response_model=P3Response)
async def get_p3_result(experiment_id: str):
    experiment = await db.db.experiments.find_one({"_id": experiment_id, "type": "p3"})
    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found")
    return P3Response(**experiment["result_data"])
