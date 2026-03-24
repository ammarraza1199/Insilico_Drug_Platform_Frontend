# WallahGPT — LLM Design Document
## WallahGPT1, WallahGPT2 & WallahGPT3

**Document Version:** 1.0  
**Date:** March 2026  
**Project:** WallahGPT In-Silico Drug Discovery & Omics Platform  
**Author:** ZeroKost Engineering — AI Systems Design  
**Status:** Final

---

## Part 1: LLM Integration Overview

### 1.1 Platform LLM Philosophy

WallahGPT is built on a **Prompt-as-Experiment** paradigm. Instead of hardcoded algorithms, each analytical module (WallahGPT1, 2, and 3) transforms structured user input into a precisely engineered scientific prompt, submits it to a locally-running LLM via Ollama, and then validates and structures the output through Pydantic schemas. When LLM inference fails or produces malformed output, a deterministic statistical simulation engine acts as automatic fallback.

This design achieves:
- **Scientific flexibility:** LLMs can incorporate cross-domain biological knowledge without per-task fine-tuning.
- **Zero API cost:** All inference runs locally via Ollama.
- **Reliability:** Statistical fallback guarantees a result is always returned.
- **Reproducibility:** All experiments are logged with their prompts, model, and output.

### 1.2 Supported Models (via Ollama)

| Model ID | Provider | Parameters | Best For |
|----------|----------|-----------|---------|
| `phi3` | Microsoft | 3.8B | Fast inference, default model |
| `phi3:medium` | Microsoft | 14B | Higher reasoning quality |
| `llama3` | Meta | 8B | General scientific reasoning |
| `llama3:70b` | Meta | 70B | High-fidelity complex outputs |
| `gemma2` | Google | 9B | Strong instruction following |
| `mistral` | Mistral AI | 7B | Efficient multi-step reasoning |

### 1.3 LLM Pipeline Architecture

```
User Input (Form) 
    │
    ▼
Prompt Builder (per module)
    │
    ▼
System Prompt + User Prompt 
    │
    ▼
Ollama Client (generate_with_retry)
    ├─── LLM Success ──▶ ResponseParser.extract_json()
    │                           │
    │                    Pydantic Schema Validation
    │                           │
    │                    ────── Valid ──▶ Return P{N}Response
    │                           │
    │                    ── Invalid ──▶ Fallback Simulator
    │
    └─── LLM Failure ──▶ Fallback Simulator ──▶ Return Simulated Response
```

### 1.4 Ollama Client Configuration

**Client Class:** `OllamaClient` in `llm/client_factory.py`

| Parameter | Default | Description |
|-----------|---------|-------------|
| `base_url` | `http://localhost:11434` | Ollama server endpoint |
| `timeout` | 120s | Maximum wait for LLM response |
| `max_retries` | 2 | Retry attempts on transient failure |
| `temperature` | 0.3 | Controls output randomness (user configurable) |
| `max_tokens` | 4096 | Maximum tokens in LLM response |

**Retry Logic:** Exponential backoff with jitter. First retry at ~1s, second at ~2-4s.

---

## Part 2: WallahGPT1 — Biological Aging Clock

### 2.1 Module Purpose

WallahGPT1 predicts a subject's **biological age** from molecular biomarker data. It produces an **age acceleration score** (difference between predicted biological age and chronological age), identifies key genes driving aging via SHAP-style importance ranking, classifies disease risk, and suggests therapeutic intervention targets.

This module replicates the computational workflow of epigenetic clocks (e.g., Horvath Clock, GrimAge) using LLM-based reasoning rather than pre-trained statistical models.

### 2.2 Input Schema (`P1Request`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `experiment_name` | string | Yes | User-defined label |
| `project_id` | string | Yes | Parent project UUID |
| `chronological_age` | float | Yes | Subject's actual calendar age |
| `tissue_type` | enum | Yes | `Brain`, `Blood`, `Skin`, `Liver`, `Muscle`, `Lung` |
| `methylation_level` | float (0–1) | Yes | Average CpG methylation rate |
| `rna_seq_variance` | float | Yes | RNA-seq expression variance |
| `protein_abundance_index` | float | Yes | Proteomics abundance index |
| `telomere_length_kb` | float | Yes | Telomere length in kilobases |
| `inflammatory_markers` | list[float] | Yes | Panel: IL-6, CRP, TNF-α, etc. |
| `metabolic_score` | float | Yes | Composite metabolic health score |
| `llm_config` | `LLMConfig` | Yes | Model name, temperature, max_tokens |

