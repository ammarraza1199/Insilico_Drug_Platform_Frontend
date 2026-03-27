# llm/groq_client.py
from groq import AsyncGroq
from config import settings
from utils.logger import get_logger

logger = get_logger(__name__)

class GroqClient:
    """
    Async client for the Groq API.
    Handles high-speed inference for medical/biological models.
    """
    def __init__(self):
        self.api_key = settings.groq_api_key
        if not self.api_key:
            raise ValueError("Groq API key is missing. Please set GROQ_API_KEY in your .env file.")
        self.client = AsyncGroq(api_key=self.api_key)

    async def generate(
        self,
        model: str,
        prompt: str,
        system_prompt: str,
        temperature: float = 0.3,
        max_tokens: int = 2048,
    ) -> str:
        """
        Call Groq Chat Completions endpoint.
        Returns the raw text response.
        """
        logger.info(f"BANNER: >>> CALLING LLM ({model}) <<<")
        try:
            completion = await self.client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=temperature,
                max_tokens=max_tokens,
            )
            
            raw_text = completion.choices[0].message.content
            logger.info(f"BANNER: <<< LLM RESPONSE RECEIVED ({len(raw_text)} chars) >>>")
            logger.debug("Groq API responded", response_length=len(raw_text))
            return raw_text
        except Exception as e:
            logger.error(f"Groq API call failed", error=str(e))
            raise e

    async def generate_with_retry(self, model: str, prompt: str, system_prompt: str, **kwargs) -> str:
        """Retry logic for Groq (simplified for SDK)."""
        retries = settings.ollama_max_retries # Reusing standard max_retries config
        last_error = None
        for attempt in range(retries + 1):
            try:
                return await self.generate(model, prompt, system_prompt, **kwargs)
            except Exception as e:
                logger.warning(f"Groq API error on attempt {attempt + 1}", error=str(e))
                last_error = e
        if last_error:
            raise last_error
        raise Exception("Failed to generate response after retries")
