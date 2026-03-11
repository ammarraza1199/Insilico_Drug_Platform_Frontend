# simulation/p1_simulation.py
import numpy as np
import uuid
from typing import List
from utils.biology_constants import AGING_GENES, CHROMOSOMES


class P1Simulator:
    """
    Deterministic biological aging clock simulator.
    Used when LLM output fails validation.
    """

    def __init__(self, seed: int = 42):
        self.rng = np.random.default_rng(seed)

    def simulate(self, chronological_age: float, tissue_type: str) -> dict:
        # Biological age: chronological ± random acceleration
        acceleration = float(self.rng.normal(loc=0, scale=4.5))
        biological_age = round(chronological_age + acceleration, 1)
        biological_age = max(0.0, min(120.0, biological_age))

        age_class = "normal"
        if acceleration > 3.0:
            age_class = "accelerated"
        elif acceleration < -3.0:
            age_class = "decelerated"

        # SHAP gene rankings
        selected_genes = self.rng.choice(AGING_GENES, size=15, replace=False)
        shap_genes = []
        for gene in selected_genes:
            shap_val = float(self.rng.uniform(0.1, 0.95))
            expr_level = float(self.rng.normal(0, 1.5))
            shap_genes.append({
                "gene": gene,
                "shap_value": round(shap_val, 4),
                "expression_level": round(expr_level, 3),
                "direction": "up" if expr_level > 0 else "down",
                "chromosome": self.rng.choice(CHROMOSOMES),
                "known_aging_gene": bool(self.rng.choice([True, False], p=[0.7, 0.3]))
            })
        shap_genes.sort(key=lambda x: x["shap_value"], reverse=True)

        # Disease classification
        base_risk = min(1.0, chronological_age / 100)
        disease_probs = {
            "alzheimers": round(float(self.rng.beta(2, 8) * base_risk), 4),
            "parkinsons": round(float(self.rng.beta(1, 10) * base_risk), 4),
            "cardiovascular": round(float(self.rng.beta(3, 7) * base_risk), 4),
            "type2_diabetes": round(float(self.rng.beta(2, 7) * base_risk), 4),
            "cancer": round(float(self.rng.beta(2, 8) * base_risk), 4),
        }

        # Therapeutic targets
        target_genes = self.rng.choice(AGING_GENES, size=5, replace=False)
        therapeutic_targets = [{
            "gene": gene,
            "score": round(float(self.rng.uniform(0.5, 0.98)), 4),
            "known_drug_target": bool(self.rng.choice([True, False], p=[0.6, 0.4])),
            "actionability_score": round(float(self.rng.uniform(4.0, 9.5)), 2),
            "mechanism": f"Regulates {self.rng.choice(['mTOR', 'SIRT1', 'NF-kB', 'p53', 'AMPK'])} pathway"
        } for gene in target_genes]

        return {
            "experiment_id": str(uuid.uuid4()),
            "predicted_biological_age": biological_age,
            "chronological_age": chronological_age,
            "age_acceleration_score": round(acceleration, 2),
            "age_acceleration_class": age_class,
            "shap_genes": shap_genes,
            "disease_classification": disease_probs,
            "therapeutic_targets": therapeutic_targets,
            "model_used": "simulation_fallback",
            "simulation_mode": True,
            "runtime_ms": int(self.rng.integers(800, 3500))
        }
