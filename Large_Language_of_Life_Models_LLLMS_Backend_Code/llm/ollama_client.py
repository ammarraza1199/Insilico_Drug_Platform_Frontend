# llm/ollama_client.py
import httpx
import json
from typing import Optional, Dict, Any
from config import settings
from utils.logger import get_logger

logger = get_logger(__name__)


class OllamaClient:
    """
    Async client for the Ollama local LLM API.
    Handles generation, availability checks, and error recovery.
    """

    def __init__(self, base_url: Optional[str] = None, timeout: Optional[int] = None):
        self.base_url = base_url or settings.ollama_base_url
        self.timeout = timeout or settings.ollama_timeout

    async def generate(
        self,
        model: str,
        prompt: str,
        system_prompt: str,
        temperature: float = 0.3,
        max_tokens: int = 2048,
    ) -> str:
        """
        Call Ollama /api/generate endpoint.
        Returns the raw text response from the model.
        """
        payload = {
            "model": model,
            "prompt": prompt,
            "system": system_prompt,
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens,
                "top_p": 0.9,
                "stop": ["```", "---"]  # Stop tokens to prevent markdown leakage
            }
        }

        logger.debug("Calling Ollama", model=model, prompt_length=len(prompt))

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                f"{self.base_url}/api/generate",
                json=payload
            )
            response.raise_for_status()
            data = response.json()
            raw_text = data.get("response", "")
            logger.debug("Ollama responded", response_length=len(raw_text))
            return raw_text

    async def check_availability(self) -> bool:
        """Check if Ollama is running and reachable."""
        try:
            async with httpx.AsyncClient(timeout=5) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                return response.status_code == 200
        except Exception:
            return False

    async def list_models(self) -> list:
        """List models currently available in Ollama."""
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                data = response.json()
                return [m["name"] for m in data.get("models", [])]
        except Exception:
            return []

    async def generate_with_retry(self, model: str, prompt: str,
                                   system_prompt: str, **kwargs) -> str:
        """Retry LLM generation up to max_retries times."""
        last_error = None
        for attempt in range(settings.ollama_max_retries + 1):
            try:
                return await self.generate(model, prompt, system_prompt, **kwargs)
            except httpx.TimeoutException as e:
                logger.warning(f"LLM timeout on attempt {attempt + 1}", model=model)
                last_error = e
            except httpx.HTTPStatusError as e:
                logger.warning(f"LLM HTTP error on attempt {attempt + 1}", status=e.response.status_code)
                last_error = e
                if e.response.status_code == 404:
                    # Model not found — don't retry
                    raise ValueError(f"Model '{model}' not found in Ollama. Run: ollama pull {model}")
        raise last_error
