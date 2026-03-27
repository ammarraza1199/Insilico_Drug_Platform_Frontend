# config.py
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # LLM Providers
    groq_api_key: str = ""
    default_model: str = "llama-3.3-70b-versatile" # Switched to Groq as default
    
    # Ollama
    ollama_base_url: str = "http://localhost:11434"
    ollama_timeout: int = 120  # seconds
    ollama_max_retries: int = 2

    # API
    allowed_origins: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    api_key_secret: str = "dev-secret-change-in-production"

    # Database
    mongo_uri: str = "mongodb+srv://ammarraza1199_db_user:Ae6Vg1sTLxQFttyy@cluster0.3199ewf.mongodb.net/preciousgpt?appName=Cluster0"
    
    # Simulation
    fallback_enabled: bool = True
    simulation_seed: int = 42

    class Config:
        env_file = ".env"


settings = Settings()
