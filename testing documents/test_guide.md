# WallahGPT Test Scenarios

Use these settings to verify the end-to-end pipeline functionality for each AI system.

---

## 🧪 WallahGPT1: Aging Clock
**Goal:** Predict biological age from methylation data.

**Field Inputs:**
- **Experiment Name:** `Validation Run - Human Blood`
- **Project Assignment:** `proj-1` / `Aging Study 2024`
- **DNA Methylation (CSV/TSV):** Upload `p1_methylation_sample.csv`
- **Tissue Type:** `Blood`
- **Species:** `Human`
- **Chronological Age:** `65`
- **Sex:** `Female`
- **Preprocessing:** Check `Normalize` and `Impute Missing`

---

## 🧪 WallahGPT2: Data Synthesis
**Goal:** Generate synthetic multi-omics data for disease modeling.

**Field Inputs:**
- **Experiment Name:** `Synthetic AD Cohort`
- **Project Selection:** `proj-1` / `Aging Study 2024`
- **Tissue Type:** `Brain`
- **Biological Condition:** `Disease State`
- **Disease State (if applicable):** `Alzheimer's Disease`
- **Age Range (Years):** `70` to `90`
- **Number of Samples:** `50`
- **Data Modalities:** `RNA-seq` and `Methylation`
- **Reference Dataset:** `GTEx v8` (in Advanced)
- **Noise Level:** `Medium` (in Advanced)

---

## 🧪 WallahGPT3: Drug Discovery
**Goal:** Screen compounds against target gene signatures.

**Field Inputs:**
- **Experiment Name:** `SIRT1 Activator Screen`
- **Tissue Type:** `Liver (Hepatocytes)`
- **Disease Condition:** `Aging / Longevity`
- **Age Focus:** `45` to `75` y/o
- **Gene Targets:**
    - `SIRT1` | `Up` | `2.5`
    - `MTOR` | `Down` | `-1.8`
- **Screening Mode:** `Targeted Screen (10k compounds)`
- **Max Compounds to Screen:** `250`
- **Pathway Focus (comma separated):** `Longevity Regulating Pathway, Autophagy`
- **Apply Toxicity & ADME Filtering:** `Checked`