### 2.3 Output Schema (`P1Response`)

| Field | Type | Description |
|-------|------|-------------|
| `experiment_id` | UUID | Unique experiment identifier |
| `status` | string | `"complete"` or `"failed"` |
| `predicted_biological_age` | float | LLM-predicted biological age in years |
| `chronological_age` | float | Input age (echoed back) |
| `age_acceleration_score` | float | bio_age − chrono_age (positive = accelerated aging) |
| `age_acceleration_class` | enum | `accelerated` / `normal` / `decelerated` |
| `shap_genes` | list[GeneImportance] | Ranked genes: name, importance_score, direction |
| `disease_classification` | dict | Disease → probability (0.0–1.0) |
| `therapeutic_targets` | list[TherapeuticTarget] | Gene, mechanism, drug_class |
| `model_used` | string | Ollama model that ran the inference |
| `simulation_mode` | bool | `true` if fallback simulator was used |
| `runtime_ms` | int | Wall-clock inference time in milliseconds |

### 2.4 System Prompt (P1)

```
SYSTEM PROMPT — WallahGPT1 Biological Aging Clock

You are a computational biology AI specializing in epigenetic aging analysis.
Your task is to predict biological age from multi-omics biomarker data.

CRITICAL RULES:
1. You MUST return ONLY valid JSON. No markdown, no prose.
2. biological_age must be a float between 0 and 130.
3. shap_genes must include 5-10 genes relevant to the tissue type provided.
4. disease_classification must include at least 3 age-related diseases with float probabilities.
5. therapeutic_targets must include at least 2 actionable targets.
6. Base your reasoning on current epigenomics, transcriptomics, and aging biology knowledge.
```

### 2.5 Prompt Construction Strategy (P1)

The `build_p1_prompt()` function includes in the user prompt:

1. **Tissue context** — describes tissue-specific aging mechanisms (e.g., neuroinflammation for Brain).
2. **Biomarker values** — formatted as labeled key-value pairs with units.
3. **Scientific framing** — instructs the LLM to reason step-by-step before producing JSON.
4. **Output schema hint** — provides the exact JSON keys expected (without constraining values).
5. **Scientific disclaimers** — reminds the model to use realistic biological ranges.

### 2.6 Fallback Simulation (P1)

**Class:** `P1Simulator` in `simulation/p1_simulation.py`

- Uses `numpy.random.default_rng(seed)` for reproducibility.
- Biological age = `chronological_age + N(0, 5)` random offset per tissue type.
- SHAP genes drawn from a curated lookup table per tissue (e.g., `FOXO3`, `SIRT1`, `TERT` for Brain).
- Disease risk drawn from age-parameterized beta distributions.
- Always returns a valid `P1Response`-compatible dict.

### 2.7 Visualization Output (Frontend — P1ResultsPanel)

| Chart | Type | Data Source |
|-------|------|-------------|
| Age Comparison | Dual Bar Chart | `predicted_biological_age` vs `chronological_age` |
| Age Acceleration Gauge | Radial Progress | `age_acceleration_score` |
| SHAP Gene Importance | Horizontal Bar Chart | `shap_genes[].importance_score` |
| Disease Risk | Radar / Spider Chart | `disease_classification` |
| Therapeutic Targets | Structured Table | `therapeutic_targets` |

---

## Part 3: WallahGPT2 — Synthetic Omics Generator

### 3.1 Module Purpose

WallahGPT2 generates **statistically valid synthetic multi-omics datasets** (RNA-seq, DNA Methylation, Proteomics, ATAC-seq). These datasets preserve biological correlation structures, can encode experimental groups (e.g., "Young vs. Aged"), and support batch effect simulation. The output is a downloadable matrix suitable for downstream bioinformatics pipelines.

### 3.2 Input Schema (`P2Request`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `experiment_name` | string | Yes | User-defined label |
| `project_id` | string | Yes | Parent project UUID |
| `dataset_type` | enum | Yes | `rna_seq`, `methylation`, `proteomics`, `atac_seq` |
| `num_samples` | int | Yes | Number of biological samples to generate (N) |
| `num_features` | int | Yes | Number of genes/CpGs/proteins to include |
| `groups` | list[GroupDef] | Yes | Group name + sample count + condition |
| `simulate_batch_effect` | bool | Yes | Add systematic batch noise to samples |
| `noise_level` | float (0–1) | Yes | Biological noise amplitude |
| `correlation_strength` | float (0–1) | Yes | Inter-gene correlation preservation strength |
| `differential_expression_pct` | float | Yes | % of features to set as differentially expressed |
| `llm_config` | `LLMConfig` | Yes | Model name, temperature, max_tokens |

