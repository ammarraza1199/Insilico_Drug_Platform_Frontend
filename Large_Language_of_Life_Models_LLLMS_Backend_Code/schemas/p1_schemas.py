# schemas/p1_schemas.py
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Literal, Dict
from schemas.common import ModelConfig


class P1Request(BaseModel):
    experiment_name: str = Field(..., min_length=1, max_length=200)
    project_id: Optional[str] = None
    tissue_type: str = Field(..., description="e.g. blood, brain, liver")
    species: Literal["human", "mouse", "rat", "zebrafish"] = "human"
    chronological_age: float = Field(..., ge=0, le=120)
    sex: Literal["male", "female", "unknown"] = "unknown"
    methylation_file_id: Optional[str] = None
    rna_seq_file_id: Optional[str] = None
    preprocessing_options: List[str] = []
    llm_config: ModelConfig = ModelConfig()

    @field_validator("tissue_type", mode="before")
    @classmethod
    def normalize_tissue(cls, v: str) -> str:
        return str(v).lower().strip()


class ShapGene(BaseModel):
    gene: str
    shap_value: float = Field(..., ge=0.0, le=1.0)
    expression_level: float
    direction: Literal["up", "down", "neutral"]
    chromosome: Optional[str] = None
    known_aging_gene: bool = False


class DiseaseClassification(BaseModel):
    alzheimers: float = Field(..., ge=0.0, le=1.0)
    parkinsons: float = Field(..., ge=0.0, le=1.0)
    cardiovascular: float = Field(..., ge=0.0, le=1.0)
    type2_diabetes: float = Field(..., ge=0.0, le=1.0)
    cancer: float = Field(..., ge=0.0, le=1.0)


class TherapeuticTarget(BaseModel):
    gene: str
    score: float = Field(..., ge=0.0, le=1.0)
    known_drug_target: bool
    actionability_score: float = Field(..., ge=0.0, le=10.0)
    mechanism: Optional[str] = None


class P1Response(BaseModel):
    experiment_id: str
    status: Literal["complete"] = "complete"
    predicted_biological_age: float
    chronological_age: float
    age_acceleration_score: float
    age_acceleration_class: Literal["normal", "accelerated", "decelerated"]
    shap_genes: List[ShapGene]
    disease_classification: DiseaseClassification
    therapeutic_targets: List[TherapeuticTarget]
    model_used: str
    simulation_mode: bool = True
    runtime_ms: int
