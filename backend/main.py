from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings

app = FastAPI(title="NITI AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient(settings.MONGODB_URI)
    app.mongodb = app.mongodb_client.get_default_database()

@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()

from routers import analyze, auth
app.include_router(analyze.router)
app.include_router(auth.router)

@app.get("/")
async def root():
    return {"message": "AI Resume Screener API is running"}