### 3.3 Output Schema (`P2Response`)

| Field | Type | Description |
|-------|------|-------------|
| `experiment_id` | UUID | Unique experiment identifier |
| `status` | string | `"complete"` or `"failed"` |
| `dataset_type` | string | Echo of requested dataset type |
| `num_samples` | int | Actual samples generated |
| `num_features` | int | Actual features generated |
| `sample_metadata` | list[SampleMeta] | sample_id, group, batch |
| `feature_metadata` | list[FeatureMeta] | feature_id, chr, position, is_de |
| `expression_matrix` | list[list[float]] | N×M data matrix (truncated in API, full in export) |
| `quality_metrics` | QualityMetrics | PCA variance explained, correlation score, DE count |
| `download_url` | string | Signed URL or endpoint for CSV/TSV download |
| `simulation_mode` | bool | `true` if fallback simulator was used |
| `runtime_ms` | int | Inference time in milliseconds |

### 3.4 System Prompt (P2)

```
SYSTEM PROMPT — WallahGPT2 Synthetic Omics Generator

You are a bioinformatics AI specializing in generating synthetic multi-omics datasets.
Your task is to design the statistical parameters for a biologically realistic dataset.

CRITICAL RULES:
1. Return ONLY valid JSON. No markdown, no explanations outside JSON.
2. Provide biologically appropriate mean/variance distributions per dataset type.
3. For RNA-seq: use negative binomial distribution parameters (log-normal approximation).
4. For Methylation: use Beta distribution parameters (values bounded 0–1).
5. For Proteomics: use log-normal distribution parameters.
6. For ATAC-seq: use zero-inflated Poisson parameters.
7. Specify correlation matrix structure and differential expression gene clusters.
```

### 3.5 Prompt Construction Strategy (P2)

The `build_p2_prompt()` function includes:

1. **Dataset type context** — biological interpretation of the omics layer.
2. **Group definitions** — detailed condition metadata for each group.
3. **Statistical constraints** — instructs the LLM on biologically valid distribution bounds.
4. **Differential expression targets** — asks the LLM to specify which features should be DE and by how much.
5. **Quality guidance** — requests variance explained targets for PCA.

### 3.6 Fallback Simulation (P2)

**Class:** `P2Simulator` in `simulation/p2_simulation.py`

- RNA-seq: samples from `NegBin(mu, dispersion)` with group-specific log-fold changes.
- Methylation: samples from `Beta(alpha, beta)` with group shifts.
- Proteomics: samples from `LogNormal(mu, sigma)`.
- ATAC-seq: samples from `ZeroInflatedPoisson(lambda, pi_zero)`.
- Correlation structure: Induced via Cholesky decomposition of a randomly generated positive semi-definite matrix.
- Batch effects: Additive Gaussian noise with group × batch interaction terms.

### 3.7 Visualization Output (Frontend — P2ResultsPanel)

| Chart | Type | Data Source |
|-------|------|-------------|
| PCA Plot | Scatter Plot | PC1 vs PC2 per sample (colored by group) |
| Sample Distribution | Box Plot | Per-group expression range |
| DE Genes Heatmap | Color Grid | Differentially expressed features |
| Quality Metrics | Stat Cards | Variance explained, correlation, DE count |
| Download Button | Action | Triggers CSV/TSV download of full matrix |

---

## Part 4: WallahGPT3 — Digital Drug Discovery

### 4.1 Module Purpose

WallahGPT3 performs **in-silico drug perturbation screening**. Given a set of gene expression targets (the desired molecular intervention), the module searches a simulated compound library, predicts gene expression changes induced by each compound, scores them against the target signature, applies ADME/toxicity filters, and returns ranked drug candidates with pathway annotations.

This module simulates a CMAP (Connectivity Map)-style perturbation analysis using LLM-based chemical biology reasoning.

