# schemas/p2_schemas.py
from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Dict, Any
from schemas.common import ModelConfig


class P2Request(BaseModel):
    experiment_name: str
    project_id: Optional[str] = None
    tissue_type: str
    species: List[str] = ["human"]
    age_range: Dict[str, int] = {"min": 20, "max": 80}
    biological_condition: Literal["healthy", "disease", "treatment", "post_treatment"] = "healthy"
    disease_state: Optional[str] = None
    data_modalities: List[Literal["rna_seq", "methylation", "proteomics", "metabolomics"]] = ["rna_seq"]
    number_of_samples: int = Field(default=100, ge=10, le=10000)
    noise_level: Literal["low", "medium", "high"] = "medium"
    batch_effect_simulation: bool = False
    preserve_correlation_structure: bool = False
    seed: Optional[int] = None
    llm_config: ModelConfig = ModelConfig()


class QualityMetrics(BaseModel):
    mean_expression_similarity: float = Field(..., ge=0.0, le=1.0)
    variance_preservation: float = Field(..., ge=0.0, le=1.0)
    correlation_structure: float = Field(..., ge=0.0, le=1.0)
    pca_variance_explained: List[float]


class DownloadFile(BaseModel):
    name: str
    format: str
    size_bytes: int
    download_url: str


class P2Response(BaseModel):
    experiment_id: str
    status: Literal["complete"] = "complete"
    generated_samples: int
    features: int
    modalities: List[str]
    generation_time_seconds: float
    quality_metrics: QualityMetrics
    preview_data: List[Dict[str, Any]]    # First 5 rows as list of dicts
    download_files: List[DownloadFile]
    model_used: str
    simulation_mode: bool = True
