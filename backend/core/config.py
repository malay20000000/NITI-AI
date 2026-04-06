from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGODB_URI: str = "mongodb://localhost:27017/resumescreener"
    OPENAI_API_KEY: str = ""
    
    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
