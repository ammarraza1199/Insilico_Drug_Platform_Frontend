# services/experiment_service.py
from datetime import datetime, timezone
from database import db
from utils.logger import get_logger

logger = get_logger(__name__)

async def log_experiment(experiment_id: str, user_id: str, project_id: str,
                         exp_type: str, request_payload: dict, result_data: dict) -> None:
    """Save an experiment and its outcome to MongoDB."""
    try:
        experiments_collection = db.db.experiments
        now = datetime.now(timezone.utc)
        
        experiment_doc = {
            "_id": experiment_id,
            "user_id": user_id,
            "project_id": project_id,
            "type": exp_type,
            "status": result_data.get("status", "complete"),
            "request_payload": request_payload,
            "result_data": result_data,
            "created_at": now,
            "updated_at": now
        }
        
        await experiments_collection.insert_one(experiment_doc)
        logger.info("Experiment saved to DB", experiment_id=experiment_id, type=exp_type)
    except Exception as e:
        logger.error("Failed to save experiment to DB", experiment_id=experiment_id, error=str(e))
