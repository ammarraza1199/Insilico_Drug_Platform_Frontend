# simulation/p3_simulation.py
import numpy as np
import uuid
from utils.biology_constants import DRUG_CANDIDATES, PATHWAYS, COMMON_GENES


class P3Simulator:

    def __init__(self, seed: int = 42):
        self.rng = np.random.default_rng(seed)

    def simulate(self, request) -> dict:
        n_compounds = min(request.max_compounds, 5)
        target_genes = [g.gene for g in request.gene_targets] or list(COMMON_GENES[:5])

        candidates = []
        for i in range(n_compounds):
            drug = DRUG_CANDIDATES[i % len(DRUG_CANDIDATES)]
            gene_changes = {g: round(float(self.rng.normal(0, 1.5)), 3) for g in target_genes[:4]}
            candidates.append({
                "rank": i + 1,
                "compound_id": f"CPD-{1000 + i:04d}",
                "compound_name": drug["name"],
                "smiles": drug["smiles"],
                "efficacy_score": round(float(self.rng.uniform(0.65, 0.97 - i * 0.05)), 4),
                "selectivity_score": round(float(self.rng.uniform(0.55, 0.93)), 4),
                "toxicity_flag": None if i < 3 else self.rng.choice(["hepatotoxic", None]),
                "mechanism_of_action": drug["mechanism"],
                "predicted_gene_changes": gene_changes
            })

        pathways = []
        for pw in PATHWAYS[:4]:
            pathways.append({
                "pathway": pw["name"],
                "p_value": round(float(self.rng.uniform(0.0001, 0.04)), 5),
                "enrichment_score": round(float(self.rng.uniform(1.8, 3.9)), 3),
                "gene_count": int(self.rng.integers(8, 40)),
                "genes": list(self.rng.choice(list(COMMON_GENES), size=5, replace=False))
            })

        # Gene expression matrix
        gene_expr_matrix = {}
        for gene in target_genes[:6]:
            gene_expr_matrix[gene] = {
                c["compound_name"]: round(float(self.rng.normal(0, 1.2)), 3)
                for c in candidates
            }

        return {
            "experiment_id": str(uuid.uuid4()),
            "status": "complete",
            "compounds_screened": int(self.rng.integers(10000, 60000)),
            "top_candidates": candidates,
            "enriched_pathways": pathways,
            "gene_expression_matrix": gene_expr_matrix,
            "model_used": "simulation_fallback",
            "simulation_mode": True,
            "runtime_ms": int(self.rng.integers(5000, 25000))
        }
