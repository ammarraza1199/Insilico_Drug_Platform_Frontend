# api/project_router.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timezone
import uuid
from database import db
from utils.auth import get_current_user
from utils.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)

class ProjectCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime

@router.get("", response_model=List[ProjectResponse])
async def list_projects(current_user: dict = Depends(get_current_user)):
    projects_collection = db.db.projects
    cursor = projects_collection.find({"user_id": current_user["sub"]}).sort("updated_at", -1)
    
    projects = []
    async for doc in cursor:
        projects.append(ProjectResponse(
            id=doc["_id"],
            name=doc["name"],
            description=doc.get("description"),
            created_at=doc["created_at"],
            updated_at=doc["updated_at"]
        ))
        
    return projects

@router.post("", response_model=ProjectResponse)
async def create_project(request: ProjectCreateRequest, current_user: dict = Depends(get_current_user)):
    projects_collection = db.db.projects
    
    now = datetime.now(timezone.utc)
    new_project = {
        "_id": str(uuid.uuid4()),
        "user_id": current_user["sub"],
        "name": request.name,
        "description": request.description,
        "created_at": now,
        "updated_at": now
    }
    
    await projects_collection.insert_one(new_project)
    logger.info("Project created", project_id=new_project["_id"], user_id=current_user["sub"])
    
    return ProjectResponse(
        id=new_project["_id"],
        name=new_project["name"],
        description=new_project["description"],
        created_at=new_project["created_at"],
        updated_at=new_project["updated_at"]
    )
