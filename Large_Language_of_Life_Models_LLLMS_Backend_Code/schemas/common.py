# schemas/common.py
from pydantic import BaseModel, Field
from typing import Optional, Literal


class ModelConfig(BaseModel):
    model_name: str = Field(
        default="phi3:mini",
        description="Ollama model tag to use for this experiment"
    )
    temperature: float = Field(default=0.3, ge=0.0, le=2.0)
    max_tokens: int = Field(default=2048, ge=256, le=8192)
    provider: Literal["ollama", "openai", "anthropic"] = "ollama"
    endpoint_url: Optional[str] = None
    api_key: Optional[str] = None
