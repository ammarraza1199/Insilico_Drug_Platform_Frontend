# api/p1_router.py
from fastapi import APIRouter, HTTPException, Depends
from schemas.p1_schemas import P1Request, P1Response
from controllers.p1_controller import P1Controller
from utils.logger import get_logger
from database import db

router = APIRouter()
logger = get_logger(__name__)


@router.post("/predict-age", response_model=P1Response)
async def predict_biological_age(request: P1Request):
    """
    Run a biological age prediction experiment.
    Accepts omics parameters, returns age prediction with SHAP gene rankings.
    """
    logger.info("PIPELINE: P1 Request Received", 
                payload=request.model_dump(),
                client_ip="captured")
    
    logger.info(f"BANNER: {'='*20} P1 MODEL STARTING {'='*20}")
    try:
        controller = P1Controller()
        result = await controller.run(request)
        logger.info(f"BANNER: {'='*20} P1 MODEL COMPLETED {'='*20}")
        return result
    except Exception as e:
        logger.error("PIPELINE: P1 experiment failed", error=str(e))
        logger.info(f"BANNER: {'='*20} P1 MODEL FAILED {'='*20}")
        raise HTTPException(status_code=500, detail=f"Experiment failed: {str(e)}")

@router.get("/results/{experiment_id}", response_model=P1Response)
async def get_p1_result(experiment_id: str):
    experiment = await db.db.experiments.find_one({"_id": experiment_id, "type": "p1"})
    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found")
    return P1Response(**experiment["result_data"])

@router.get("/jobs/{experiment_id}/status")
async def get_p1_status(experiment_id: str):
    experiment = await db.db.experiments.find_one({"_id": experiment_id, "type": "p1"})
    if not experiment:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"status": experiment.get("status", "complete")}
