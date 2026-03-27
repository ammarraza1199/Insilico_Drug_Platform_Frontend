# api/health_router.py
from fastapi import APIRouter
from llm.ollama_client import OllamaClient
from llm.model_registry import SUPPORTED_MODELS
from config import settings

router = APIRouter()


@router.get("/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}


@router.get("/health/ollama")
async def ollama_health():
    """Check Ollama availability and list running models."""
    client = OllamaClient()
    available = await client.check_availability()
    return {
        "ollama_available": available,
        "ollama_url": settings.ollama_base_url,
        "default_model": settings.default_model,
        "supported_models": SUPPORTED_MODELS
    }
