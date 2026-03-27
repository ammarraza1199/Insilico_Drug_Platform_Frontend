# prompts/p1_prompts.py
from schemas.p1_schemas import P1Request


SYSTEM_PROMPT_P1 = """You are a computational biology AI specializing in epigenetic aging clocks.
You analyze multi-omics data to predict biological aging and identify aging biomarkers.
You MUST respond with ONLY a valid JSON object. Do not include any explanation, preamble, 
markdown formatting, or text outside the JSON. The JSON must exactly match the schema provided."""


def build_p1_prompt(request: P1Request) -> str:
    return f"""Simulate a biological age prediction analysis for the following experiment:

Tissue Type: {request.tissue_type}
Species: {request.species}
Chronological Age: {request.chronological_age} years
Sex: {request.sex}
Data Available: {'DNA methylation + RNA-seq' if request.rna_seq_file_id else 'DNA methylation only'}

Generate realistic biological aging analysis results. The biological age should be plausible 
given the chronological age (typically within ±15 years). Include real aging-associated genes 
(ELOVL2, FHL2, PENK, KLF14, TRIM59, CSNK1D, and others appropriate for {request.tissue_type} tissue).

Return ONLY this exact JSON structure with no additional text:

{{
  "predicted_biological_age": <number, realistic age in years>,
  "age_acceleration_score": <number, biological_age minus chronological_age>,
  "shap_genes": [
    {{
      "gene": "<real aging gene name>",
      "shap_value": <float 0.0-1.0, importance score>,
      "expression_level": <float, log2 fold change>,
      "direction": "<up or down>",
      "chromosome": "<chromosome number e.g. chr1>",
      "known_aging_gene": <true or false>
    }}
  ],
  "disease_classification": {{
    "alzheimers": <float 0.0-1.0>,
    "parkinsons": <float 0.0-1.0>,
    "cardiovascular": <float 0.0-1.0>,
    "type2_diabetes": <float 0.0-1.0>,
    "cancer": <float 0.0-1.0>
  }},
  "therapeutic_targets": [
    {{
      "gene": "<gene name>",
      "score": <float 0.0-1.0>,
      "known_drug_target": <true or false>,
      "actionability_score": <float 0.0-10.0>,
      "mechanism": "<brief mechanism description>"
    }}
  ]
}}

Include exactly 15 SHAP genes and exactly 5 therapeutic targets.
Disease probabilities must sum to less than 2.0.
Use only real human gene names."""
