# api/auth_router.py
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from datetime import datetime, timezone
import uuid
from database import db
from utils.auth import get_password_hash, verify_password, create_access_token, get_current_user
from utils.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "researcher"

class AuthResponse(BaseModel):
    token: str
    user: dict

@router.post("/register", response_model=AuthResponse)
async def register(request: RegisterRequest):
    users_collection = db.db.users
    
    existing_user = await users_collection.find_one({"email": request.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = get_password_hash(request.password)
    
    new_user = {
        "_id": str(uuid.uuid4()),
        "name": request.name,
        "email": request.email,
        "password_hash": hashed_password,
        "role": request.role,
        "created_at": datetime.now(timezone.utc)
    }
    
    await users_collection.insert_one(new_user)
    logger.info("New user registered", user_id=new_user["_id"])
    
    user_payload = {"sub": new_user["_id"], "email": new_user["email"], "role": new_user["role"]}
    token = create_access_token(user_payload)
    
    return {"token": token, "user": {"id": new_user["_id"], "name": new_user["name"], "email": new_user["email"], "role": new_user["role"]}}

@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    users_collection = db.db.users
    user = await users_collection.find_one({"email": request.email})
    
    if not user or not verify_password(request.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    user_payload = {"sub": user["_id"], "email": user["email"], "role": user["role"]}
    token = create_access_token(user_payload)
    logger.info("User logged in", user_id=user["_id"])
    
    return {"token": token, "user": {"id": user["_id"], "name": user["name"], "email": user["email"], "role": user["role"]}}

@router.get("/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    users_collection = db.db.users
    user = await users_collection.find_one({"_id": current_user["sub"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {"id": user["_id"], "name": user["name"], "email": user["email"], "role": user["role"]}

@router.post("/logout")
async def logout():
    # Typically stateless JWT uses client-side discarding, but we supply this endpoint for potential token blacklisting logic
    return {"success": True}
