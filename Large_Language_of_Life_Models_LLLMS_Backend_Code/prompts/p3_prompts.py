# prompts/p3_prompts.py
from schemas.p3_schemas import P3Request


SYSTEM_PROMPT_P3 = """You are a computational drug discovery AI specializing in in-silico drug screening.
You simulate drug perturbation experiments and identify therapeutic candidates.
You MUST respond with ONLY a valid JSON object. No text outside the JSON."""


def build_p3_prompt(request: P3Request) -> str:
    gene_targets_str = ", ".join([g.gene for g in request.gene_targets]) if request.gene_targets else "general disease targets"
    pathways_str = ", ".join(request.pathway_focus) if request.pathway_focus else "mTOR, PI3K, p53, HDAC"

    return f"""Simulate an in-silico drug screening experiment for the following parameters:

Disease: {request.disease_condition}
Tissue: {request.tissue_type}
Age Range: {request.age_range['min']}–{request.age_range['max']} years
Gene Targets: {gene_targets_str}
Pathway Focus: {pathways_str}
Screening Mode: {request.screening_mode}
Max Compounds to Screen: {request.max_compounds}
Filter Toxicity/ADME: {request.filter_toxicity}

Return ONLY this JSON structure (no other text):

{{
  "top_candidates": [
    {{
      "rank": <integer starting at 1>,
      "compound_id": "CPD-<4-digit number>",
      "compound_name": "<realistic drug or research compound name>",
      "smiles": "<valid simplified SMILES string>",
      "efficacy_score": <float 0.6-0.98>,
      "selectivity_score": <float 0.5-0.95>,
      "toxicity_flag": <null or "hepatotoxic" or "cardiotoxic">,
      "mechanism_of_action": "<specific biological mechanism>",
      "predicted_gene_changes": {{
        "<gene_name>": <float, log2 fold change -3.0 to 3.0>
      }}
    }}
  ],
  "enriched_pathways": [
    {{
      "pathway": "<biological pathway name>",
      "p_value": <float 0.0001-0.05>,
      "enrichment_score": <float 1.5-4.0>,
      "gene_count": <integer 5-50>,
      "genes": ["<gene1>", "<gene2>", "<gene3>"]
    }}
  ]
}}

Include exactly 5 top candidates and exactly 4 enriched pathways.
Use real drug compound names where possible (e.g., Rapamycin, Metformin, Resveratrol, NAD+ precursors).
Include toxicity_flag as null for at least 3 compounds.
predicted_gene_changes must include 3-5 real gene names."""