### 4.2 Input Schema (`P3Request`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `experiment_name` | string | Yes | User-defined label |
| `project_id` | string | Yes | Parent project UUID |
| `tissue_type` | enum | Yes | `Brain`, `Liver`, `Heart` |
| `disease_condition` | enum | Yes | `Neurodegeneration`, `Cardiovascular`, `Aging` |
| `age_min` | int | Yes | Minimum subject age for target population |
| `age_max` | int | Yes | Maximum subject age for target population |
| `gene_targets` | list[GeneTarget] | Yes | Gene name, expression_level (log2FC), direction |
| `screening_mode` | enum | Yes | `broad` (50k), `targeted` (10k), `lead_optimization` |
| `max_compounds` | int | Yes | Maximum compounds to return in ranking |
| `pathway_focus` | string | No | Comma-separated biological pathways (e.g., "mTOR, Autophagy") |
| `filter_toxicity` | bool | Yes | Apply ADME/toxicity pre-filter |
| `llm_config` | `LLMConfig` | Yes | Model name, temperature, max_tokens |

### 4.3 Output Schema (`P3Response`)

| Field | Type | Description |
|-------|------|-------------|
| `experiment_id` | UUID | Unique experiment identifier |
| `status` | string | `"complete"` or `"failed"` |
| `compounds` | list[Compound] | Ranked list of candidate compounds |
| `compounds[].name` | string | Drug/compound name or ID |
| `compounds[].score` | float (0–1) | Perturbation match score |
| `compounds[].mechanism` | string | Mechanism of action |
| `compounds[].gene_changes` | dict | Gene → predicted log2FC |
| `compounds[].pathway_enrichment` | dict | Pathway → enrichment score |
| `compounds[].toxicity_flag` | bool | Whether ADME filter was triggered |
| `compounds[].adme_profile` | dict | Absorption, distribution, metabolism, excretion estimates |
| `pathway_summary` | dict | Top enriched pathways across all candidates |
| `screening_stats` | dict | Total screened, passed filter, top ranked count |
| `simulation_mode` | bool | `true` if fallback simulator was used |
| `runtime_ms` | int | Inference time in milliseconds |

### 4.4 System Prompt (P3)

```
SYSTEM PROMPT — WallahGPT3 Digital Drug Discovery Engine

You are a computational pharmacology AI specializing in drug-target interaction prediction.
Your task is to identify and rank drug compounds that match a given gene expression target signature.

CRITICAL RULES:
1. Return ONLY valid JSON. No markdown, no explanations.
2. Provide at least 5 drug candidates. Maximum 20.
3. Each compound must include: name, score (0.0–1.0), mechanism, gene_changes, pathway_enrichment.
4. Scores should reflect biological plausibility — do not assign all compounds high scores.
5. gene_changes should contain 3–8 key genes with realistic log2FC values (−4.0 to +4.0).
6. pathway_enrichment should use standard KEGG or Reactome pathway names.
7. Apply ADME reasoning if filter_toxicity is true (flag compounds with poor pharmacokinetics).
8. Ground all responses in known pharmacology where possible.
```

### 4.5 Prompt Construction Strategy (P3)

The `build_p3_prompt()` function includes:

1. **Target gene signature** — formatted as a table: gene, direction, expression_level.
2. **Disease & tissue context** — biological mechanisms of the specified disease/tissue combination.
3. **Screening mode context** — informs the LLM about the scope and depth of the screen.
4. **Pathway focus** — parsed comma-separated pathways injected as priority constraints.
5. **ADME instructions** — if `filter_toxicity=True`, instructs LLM to reason about bioavailability, hepatotoxicity, and BBB penetration.
6. **JSON schema specification** — exact expected JSON structure provided as a comment block.

### 4.6 Fallback Simulation (P3)

**Class:** `P3Simulator` in `simulation/p3_simulation.py`

- Draws compound names from a curated library of ~200 known drugs and investigational compounds.
- Assigns perturbation scores using a signature similarity function:  
  `score = cosine_similarity(compound_signature, target_signature)`  
  where `compound_signature` is pre-computed from the simulated library.
- Gene changes sampled from tissue-conditioned multivariate normal distributions.
- Pathway enrichment simulated using Fisher's exact test on random gene set assignments.
- ADME filtering: ~15% of compounds flagged based on molecular weight and lipophilicity heuristics.

### 4.7 Visualization Output (Frontend — P3ResultsPanel)

| Chart | Type | Data Source |
|-------|------|-------------|
| Top Compounds Ranking | Horizontal Bar Chart | `compounds[].score` |
| Gene Expression Changes | Heatmap | `compounds[].gene_changes` |
| Pathway Enrichment | Bubble Chart | `pathway_summary` |
| ADME Profile Table | Structured Table | `compounds[].adme_profile` |
| Compound Detail Modal | Expandable Card | Full compound entry |
| Screening Stats | KPI Cards | `screening_stats` |

