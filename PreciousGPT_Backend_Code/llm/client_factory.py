# llm/client_factory.py
from llm.model_registry import SUPPORTED_MODELS
from llm.ollama_client import OllamaClient
from llm.groq_client import GroqClient
from config import settings

def get_llm_client(model_name: str):
    """
    Returns the appropriate LLM client based on the requested model's provider.
    Defaults to the application's default model if not found.
    """
    model_config = SUPPORTED_MODELS.get(model_name)
    if not model_config:
        model_name = settings.default_model
        model_config = SUPPORTED_MODELS.get(model_name, {})
        
    provider = model_config.get("provider", "ollama")
    
    if provider == "groq":
        return GroqClient()
    
    return OllamaClient()
