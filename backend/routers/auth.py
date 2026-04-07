from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from services.auth_service import get_password_hash, verify_password, create_access_token, decode_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class UserSignup(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    target_role: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

@router.post("/signup")
async def signup(request: Request, user: UserSignup):
    db: AsyncIOMotorDatabase = request.app.mongodb
    
    # Check if user exists
    existing_user = await db["users"].find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_dict = user.dict()
    password = user_dict.pop("password")
    user_dict["hashed_password"] = get_password_hash(password)
    user_dict["is_active"] = True
    user_dict["created_at"] = datetime.utcnow()
    
    result = await db["users"].insert_one(user_dict)
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "user": {"full_name": user.full_name, "email": user.email}}

@router.post("/login")
async def login(request: Request, credentials: UserLogin):
    db: AsyncIOMotorDatabase = request.app.mongodb
    
    user = await db["users"].find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user["email"]})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user": {
            "full_name": user["full_name"], 
            "email": user["email"],
            "target_role": user.get("target_role")
        }
    }

@router.get("/check-email")
async def check_email(request: Request, email: str):
    db: AsyncIOMotorDatabase = request.app.mongodb
    user = await db["users"].find_one({"email": email})
    return {"available": user is None}

@router.get("/me")
async def get_me(request: Request):
    # This is a simplified version, usually you'd use a dependency for this
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = auth_header.split(" ")[1]
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    email = payload.get("sub")
    db: AsyncIOMotorDatabase = request.app.mongodb
    user = await db["users"].find_one({"email": email})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # AI Personalization Message
    role = user.get("target_role", "Developer")
    welcome_msg = f"Welcome back, {user['full_name'].split()[0]}. Ready to beat the ATS for that {role} role today?"
    
    return {
        "full_name": user["full_name"],
        "email": user["email"],
        "target_role": role,
        "welcome_message": welcome_msg,
        "avatar": f"https://api.dicebear.com/7.x/bottts/svg?seed={role}" # Simple AI Avatar for now
    }
