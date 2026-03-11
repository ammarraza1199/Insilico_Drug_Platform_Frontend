# schemas/p3_schemas.py
from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Dict
from schemas.common import ModelConfig


class GeneTarget(BaseModel):
    gene: str
    expression_level: float
    direction: Literal["up", "down", "any"] = "any"


class P3Request(BaseModel):
    experiment_name: str
    project_id: Optional[str] = None
    tissue_type: str
    disease_condition: str
    age_range: Dict[str, int] = {"min": 40, "max": 80}
    gene_targets: List[GeneTarget] = []
    compound_smiles: Optional[List[str]] = None
    compound_file_id: Optional[str] = None
    screening_mode: Literal["broad", "targeted", "lead_optimization"] = "broad"
    max_compounds: int = Field(default=50, ge=5, le=500)
    pathway_focus: List[str] = []
    filter_toxicity: bool = True
    llm_config: ModelConfig = ModelConfig()


class DrugCandidate(BaseModel):
    rank: int
    compound_id: str
    compound_name: str
    smiles: str
    efficacy_score: float = Field(..., ge=0.0, le=1.0)
    selectivity_score: float = Field(..., ge=0.0, le=1.0)
    toxicity_flag: Optional[str] = None
    mechanism_of_action: str
    predicted_gene_changes: Dict[str, float]


class EnrichedPathway(BaseModel):
    pathway: str
    p_value: float
    enrichment_score: float
    gene_count: int
    genes: List[str]


class P3Response(BaseModel):
    experiment_id: str
    status: Literal["complete"] = "complete"
    compounds_screened: int
    top_candidates: List[DrugCandidate]
    enriched_pathways: List[EnrichedPathway]
    gene_expression_matrix: Dict[str, Dict[str, float]]  # gene → compound → fold_change
    model_used: str
    simulation_mode: bool = True
    runtime_ms: int
