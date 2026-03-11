# api/experiment_router.py
from fastapi import APIRouter, Depends
from typing import List
from database import db
from utils.auth import get_current_user
from utils.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)

@router.get("")
async def list_experiments(current_user: dict = Depends(get_current_user)):
    """Fetch history of all experiments for the logged in user."""
    experiments_collection = db.db.experiments
    cursor = experiments_collection.find(
        {"user_id": current_user["sub"]},
        {"result_data": 0} # Don't fetch full results to save bandwidth on list
    ).sort("created_at", -1)
    
    experiments = []
    async for doc in cursor:
        experiments.append({
            "id": doc["_id"],
            "project_id": doc["project_id"],
            "type": doc["type"],
            "status": doc["status"],
            "request_summary": doc.get("request_payload", {}),
            "created_at": doc["created_at"]
        })
        
    return experiments
