# prompts/p2_prompts.py
from schemas.p2_schemas import P2Request


SYSTEM_PROMPT_P2 = """You are a bioinformatics AI specializing in synthetic multi-omics data generation.
You generate realistic statistical descriptions of synthetic biological datasets.
You MUST respond with ONLY a valid JSON object. No text outside the JSON."""


def build_p2_prompt(request: P2Request) -> str:
    modalities_str = ", ".join(request.data_modalities)
    condition_str = request.disease_state if request.disease_state else request.biological_condition
    species_str = ", ".join(request.species) if request.species else "human"

    return f"""Simulate quality metrics for a synthetic multi-omics dataset generation experiment.

Parameters:
- Species: {species_str}
- Tissue: {request.tissue_type}
- Condition: {condition_str}
- Age Range: {request.age_range['min']}–{request.age_range['max']} years
- Samples Requested: {request.number_of_samples}
- Modalities: {modalities_str}
- Noise Level: {request.noise_level}

Return ONLY this JSON (no other text):

{{
  "quality_metrics": {{
    "mean_expression_similarity": <float 0.85-0.98, how similar to real data>,
    "variance_preservation": <float 0.80-0.97>,
    "correlation_structure": <float 0.78-0.95>,
    "pca_variance_explained": [<float>, <float>, <float>]
  }},
  "generation_description": "<1-2 sentence scientific description of what was generated>",
  "key_biological_features": ["<feature 1>", "<feature 2>", "<feature 3>"],
  "recommended_use_cases": ["<use case 1>", "<use case 2>"]
}}

pca_variance_explained must have exactly 3 values that sum to less than 0.75.
Quality metrics should reflect the noise level (lower quality for high noise)."""