---

## Part 5: Cross-Module LLM Architecture Details

### 5.1 ResponseParser Design

**Class:** `ResponseParser` in `llm/response_parser.py`

Extraction strategy (in order of attempt):
1. Find and parse the first complete JSON object using balanced brace detection.
2. Strip markdown code blocks (` ```json `) if present.
3. Apply regex to extract valid JSON-like string from messy LLM output.
4. If all strategies fail, return `None` → triggers simulation fallback.

### 5.2 Model Registry (`llm/model_registry.py`)

- Maintains a whitelist of validated Ollama model identifiers.
- `validate_model(model_name)` normalizes input and returns the registered model ID.
- Falls back to `settings.default_model` (`phi3`) if an invalid model is requested.
- Periodically queryable to list available models from the Ollama `/api/tags` endpoint.

### 5.3 LLM Configuration Object (`LLMConfig`)

```python
class LLMConfig(BaseModel):
    model_name: str = "phi3"
    temperature: float = Field(default=0.3, ge=0.0, le=1.0)
    max_tokens: int = Field(default=4096, ge=256, le=8192)
```

User-selectable per experiment via the `ModelSelectorWidget` frontend component.

### 5.4 Experiment Logging Flow

```
Controller.run()
    ├── log_experiment() ──▶ MongoDB.experiments collection
    │       ├── experiment_id (UUID)
    │       ├── user_id
    │       ├── project_id
    │       ├── exp_type ("p1" | "p2" | "p3")
    │       ├── request_payload (full input)
    │       ├── result_data (full output)
    │       └── created_at (UTC timestamp)
    └── Return P{N}Response to Router
```

### 5.5 Error Handling States

| State | Description | Resolution |
|-------|-------------|------------|
| LLM_TIMEOUT | Ollama response exceeds 120s | Fallback to simulation |
| LLM_EMPTY | Ollama returns empty string | Fallback to simulation |
| PARSE_FAILURE | ResponseParser returns None | Fallback to simulation |
| SCHEMA_INVALID | Pydantic validation fails on LLM JSON | Fallback to simulation |
| DB_WRITE_FAIL | MongoDB log_experiment fails | Log error; still return result to user |
| VALIDATION_ERROR | Request body fails Pydantic | Return HTTP 422 with field-level detail |

---

## Part 6: Prompt Engineering Guidelines

### 6.1 Structure Template

Every prompt follows the **CRIST** framework:
- **C**ontext — Who the LLM is and what domain it operates in.
- **R**ules — Hard JSON format constraints (most critical).
- **I**nput — Structured data from the user request.
- **S**cientific Guidance — Field-specific biological/chemical reasoning hints.
- **T**arget Output — Exact JSON schema the LLM must match.

### 6.2 Anti-Patterns Avoided

| Anti-Pattern | Why Avoided |
|-------------|-------------|
| "Explain your reasoning" | Increases tokens, makes JSON extraction harder |
| "Feel free to add extra fields" | Breaks Pydantic schema validation |
| Open-ended "analyze this data" | Leads to prose instead of JSON |
| High temperature (>0.7) for scientific data | Too much randomness → unrealistic values |
| System prompt > 500 tokens | Reduces user prompt context window |

### 6.3 Temperature Guide

| Module | Recommended Range | Rationale |
|--------|------------------|-----------|
| WallahGPT1 | 0.2 – 0.4 | Biological interpretation requires precision |
| WallahGPT2 | 0.3 – 0.5 | Statistical parameter design benefits from slight creativity |
| WallahGPT3 | 0.3 – 0.5 | Drug compounds require plausible but diverse suggestions |

---

## Part 7: Future LLM Enhancements (v2.0 Roadmap)

| Enhancement | Description | Target Release |
|-------------|-------------|---------------|
| Fine-tuned Models | Domain-specific fine-tunes on PubMed/ChEMBL data | v2.0 |
| RAG Integration | Retrieval-Augmented Generation from PubMed vector store | v2.0 |
| Cloud LLM Fallback | OpenAI/Anthropic as secondary fallback when Ollama fails | v2.0 |
| Streaming Responses | Real-time token streaming to frontend via SSE | v1.5 |
| Prompt Versioning | Git-tracked prompt versions per module | v1.5 |
| A/B Prompt Testing | Compare results across prompt versions | v2.0 |
| Multi-modal Input | Accept uploaded CSV files directly as LLM context | v2.0 |

---

*End of LLM Design Document — WallahGPT v1.0*
