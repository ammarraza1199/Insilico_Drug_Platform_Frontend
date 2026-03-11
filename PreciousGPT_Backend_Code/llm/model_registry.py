# llm/model_registry.py
from typing import Dict, Any

SUPPORTED_MODELS: Dict[str, Dict[str, Any]] = {
    "llama-3.3-70b-versatile": {
        "display_name": "Llama 3.3 70B (Groq)",
        "provider": "groq",
        "recommended": True,
        "description": "State-of-the-art biological reasoning, extremely fast."
    },
    "mixtral-8x7b-32768": {
        "display_name": "Mixtral 8x7B (Groq)",
        "provider": "groq",
        "recommended": False,
        "description": "High context window for massive token ingestion."
    },
    "phi3:mini": {
        "display_name": "Phi-3 Mini (Local)",
        "provider": "ollama",
        "recommended": False,
        "description": "Fast local fallback model."
    },
    "llama3.2:3b": {
        "display_name": "Llama 3.2 3B (Local)",
        "provider": "ollama",
        "recommended": False,
        "description": "Lightweight Llama 3.2 variant."
    }
}


def validate_model(model_name: str) -> str:
    """Return model name if supported, else return default."""
    from config import settings
    if model_name in SUPPORTED_MODELS:
        return model_name
    return settings.default_model
