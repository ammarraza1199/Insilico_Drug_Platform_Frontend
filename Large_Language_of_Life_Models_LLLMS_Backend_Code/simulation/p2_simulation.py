# simulation/p2_simulation.py
import numpy as np
import pandas as pd
import uuid
import io
from utils.biology_constants import COMMON_GENES


class P2Simulator:

    def __init__(self, seed: int = 42):
        self.rng = np.random.default_rng(seed)

    def simulate(self, request) -> dict:
        n_samples = request.number_of_samples
        n_genes = 20531  # Standard human gene count

        noise_factor = {"low": 0.05, "medium": 0.15, "high": 0.35}.get(request.noise_level, 0.15)

        quality = {
            "mean_expression_similarity": round(float(self.rng.uniform(0.88, 0.97) - noise_factor * 0.3), 4),
            "variance_preservation": round(float(self.rng.uniform(0.84, 0.95) - noise_factor * 0.2), 4),
            "correlation_structure": round(float(self.rng.uniform(0.80, 0.93) - noise_factor * 0.4), 4),
            "pca_variance_explained": [
                round(float(self.rng.uniform(0.28, 0.38)), 4),
                round(float(self.rng.uniform(0.15, 0.22)), 4),
                round(float(self.rng.uniform(0.08, 0.14)), 4),
            ]
        }

        # Generate preview data (5 rows × 8 genes)
        preview_genes = list(COMMON_GENES[:8])
        preview_data = []
        for i in range(5):
            row = {"sample_id": f"SYN_{i+1:04d}", "age": int(self.rng.integers(
                request.age_range["min"], request.age_range["max"]
            )), "condition": request.biological_condition}
            for gene in preview_genes:
                row[gene] = round(float(self.rng.normal(8.5, 2.1)), 3)
            preview_data.append(row)

        experiment_id = str(uuid.uuid4())
        return {
            "experiment_id": experiment_id,
            "status": "complete",
            "generated_samples": n_samples,
            "features": n_genes,
            "modalities": request.data_modalities,
            "generation_time_seconds": round(float(self.rng.uniform(8.0, 45.0)), 1),
            "quality_metrics": quality,
            "preview_data": preview_data,
            "download_files": [
                {"name": "synthetic_rnaseq_matrix.csv", "format": "csv",
                 "size_bytes": n_samples * n_genes * 8,
                 "download_url": f"/api/p2/download/{experiment_id}"},
                {"name": "sample_metadata.csv", "format": "csv",
                 "size_bytes": n_samples * 200,
                 "download_url": f"/api/p2/download/{experiment_id}_meta"},
            ],
            "model_used": "simulation_fallback",
            "simulation_mode": True,
        }

    def generate_csv_bytes(self, n_samples: int = 100, n_genes: int = 500) -> bytes:
        """Generate a real downloadable CSV matrix."""
        genes = [f"GENE_{i:05d}" for i in range(n_genes)]
        data = self.rng.lognormal(mean=2.0, sigma=1.5, size=(n_samples, n_genes))
        df = pd.DataFrame(data, columns=genes)
        df.index = [f"SAMPLE_{i:04d}" for i in range(n_samples)]
        buffer = io.StringIO()
        df.to_csv(buffer)
        return buffer.getvalue().encode("utf-8")
