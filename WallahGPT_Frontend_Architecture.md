# WallahGPT Platform — Frontend Architecture Document

**Document Type:** Frontend Architecture Specification  
**Version:** 1.0.0  
**Status:** Draft — For Engineering Review  
**Audience:** Frontend Engineers, Platform Architects, Tech Leads, Code Generation Systems  
**Prepared By:** Senior Software Architect / AI Platform Architect / Principal Frontend Engineer

---

## Table of Contents

1. [Platform Overview](#section-1--platform-overview)
2. [Frontend System Goals](#section-2--frontend-system-goals)
3. [Frontend Tech Stack](#section-3--frontend-tech-stack)
4. [High-Level Frontend Architecture](#section-4--high-level-frontend-architecture)
5. [Model Selection System (Critical)](#section-5--model-selection-system-critical)
6. [Module Design for Each System](#section-6--module-design-for-each-system)
7. [Results Visualization](#section-7--results-visualization)
8. [Mock API Design](#section-8--mock-api-design)
9. [Project Structure](#section-9--project-structure)
10. [User Experience Design](#section-10--user-experience-design)
11. [Frontend Development Roadmap](#section-11--frontend-development-roadmap)
12. [Future Backend Integration](#section-12--future-backend-integration)

---

## SECTION 1 — Platform Overview

### 1.1 Purpose

WallahGPT is an AI-powered computational biology research platform designed to replace or supplement wet laboratory pre-clinical experimentation with in-silico digital simulation. Inspired by Insilico Medicine's Large Language of Life Models (LLLM) ecosystem, the platform leverages multi-omics AI models to enable researchers to run biological experiments computationally — dramatically reducing time, cost, and ethical constraints associated with physical laboratory work.

The platform addresses three distinct scientific challenges:

- **Biological aging analysis** — predicting biological age from molecular data
- **Synthetic omics data generation** — creating statistically valid artificial biological datasets
- **Computational drug discovery** — simulating drug perturbation experiments on gene expression

### 1.2 The Three AI Systems

#### System 1 — WallahGPT1: Biological Aging Clock

WallahGPT1 is a multi-modal biological age prediction engine. It ingests molecular data — primarily DNA methylation arrays and RNA-seq gene expression matrices — and outputs a predicted biological age alongside clinical insights. This system is valuable for aging research, disease classification, and identifying therapeutic targets.

| Attribute | Detail |
|-----------|--------|
| **Core Function** | Predict biological age from molecular data |
| **Primary Inputs** | DNA methylation, RNA-seq, tissue type, species, chronological age |
| **Key Outputs** | Predicted biological age, age acceleration score, disease classification probabilities, SHAP gene importance ranking, therapeutic target genes |
| **Users** | Aging researchers, bioinformaticians, clinicians, drug discovery analysts |

#### System 2 — WallahGPT2: Synthetic Multi-Omics Data Generator

WallahGPT2 is a generative AI system that produces synthetic biological datasets statistically indistinguishable from real multi-omics data. It enables researchers to generate datasets for rare tissue types, extreme age ranges, or multi-species experiments that do not exist in public repositories.

| Attribute | Detail |
|-----------|--------|
| **Core Function** | Generate synthetic omics datasets |
| **Primary Inputs** | Tissue type, species, age range, biological condition, data modality, number of samples |
| **Key Outputs** | Synthetic gene expression matrices, methylation datasets, downloadable omics files |
| **Users** | Data scientists, AI researchers, computational biologists, pharmaceutical teams |

#### System 3 — WallahGPT3: Digital Drug Discovery Engine

WallahGPT3 simulates drug perturbation experiments in silico. Researchers can input target disease conditions, gene expression profiles, and candidate compound structures (SMILES notation) to identify how drugs would alter gene expression. This acts as a virtual pre-clinical laboratory.

| Attribute | Detail |
|-----------|--------|
| **Core Function** | Simulate drug perturbation and identify candidate compounds |
| **Primary Inputs** | Tissue, disease condition, age range, gene expression targets, compound SMILES |
| **Key Outputs** | Predicted gene expression changes, ranked drug candidates, pathway analysis |
| **Users** | Pharmaceutical companies, drug discovery researchers, computational chemists, biomedical scientists |

### 1.3 Scientific Use Cases

The following workflows represent primary use cases the platform must support:

**Use Case A — Biological Age Assessment**  
A clinician uploads a patient's DNA methylation data from a blood sample. The system predicts biological age, computes age acceleration relative to chronological age, and highlights genes associated with accelerated aging. The researcher exports a full SHAP analysis report.

**Use Case B — Rare Dataset Generation**  
A pharmaceutical team needs liver transcriptome data for a 75-year-old cohort — data unavailable in public repositories. Using WallahGPT2, they configure tissue type, age range, and number of samples, then download a statistically valid synthetic dataset for downstream AI model training.

**Use Case C — Computational Drug Screening**  
A drug discovery analyst wants to identify compounds that reverse age-related gene expression changes in brain tissue. They input the target expression signatures and run WallahGPT3 to receive a ranked list of candidate compounds with predicted efficacy scores.

**Use Case D — Cross-System Research Pipeline**  
An aging researcher runs WallahGPT1 to identify age-accelerated tissue types, uses WallahGPT2 to generate additional data for underrepresented cohorts, then feeds the results into WallahGPT3 to identify therapeutic interventions — a complete end-to-end in-silico experiment pipeline.

### 1.4 Typical Research Workflows

```
[Data Upload] → [Parameter Configuration] → [Model Selection] → [Experiment Execution]
      ↓
[Results Visualization] → [Report Download] → [Experiment History Logging]
```

---

## SECTION 2 — Frontend System Goals

### 2.1 Purpose of the Frontend Prototype

The frontend prototype serves as the complete user-facing interface of the WallahGPT platform during its initial development phase. At this stage, no production backend infrastructure, ML inference pipelines, or GPU workers are available. The frontend must:

- Deliver a fully functional user experience using mock APIs and simulated data
- Enable product validation with real research users before backend investment
- Establish all UI patterns and data contracts that the future backend will fulfill
- Be architected for seamless real-backend integration with zero UI redesign

### 2.2 Core UI Capabilities

The frontend must support the following capabilities across all three AI systems:

| Capability | Description |
|------------|-------------|
| **Biological Data Upload** | File upload for CSV, TSV, FASTQ, BED, and Excel omics files |
| **Parameter Selection** | Tissue type, species, age range, condition, modality configuration |
| **Experiment Configuration** | Full experiment setup with named sessions, metadata, and configuration saving |
| **Model Selection** | User-selectable AI model / LLM per experiment run |
| **Results Visualization** | Charts, tables, gene networks, ranked lists, and probability distributions |
| **Downloadable Reports** | CSV, JSON, PDF, and raw data export for all experiment outputs |
| **Experiment History** | Persistent log of all past experiments with status, config replay, and result retrieval |

### 2.3 Feature Implementation Strategy

#### Mocked Features (Phase 1)
These features will return hardcoded or randomly generated responses simulating real model outputs:

- POST endpoints for all three AI systems (`/api/p1/predict-age`, `/api/p2/generate-data`, `/api/p3/drug-screen`)
- Authentication (JWT token returned from mock `/api/auth/login`)
- User profile and project management CRUD operations
- Experiment job status polling (simulated async job with `setTimeout`)
- All data download endpoints (serving pre-built mock CSV/JSON files)

#### Simulated Features (Phase 1–2)
These features mimic real-world behavior without actual computation:

- Async job progress bars (progress increments over a configurable delay)
- SHAP gene importance charts (rendered from seeded mock data)
- Biological age distribution charts (statistical mock cohort data)
- Drug candidate ranking tables (mock scored compound lists)
- Model selection panel (stores configuration locally; passes mock endpoint to API layer)

#### Prepared for Backend Integration (Architecture-Level)
These patterns are designed specifically to be replaced by real implementations:

- All API calls routed through a centralized `/src/api/` service layer — swap mock handlers for real endpoints by changing one configuration variable
- React Query (`TanStack Query`) used for all server state — simply point `queryFn` to real endpoints
- Environment variable `VITE_API_MODE=mock|live` controls whether mock or real API handlers are used
- TypeScript interfaces for all API request/response shapes defined upfront in `/src/types/` — enforced contracts for backend engineers
- Authentication context designed around JWT — plug in real token endpoints without changing UI components

---

## SECTION 3 — Frontend Tech Stack

### 3.1 Technology Selections

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React + TypeScript | React 18, TypeScript 5.x |
| Build Tool | Vite | 5.x |
| Styling | TailwindCSS | 3.x |
| Component Library | shadcn/ui | Latest |
| State Management | Zustand | 4.x |
| Server State / Data Fetching | TanStack Query (React Query) | 5.x |
| Charting — Statistical | Recharts | 2.x |
| Charting — Scientific | Plotly.js (via react-plotly.js) | 2.x |
| Network Visualization | D3.js (v7) | 7.x |
| File Upload | React Dropzone | 14.x |
| Forms | React Hook Form + Zod | Latest |
| Routing | React Router DOM | 6.x |
| HTTP Client | Axios | 1.x |
| Auth Utilities | jwt-decode | 4.x |
| Date Utilities | date-fns | 3.x |
| Icons | Lucide React | Latest |
| Package Manager | pnpm | 9.x |
| Testing | Vitest + React Testing Library | Latest |
| Linting | ESLint + Prettier | Latest |

### 3.2 Technology Rationale

**React + TypeScript**  
React is the industry standard for complex data-driven scientific UIs. TypeScript enforces type safety across API contracts, component props, and experiment configuration objects — critical when dealing with complex multi-omics data structures. TypeScript also provides the type-safe foundation that code generation systems require.

**Vite**  
Vite provides near-instant hot module replacement (HMR) and dramatically faster cold-start times compared to Webpack or Create React App. It produces optimized production bundles and natively supports TypeScript and JSX without configuration.

**TailwindCSS + shadcn/ui**  
TailwindCSS provides utility-first styling that scales cleanly across a complex multi-module platform without CSS specificity issues. shadcn/ui provides high-quality, accessible, composable components (dialogs, tabs, selects, sliders) built on Radix UI primitives — essential for complex research form UIs. These components are copied into the project (not a dependency), giving full control.

**Zustand**  
Zustand manages client-side global state (active user session, experiment configuration in-progress, model selection state, UI preferences). It is lightweight, boilerplate-free, and avoids the complexity of Redux for a prototype-scale application. Its simple API enables rapid development.

**TanStack Query (React Query)**  
All server state (API responses, experiment results, history records) is managed by TanStack Query. It handles caching, background refetching, loading states, and error states declaratively. Crucially, the `queryFn` abstraction makes it trivial to replace mock handlers with real API calls during backend integration.

**Recharts + Plotly.js + D3.js**  
Three charting libraries are used for different visualization needs:
- **Recharts** — Standard responsive charts (bar charts, line charts, area charts) for dashboards and history views
- **Plotly.js** — Scientific-grade interactive charts: volcano plots, heatmaps, scatter plots with statistical annotations — appropriate for omics data
- **D3.js** — Custom gene pathway network visualizations and force-directed graphs that require bespoke rendering logic

**React Dropzone**  
Provides accessible, customizable file drop zones for uploading biological data files (CSV, TSV, FASTQ). Supports file type validation, size limits, and multiple file uploads.

**React Hook Form + Zod**  
React Hook Form provides performant, uncontrolled form management with minimal re-renders — important for complex multi-step experiment configuration forms. Zod provides schema-based runtime validation for all form inputs, ensuring type-safe experiment parameters before submission.

**pnpm**  
pnpm is significantly faster than npm and yarn for installation, uses a content-addressable store to reduce disk space, and produces a strict `node_modules` layout that prevents phantom dependency issues.

---

## SECTION 4 — High-Level Frontend Architecture

### 4.1 Application Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing Page | `/` | Marketing and product overview page with system introductions |
| Login | `/login` | JWT-based authentication form |
| Register | `/register` | User registration with role selection |
| Dashboard | `/dashboard` | User home — active projects, recent experiments, quick launch |
| Project Workspace | `/projects/:projectId` | Project-level view with experiment list and metadata |
| Experiment Builder | `/experiment/new` | Step-by-step experiment configuration wizard |
| WallahGPT1 Module | `/experiment/p1/:id` | Aging clock input, run, and results UI |
| WallahGPT2 Module | `/experiment/p2/:id` | Synthetic data generator UI |
| WallahGPT3 Module | `/experiment/p3/:id` | Drug discovery engine UI |
| Model Selection Panel | `/settings/models` | User model configuration and API key management |
| Results Viewer | `/results/:experimentId` | Full-screen results dashboard for a completed experiment |
| Experiment History | `/history` | Paginated history of all experiments with filtering and search |
| Admin Panel | `/admin` | User management, system status, usage analytics |
| Profile & Settings | `/settings/profile` | User preferences, notification settings |

### 4.2 Navigation Flow

```
Landing Page
    └── Login / Register
            └── Dashboard
                    ├── Project Workspace
                    │       └── Experiment Builder (System Selector)
                    │               ├── WallahGPT1 Module → Results Viewer
                    │               ├── WallahGPT2 Module → Results Viewer
                    │               └── WallahGPT3 Module → Results Viewer
                    ├── Experiment History
                    │       └── Results Viewer (any past experiment)
                    ├── Model Selection Panel
                    ├── Profile & Settings
                    └── Admin Panel (role-gated)
```

### 4.3 Layout System

The application uses two top-level layouts:

**PublicLayout** — Used for Landing, Login, Register pages. Full-width, minimal navigation, marketing-oriented styling.

**AppLayout** — Used for all authenticated pages. Includes:
- Top navigation bar (logo, user menu, notifications, global model selector indicator)
- Left sidebar (collapsible, with nav links to Dashboard, History, Settings, Admin)
- Main content area (scrollable, full-width)
- Optional right-panel (context-sensitive — shows experiment config summary or results metadata)

### 4.4 Route Protection

All authenticated routes are wrapped in a `<ProtectedRoute>` component that:
- Reads the JWT token from Zustand auth store
- Validates token expiry using `jwt-decode`
- Redirects to `/login` if unauthenticated
- Passes role information for admin-gated routes

### 4.5 State Architecture

```
Global State (Zustand Stores)
├── authStore          — user session, JWT, role, permissions
├── experimentStore    — current experiment configuration (in-progress)
├── modelStore         — active model selection, per-system model configs
├── uiStore            — sidebar collapsed state, theme, notification queue

Server State (TanStack Query)
├── projects           — project list, project detail
├── experiments        — experiment list, history, status polling
├── results            — experiment results by ID
└── admin              — user management data (admin only)
```

---

## SECTION 5 — Model Selection System (Critical)

### 5.1 Overview

The Model Selection System is a first-class UI component that allows senior users (Research Scientists, Drug Discovery Analysts, Platform Administrators) to choose which AI model or LLM powers each experiment run. This system must be flexible, extensible, and non-blocking — i.e., users should be able to configure models independently per experiment without disrupting their workflow.

### 5.2 Model Provider Options

The system must support the following model providers:

| Provider | Display Name | Configuration Required |
|----------|-------------|----------------------|
| `platform_default` | Platform Default | None — uses system-configured inference endpoint |
| `openai` | OpenAI | API Key, Model Name (e.g. `gpt-4o`, `gpt-4-turbo`) |
| `anthropic` | Claude (Anthropic) | API Key, Model Name (e.g. `claude-opus-4-6`, `claude-sonnet-4-6`) |
| `huggingface` | HuggingFace Hub | API Key, Model ID (e.g. `meta-llama/Llama-3-70B-Instruct`) |
| `local` | Local Model | Endpoint URL (e.g. `http://localhost:11434`) |
| `custom` | Custom Research Endpoint | Full endpoint URL, optional API key, optional auth header |

### 5.3 Model Configuration Fields

Each provider configuration supports the following fields:

```typescript
interface ModelConfiguration {
  provider: 'platform_default' | 'openai' | 'anthropic' | 'huggingface' | 'local' | 'custom';
  modelName: string;                // e.g. "gpt-4o", "claude-sonnet-4-6"
  temperature: number;              // 0.0 – 2.0, default 0.7
  maxTokens: number;                // 256 – 32768, default 4096
  endpointUrl?: string;             // Required for local/custom
  apiKey?: string;                  // Stored encrypted in sessionStorage only
  authHeader?: string;              // Optional custom auth header name
  systemPrompt?: string;            // Optional system prompt override
  contextWindowSize?: number;       // Advanced: override context window
}
```

### 5.4 Model Selection UI — Global Settings Page (`/settings/models`)

The global model settings page provides a full management interface:

**Section A — Default Model Profile**  
A card showing the currently active default model. Users can click "Change" to open the model selector modal.

**Section B — Per-System Overrides**  
A three-panel accordion showing WallahGPT1, WallahGPT2, and WallahGPT3 — each with an option to either inherit the global default or configure a system-specific model.

**Section C — Saved Model Profiles**  
A table of named model configurations (e.g., "GPT-4o High Precision", "Local Llama3 Fast") that can be saved, reused, and assigned. Users can create, edit, duplicate, and delete profiles.

**Section D — API Key Management**  
Secure key entry fields per provider. API keys are:
- Never stored in localStorage
- Held in memory (Zustand) for the session duration only
- Shown masked with a reveal toggle
- Validated with a "Test Connection" button before saving

### 5.5 Model Selector Modal (Inline, Per-Experiment)

During experiment configuration in the Experiment Builder, users see a compact model selector in the configuration sidebar:

```
┌────────────────────────────────────┐
│ 🤖 AI Model                [Edit]  │
│ Provider:  OpenAI                  │
│ Model:     gpt-4o                  │
│ Temp:      0.7   Max Tokens: 4096  │
└────────────────────────────────────┘
```

Clicking "Edit" opens the `ModelSelectorModal` — a full-featured dialog with:

- **Provider Tabs** — one tab per provider (Platform Default, OpenAI, Claude, HuggingFace, Local, Custom)
- **Dynamic Form Fields** — fields relevant to the selected provider are shown/hidden based on provider selection
- **Connection Test Button** — sends a minimal test request and shows latency + success status
- **Apply to This Experiment** — saves the config to the current experiment only (stored in `experimentStore`)
- **Save as Profile** — optionally saves the config to the user's named profiles list

### 5.6 Model Configuration State Flow

```
User opens ModelSelectorModal
        ↓
Selects provider tab
        ↓
Fills in model name, temperature, max tokens, API key, endpoint URL
        ↓
Clicks "Test Connection" → Mock success response (Phase 1) / Real API test (Phase 2)
        ↓
Clicks "Apply to This Experiment"
        ↓
Config saved to experimentStore.modelConfig
        ↓
On experiment submission → modelConfig is passed as part of experiment payload
        ↓
Mock API logs config and returns result (Phase 1)
Real API forwards config to inference backend (Phase 2)
```

### 5.7 Security Considerations

- API keys are **never** persisted to `localStorage` or any storage that survives browser close
- API keys are **never** logged, displayed in URL query strings, or included in error messages
- The frontend passes keys as headers (`Authorization: Bearer <key>`) via the API service layer
- In production, API keys should be proxied through the backend — the UI supports a "proxy mode" toggle that omits the key from the frontend payload

---

## SECTION 6 — Module Design for Each System

### 6.1 WallahGPT1 Module — Biological Aging Clock

**Route:** `/experiment/p1/:experimentId`

#### 6.1.1 Input Panel

The input panel is a left-side fixed panel (400px wide) with the following controls:

**Experiment Metadata**
- Experiment name (text input, required)
- Project assignment (dropdown of user's projects)
- Description (optional textarea)

**Data Upload Section**
- DNA methylation data uploader (React Dropzone — accepts `.csv`, `.tsv`, `.txt`, `.xlsx`)
  - File validation: checks for required CpG site column headers
  - Preview: shows first 5 rows in a mini-table after upload
- RNA-seq gene expression uploader (same file types)
  - File validation: checks for gene ID column
  - Preview: row count and gene count summary badge

**Biological Parameters**
- Tissue Type (Searchable Select — options: Blood, Brain, Liver, Lung, Heart, Kidney, Muscle, Adipose, Skin, Pancreas, Other)
- Species (Select — Human, Mouse, Rat, Zebrafish, Other)
- Chronological Age (Number Input — years, range 0–120)
- Sex (Select — Male, Female, Unknown)
- Data Preprocessing (Checkbox group: Normalize, Filter Low Variance, Impute Missing)

**Model Selection (Compact)**
- Inline `ModelSelectorWidget` showing active provider + model name
- "Configure Model" link → opens `ModelSelectorModal`

**Action Controls**
- `[Run Prediction]` button (primary, full-width) — disabled until required files are uploaded
- `[Save Configuration]` button (secondary) — saves experiment config without running
- `[Load Previous Config]` button (tertiary) — loads a past experiment's configuration

#### 6.1.2 Results Panel

The results panel occupies the right 60% of the screen and renders after job completion:

**Results Header Card**
```
┌──────────────────────────────────────────────────────────┐
│ Predicted Biological Age          Chronological Age       │
│          67.4 years                    62 years           │
│                                                           │
│ Age Acceleration: +5.4 years  ⚠️ Accelerated Aging       │
└──────────────────────────────────────────────────────────┘
```

**Tab 1 — Biological Age**
- Gauge/dial chart showing predicted age vs chronological age
- Age acceleration bar (green → yellow → red scale)
- Biological age comparison line chart (patient vs population average by tissue)

**Tab 2 — Gene Importance (SHAP)**
- Horizontal bar chart (top 20 genes by SHAP value)
- Color-coded: positive SHAP = aging-accelerating (red), negative = protective (blue)
- Click on any gene bar → opens Gene Detail Card (gene function, associated diseases, expression level)
- Export SHAP table as CSV button

**Tab 3 — Disease Classification**
- Probability bar chart: Alzheimer's, Parkinson's, CVD, T2DM, Cancer (age-related diseases)
- Risk classification badges (Low / Moderate / High)
- Confidence interval indicators

**Tab 4 — Therapeutic Targets**
- Table: Gene Name | SHAP Score | Expression Level | Known Drug Target | Actionability Score
- Sortable columns
- Link to external databases (GeneCards, PubMed)

**Results Footer**
- `[Download Full Report (PDF)]`
- `[Export Raw Results (JSON)]`
- `[Export SHAP Table (CSV)]`
- `[Save to Project]`

---

### 6.2 WallahGPT2 Module — Synthetic Multi-Omics Data Generator

**Route:** `/experiment/p2/:experimentId`

#### 6.2.1 Input Panel

**Experiment Metadata** (same pattern as P1)

**Generation Parameters**

- Tissue Type (Searchable Select — same options as P1 plus All Tissues)
- Species (Multi-Select — allows generating cross-species datasets)
- Age Range Slider (dual-handle range: 0–120 years)
  - Display: "Ages 45–75" with visual range bar
- Biological Condition (Select: Healthy, Disease State, Treatment, Post-treatment, Custom)
  - If Disease State selected → secondary Select for specific disease (Alzheimer's, COPD, Cancer, etc.)
- Data Modality (Checkbox group — select one or more):
  - ☑ RNA-seq (Transcriptomics)
  - ☐ DNA Methylation (Epigenomics)
  - ☐ Proteomics
  - ☐ Metabolomics
- Number of Samples (Slider: 10 – 10,000, log scale)
  - Estimated generation time indicator updates dynamically

**Advanced Options (Collapsible)**
- Reference Dataset (Select: GTEx, GEO, ENCODE, Custom Upload)
- Noise Level (Slider: Low / Medium / High)
- Batch Effect Simulation (Toggle)
- Correlation Structure Preservation (Toggle)
- Random Seed (number input — for reproducibility)

**Model Selection (Compact)** — same as P1

**Action Controls**
- `[Generate Dataset]` — primary action
- `[Preview Configuration]` — shows a JSON preview of the generation spec
- `[Estimate Cost]` — shows mock compute cost estimate

#### 6.2.2 Results Panel

**Generation Progress Section** (shown while generating)
- Animated progress bar with stages: Initializing → Sampling → Applying Correlations → Validating → Complete
- Log stream (mock log lines showing generation steps)

**Tab 1 — Dataset Preview**
- Summary statistics card:
  - Samples generated, genes/features, modalities, generation time
- Data preview table (first 10 rows × 8 columns of the generated matrix)
- Pagination controls for preview

**Tab 2 — Quality Metrics**
- Distribution comparison chart: synthetic vs reference (overlaid density plots via Plotly)
- PCA scatter plot of synthetic samples (colored by age group)
- QC pass/fail badges (Mean expression similarity, Variance preservation, Correlation structure)

**Tab 3 — Downloads**
- File manifest table:

| File Name | Format | Size | Action |
|-----------|--------|------|--------|
| synthetic_rnaseq_matrix.csv | CSV | 14.2 MB | Download |
| sample_metadata.csv | CSV | 45 KB | Download |
| generation_config.json | JSON | 2 KB | Download |
| qc_report.pdf | PDF | 1.1 MB | Download |

- `[Download All (ZIP)]` button

---

### 6.3 WallahGPT3 Module — Digital Drug Discovery Engine

**Route:** `/experiment/p3/:experimentId`

#### 6.3.1 Input Panel

**Experiment Metadata** (same pattern)

**Target Biology Configuration**

- Tissue Type (Select)
- Disease Condition (Select: Cancer, Neurodegeneration, Cardiovascular Disease, Metabolic Disease, Fibrosis, Aging, Custom)
- Age Range Slider (same as P2)
- Target Gene Expression Profile:
  - Mode selector: Upload File | Manual Entry | Load from P1 Results
  - If Upload: Dropzone accepting CSV/TSV with gene name + expression level columns
  - If Manual Entry: Dynamic row table (add gene, expression level, direction: Up/Down/Any)
  - If Load from P1: Dropdown selecting a past WallahGPT1 experiment's gene targets

**Compound Input (Optional)**
- Compound SMILES input (textarea — with syntax validation indicator)
- Or: Upload compound library (CSV with SMILES column)
- Or: Leave blank — system will suggest candidates from its compound database

**Screening Configuration**
- Screening Mode (Select: Broad Screen / Targeted Screen / Lead Optimization)
- Max Compounds to Return (Slider: 5–500)
- Pathway Focus (Multi-Select: mTOR, PI3K, p53, HDAC, NF-κB, Wnt, Custom)
- Toxicity Filtering (Toggle — filters out compounds with known toxicity flags)

**Model Selection (Compact)** — same as P1/P2

**Action Controls**
- `[Run Drug Screen]` — primary action
- `[Run Quick Screen]` — faster mode, top 10 compounds only

#### 6.3.2 Results Panel

**Screening Progress Section** (while running)
- Multi-stage progress bar: Loading Models → Processing Gene Targets → Screening Compounds → Ranking → Complete
- Running stats: "Compounds screened: 1,247 / 50,000"

**Tab 1 — Top Compound Rankings**
- Ranked table:

| Rank | Compound | SMILES | Efficacy Score | Selectivity | Toxicity Flag | Action |
|------|----------|--------|---------------|-------------|---------------|--------|
| 1 | Compound-A | C1CCCCC1 | 0.94 | High | None | Expand |

- Sortable by all columns
- Row expansion → Compound Detail Card (structure viewer placeholder, mechanism of action, literature references)

**Tab 2 — Gene Expression Changes**
- Heatmap (Plotly): genes × top compounds, colored by predicted expression change
- Volcano plot: log2 fold change vs. significance for top-ranked compound
- Export gene expression matrix CSV

**Tab 3 — Pathway Analysis**
- Enriched pathway bar chart (top 10 enriched pathways for top compound)
- D3.js pathway network visualization (nodes = genes, edges = interactions, colored by expression direction)

**Tab 4 — Comparison View**
- Multi-compound comparison chart: select 2–5 compounds from rankings, compare gene expression profiles side-by-side

**Results Footer**
- `[Download Full Report (PDF)]`
- `[Export Rankings (CSV)]`
- `[Export Expression Changes (CSV)]`
- `[Save Compounds to Project Library]`

---

## SECTION 7 — Results Visualization

### 7.1 Visualization Component Library

All visualization components live in `/src/charts/` and are reusable across all three modules.

| Component | Library | Use Case |
|-----------|---------|----------|
| `ShapBarChart` | Recharts | Gene importance rankings from P1 |
| `BiologicalAgeGauge` | Custom SVG / D3 | Circular gauge showing predicted vs chronological age |
| `AgingDistributionChart` | Recharts AreaChart | Population aging distribution with patient overlay |
| `DiseaseClassificationChart` | Recharts BarChart | Disease probability scores |
| `OmicsPCAPlot` | Plotly | PCA scatter plot for synthetic datasets |
| `DensityComparisonPlot` | Plotly | Synthetic vs real distribution comparison |
| `ExpressionHeatmap` | Plotly | Genes × compounds expression heatmap |
| `VolcanoPlot` | Plotly | Drug efficacy volcano plot |
| `DrugRankingChart` | Recharts | Horizontal bar chart of ranked candidates |
| `GenePathwayNetwork` | D3.js (force-directed) | Interactive gene interaction network |
| `EnrichedPathwayChart` | Recharts | Pathway enrichment horizontal bars |
| `ExperimentTimelineChart` | Recharts LineChart | Historical experiment results over time |

### 7.2 Chart Design Specifications

**Color Palette (Scientific)**
```
Primary Blue:    #2563EB   (reference/normal values)
Accent Green:    #16A34A   (healthy / low risk)
Warning Amber:   #D97706   (moderate / borderline)
Alert Red:       #DC2626   (high risk / accelerated aging)
Neutral Gray:    #6B7280   (background data / reference)
Purple:          #7C3AED   (therapeutic targets)
Teal:            #0D9488   (synthetic data)
```

**Recharts Global Config**
- Font: Inter, 12px
- Grid lines: `#E5E7EB` (subtle)
- Tooltip: Custom styled, dark background, 200ms delay
- Animations: 600ms ease-in-out on mount, disabled on resize

**Plotly Global Config**
- Template: custom dark-science theme
- Modebar: show Download PNG, Zoom, Pan, Reset
- Hover mode: closest
- Colorscale for heatmaps: RdBu (red=up-regulated, blue=down-regulated)

**D3 Gene Network**
- Node radius: proportional to SHAP/importance score
- Edge width: proportional to interaction confidence
- Colors: up-regulated = red nodes, down-regulated = blue nodes, neutral = gray
- Zoom: d3-zoom enabled (scroll to zoom, drag to pan)
- Tooltip on hover: gene name, expression level, SHAP score, associated pathways
- Click on node: opens Gene Detail Card panel on right side

### 7.3 Responsive Behavior

- All charts are wrapped in `ResponsiveContainer` (Recharts) or configured with `useResizeObserver` hook
- Below 768px breakpoint: charts stack vertically, tab navigation converts to accordion
- Print media query: charts render at fixed widths for PDF generation

---

## SECTION 8 — Mock API Design

### 8.1 Architecture

All mock API logic is implemented using **Mock Service Worker (MSW)** in development mode. MSW intercepts network requests at the service worker level, enabling realistic async behavior (delays, error simulation) without modifying application code. Switching to a real backend requires only removing the MSW initialization and pointing API URLs to production endpoints.

**Environment Configuration:**
```
VITE_API_MODE=mock        # Use MSW mock handlers
VITE_API_MODE=live        # Use real backend
VITE_API_BASE_URL=https://api.WallahGPT.com
```

### 8.2 Authentication Endpoints

```
POST /api/auth/login
Request:  { email: string, password: string }
Response: { token: string, user: UserProfile, expiresAt: number }

POST /api/auth/register
Request:  { name: string, email: string, password: string, role: UserRole }
Response: { token: string, user: UserProfile }

POST /api/auth/refresh
Request:  { refreshToken: string }
Response: { token: string, expiresAt: number }

POST /api/auth/logout
Response: { success: true }
```

### 8.3 WallahGPT1 Endpoints

```
POST /api/p1/predict-age
Request:
{
  experimentName: string,
  projectId: string,
  methylationFileId: string,       // uploaded file reference
  rnaSeqFileId?: string,
  tissueType: string,
  species: string,
  chronologicalAge: number,
  sex: string,
  modelConfig: ModelConfiguration,
  preprocessingOptions: string[]
}

Response:
{
  experimentId: string,
  status: "queued" | "running" | "complete" | "failed",
  jobId: string
}

GET /api/p1/results/:experimentId
Response:
{
  experimentId: string,
  status: "complete",
  predictedBiologicalAge: 67.4,
  chronologicalAge: 62,
  ageAccelerationScore: 5.4,
  ageAccelerationClass: "accelerated",
  shapGenes: [
    { gene: "ELOVL2", shapValue: 0.84, expressionLevel: 2.3, direction: "up" },
    { gene: "FHL2", shapValue: 0.71, expressionLevel: -1.2, direction: "down" },
    ...
  ],
  diseaseClassification: {
    alzheimers: 0.23,
    parkinsons: 0.08,
    cardiovascular: 0.41,
    type2diabetes: 0.19,
    cancer: 0.31
  },
  therapeuticTargets: [
    { gene: "ELOVL2", score: 0.91, knownDrugTarget: true, actionabilityScore: 8.4 },
    ...
  ]
}

GET /api/p1/jobs/:jobId/status
Response: { jobId: string, progress: 0-100, stage: string, eta: number }
```

### 8.4 WallahGPT2 Endpoints

```
POST /api/p2/generate-data
Request:
{
  experimentName: string,
  projectId: string,
  tissueType: string,
  species: string[],
  ageRange: { min: number, max: number },
  biologicalCondition: string,
  diseaseState?: string,
  dataModalities: string[],
  numberOfSamples: number,
  referenceDataset: string,
  noiseLevel: string,
  batchEffectSimulation: boolean,
  preserveCorrelationStructure: boolean,
  seed?: number,
  modelConfig: ModelConfiguration
}

Response:
{
  experimentId: string,
  status: "queued",
  jobId: string,
  estimatedDuration: 45  // seconds
}

GET /api/p2/results/:experimentId
Response:
{
  experimentId: string,
  status: "complete",
  generatedSamples: 500,
  features: 20531,
  modalities: ["rna_seq"],
  generationTimeSeconds: 42,
  qualityMetrics: {
    meanExpressionSimilarity: 0.94,
    variancePreservation: 0.91,
    correlationStructure: 0.88,
    pcaVarianceExplained: [0.34, 0.18, 0.09]
  },
  downloadFiles: [
    { name: "synthetic_rnaseq_matrix.csv", size: 14900000, url: "/api/p2/download/..." },
    { name: "sample_metadata.csv", size: 46000, url: "/api/p2/download/..." },
    { name: "generation_config.json", size: 2100, url: "/api/p2/download/..." }
  ]
}
```

### 8.5 WallahGPT3 Endpoints

```
POST /api/p3/drug-screen
Request:
{
  experimentName: string,
  projectId: string,
  tissueType: string,
  diseaseCondition: string,
  ageRange: { min: number, max: number },
  geneTargets: [
    { gene: string, expressionLevel: number, direction: "up" | "down" | "any" }
  ],
  compoundSmiles?: string[],
  compoundFileId?: string,
  screeningMode: "broad" | "targeted" | "lead_optimization",
  maxCompounds: number,
  pathwayFocus: string[],
  filterToxicity: boolean,
  modelConfig: ModelConfiguration
}

Response:
{
  experimentId: string,
  status: "queued",
  jobId: string
}

GET /api/p3/results/:experimentId
Response:
{
  experimentId: string,
  status: "complete",
  compoundsScreened: 50000,
  topCandidates: [
    {
      rank: 1,
      compoundId: "CPD-0001",
      compoundName: "Rapamycin Analog",
      smiles: "CC1CCCC...",
      efficacyScore: 0.94,
      selectivityScore: 0.87,
      toxicityFlag: null,
      mechanismOfAction: "mTOR inhibitor",
      predictedGeneChanges: { "MTOR": -2.3, "S6K1": -1.8, "4EBP1": -1.5 }
    },
    ...
  ],
  enrichedPathways: [
    { pathway: "mTOR signaling", pValue: 0.0001, enrichmentScore: 3.4, geneCount: 24 },
    ...
  ],
  geneExpressionMatrix: { ... }
}
```

### 8.6 Project and History Endpoints

```
GET    /api/projects
POST   /api/projects
GET    /api/projects/:projectId
PUT    /api/projects/:projectId
DELETE /api/projects/:projectId

GET    /api/experiments?projectId=&system=&status=&page=&limit=
GET    /api/experiments/:experimentId
DELETE /api/experiments/:experimentId

GET    /api/users/me
PUT    /api/users/me
GET    /api/admin/users           (admin only)
PUT    /api/admin/users/:id/role  (admin only)
```

### 8.7 Mock Response Delays

To simulate realistic async behavior, MSW handlers use randomized delays:

| Endpoint Type | Min Delay | Max Delay |
|---------------|-----------|-----------|
| Auth endpoints | 300ms | 800ms |
| List/GET endpoints | 100ms | 400ms |
| P1 prediction start | 200ms | 500ms |
| P1 job polling | 50ms | 150ms |
| P1 result (simulated) | 8s | 15s |
| P2 generation start | 200ms | 500ms |
| P2 result (simulated) | 20s | 45s |
| P3 screen start | 200ms | 500ms |
| P3 result (simulated) | 15s | 30s |

---

## SECTION 9 — Project Structure

### 9.1 Complete Folder Structure

```
WallahGPT-frontend/
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── assets/                        # Static images, logos
│
├── src/
│   ├── api/                           # API service layer
│   │   ├── client.ts                  # Axios instance with interceptors
│   │   ├── auth.api.ts                # Auth endpoints
│   │   ├── p1.api.ts                  # WallahGPT1 endpoints
│   │   ├── p2.api.ts                  # WallahGPT2 endpoints
│   │   ├── p3.api.ts                  # WallahGPT3 endpoints
│   │   ├── projects.api.ts            # Project CRUD
│   │   ├── experiments.api.ts         # Experiment history
│   │   └── admin.api.ts               # Admin endpoints
│   │
│   ├── mocks/                         # MSW mock handlers
│   │   ├── browser.ts                 # MSW browser setup
│   │   ├── handlers/
│   │   │   ├── auth.handlers.ts
│   │   │   ├── p1.handlers.ts
│   │   │   ├── p2.handlers.ts
│   │   │   ├── p3.handlers.ts
│   │   │   └── projects.handlers.ts
│   │   └── fixtures/                  # Static mock data files
│   │       ├── p1.fixtures.ts
│   │       ├── p2.fixtures.ts
│   │       └── p3.fixtures.ts
│   │
│   ├── components/                    # Shared, reusable UI components
│   │   ├── ui/                        # shadcn/ui component copies
│   │   ├── common/
│   │   │   ├── FileUploadZone.tsx     # React Dropzone wrapper
│   │   │   ├── ProgressBar.tsx        # Job progress indicator
│   │   │   ├── StatusBadge.tsx        # Experiment status badge
│   │   │   ├── DataTable.tsx          # Generic sortable table
│   │   │   ├── DownloadButton.tsx     # File download trigger
│   │   │   ├── EmptyState.tsx         # Empty list / no results state
│   │   │   ├── ErrorBoundary.tsx      # React error boundary
│   │   │   └── LoadingSpinner.tsx
│   │   │
│   │   └── model/
│   │       ├── ModelSelectorModal.tsx # Full model config dialog
│   │       ├── ModelSelectorWidget.tsx # Compact inline selector
│   │       ├── ModelProfileCard.tsx   # Saved profile display
│   │       └── ApiKeyField.tsx        # Masked key input
│   │
│   ├── modules/                       # Feature modules per AI system
│   │   ├── p1/
│   │   │   ├── P1ExperimentPanel.tsx  # Full P1 layout
│   │   │   ├── P1InputForm.tsx        # Left panel inputs
│   │   │   ├── P1ResultsPanel.tsx     # Right panel results
│   │   │   ├── P1AgeGaugeCard.tsx     # Predicted age card
│   │   │   ├── P1ShapTab.tsx          # SHAP tab content
│   │   │   ├── P1DiseaseTab.tsx       # Disease classification
│   │   │   └── P1TherapeuticsTab.tsx  # Therapeutic targets
│   │   │
│   │   ├── p2/
│   │   │   ├── P2ExperimentPanel.tsx
│   │   │   ├── P2InputForm.tsx
│   │   │   ├── P2ResultsPanel.tsx
│   │   │   ├── P2PreviewTab.tsx
│   │   │   ├── P2QualityTab.tsx
│   │   │   └── P2DownloadsTab.tsx
│   │   │
│   │   └── p3/
│   │       ├── P3ExperimentPanel.tsx
│   │       ├── P3InputForm.tsx
│   │       ├── P3GeneTargetEditor.tsx # Dynamic gene table
│   │       ├── P3ResultsPanel.tsx
│   │       ├── P3RankingsTab.tsx
│   │       ├── P3ExpressionTab.tsx
│   │       ├── P3PathwayTab.tsx
│   │       └── P3ComparisonTab.tsx
│   │
│   ├── pages/                         # Route-level page components
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ProjectWorkspacePage.tsx
│   │   ├── ExperimentBuilderPage.tsx
│   │   ├── P1ExperimentPage.tsx
│   │   ├── P2ExperimentPage.tsx
│   │   ├── P3ExperimentPage.tsx
│   │   ├── ResultsViewerPage.tsx
│   │   ├── ExperimentHistoryPage.tsx
│   │   ├── ModelSettingsPage.tsx
│   │   ├── ProfileSettingsPage.tsx
│   │   └── AdminPage.tsx
│   │
│   ├── layouts/                       # Page layout wrappers
│   │   ├── PublicLayout.tsx           # Landing, login, register
│   │   ├── AppLayout.tsx              # Authenticated app shell
│   │   ├── AppSidebar.tsx             # Left navigation sidebar
│   │   ├── AppTopBar.tsx              # Top navigation bar
│   │   └── ProtectedRoute.tsx         # Auth guard HOC
│   │
│   ├── charts/                        # Visualization components
│   │   ├── ShapBarChart.tsx
│   │   ├── BiologicalAgeGauge.tsx
│   │   ├── AgingDistributionChart.tsx
│   │   ├── DiseaseClassificationChart.tsx
│   │   ├── OmicsPCAPlot.tsx
│   │   ├── DensityComparisonPlot.tsx
│   │   ├── ExpressionHeatmap.tsx
│   │   ├── VolcanoPlot.tsx
│   │   ├── DrugRankingChart.tsx
│   │   ├── GenePathwayNetwork.tsx
│   │   └── EnrichedPathwayChart.tsx
│   │
│   ├── hooks/                         # Custom React hooks
│   │   ├── useAuth.ts                 # Auth state and actions
│   │   ├── useExperimentJob.ts        # Job polling hook
│   │   ├── useFileUpload.ts           # File upload with progress
│   │   ├── useModelConfig.ts          # Model config CRUD
│   │   ├── useExperimentHistory.ts    # History query hook
│   │   └── useDownload.ts             # File download handler
│   │
│   ├── stores/                        # Zustand state stores
│   │   ├── authStore.ts
│   │   ├── experimentStore.ts
│   │   ├── modelStore.ts
│   │   └── uiStore.ts
│   │
│   ├── types/                         # TypeScript type definitions
│   │   ├── auth.types.ts
│   │   ├── experiment.types.ts
│   │   ├── model.types.ts
│   │   ├── p1.types.ts
│   │   ├── p2.types.ts
│   │   ├── p3.types.ts
│   │   └── api.types.ts               # Generic API response types
│   │
│   ├── utils/                         # Pure utility functions
│   │   ├── formatters.ts              # Number, date, score formatters
│   │   ├── validators.ts              # Zod schemas for forms
│   │   ├── fileUtils.ts               # File parsing and validation
│   │   ├── colorScales.ts             # Scientific color scale helpers
│   │   └── constants.ts               # App-wide constants
│   │
│   ├── router/
│   │   └── index.tsx                  # React Router config
│   │
│   ├── App.tsx                        # Root component
│   ├── main.tsx                       # Entry point
│   └── vite-env.d.ts
│
├── .env.development                   # VITE_API_MODE=mock
├── .env.production                    # VITE_API_MODE=live, VITE_API_BASE_URL=...
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── package.json
└── pnpm-lock.yaml
```

### 9.2 Folder Purpose Summary

| Folder | Purpose |
|--------|---------|
| `src/api/` | All HTTP request functions — the only place API URLs appear. Swap mock↔real here. |
| `src/mocks/` | MSW service worker and mock handlers. Active in development only. |
| `src/components/` | Shared, stateless UI building blocks used across all modules and pages. |
| `src/modules/` | Feature-specific panels for each AI system — complex, stateful components. |
| `src/pages/` | Route-level components — thin wrappers that compose modules and layouts. |
| `src/layouts/` | Page shell components, navigation, and route protection logic. |
| `src/charts/` | All data visualization components — isolated for reusability and testing. |
| `src/hooks/` | Shared React hooks encapsulating business logic and server state queries. |
| `src/stores/` | Zustand global state slices — one file per domain. |
| `src/types/` | TypeScript interfaces for all data shapes — the contract between frontend and backend. |
| `src/utils/` | Pure functions with no side effects — formatters, validators, constants. |

---

## SECTION 10 — User Experience Design

### 10.1 Research-Oriented UX Principles

Scientific researchers have distinct needs compared to typical web application users. The following UX principles are applied throughout the platform:

**Principle 1 — Long-Running Experiment Awareness**  
Biological AI experiments can take seconds to minutes. The UI must never leave users uncertain about experiment status.

- All experiment submissions immediately show a "Job Queued" confirmation with a Job ID
- Persistent progress bar in the experiment panel shows stages with labels (e.g., "Running model inference... 67%")
- Users can navigate away — experiment status persists and is shown in the top notification bar
- A "Jobs Running" indicator in the top nav shows active experiment count with a spinner
- Browser tab title updates: "WallahGPT — Running P1 Experiment (67%)"
- On completion, a browser notification (if permission granted) and an in-app toast alert

**Principle 2 — Configuration Reproducibility**  
Scientists need to reproduce experiments exactly.

- Every experiment saves its full configuration as a JSON object
- "Reload Config" button on any past experiment recreates the exact same input form state
- All results pages show the configuration that produced them in a collapsible "Experiment Config" panel
- Download experiment config as JSON is available on every results page

**Principle 3 — Data Integrity Feedback**  
File uploads must be validated immediately to prevent wasted compute time.

- On file upload, immediate client-side validation checks: file format, expected column headers, row count, file size
- Validation results shown in a compact status card below the drop zone
- Warnings (missing optional columns) shown in amber, errors (invalid format) in red
- File preview (first 5 rows) shown in a scrollable mini-table

**Principle 4 — Non-Blocking Workflow**  
Users often run multiple experiments concurrently.

- Users can open new experiment tabs within a project without waiting for current jobs
- Experiment history page shows live status updates for all running jobs
- Results are accessible independently — starting a new experiment does not navigate away from results

**Principle 5 — Accessible Scientific Output**  
Visualizations must be readable, exportable, and accessible.

- All charts include a "View Data Table" toggle (accessibility + data verification)
- Color scales are colorblind-safe (tested against Deuteranopia, Protanopia)
- All interactive charts have keyboard navigation support
- Export as PNG available on all chart components
- Download underlying data as CSV available for every chart

### 10.2 Error Handling

| Error Type | User Experience |
|------------|----------------|
| Network error | Red toast: "Connection failed. Retrying..." with retry count |
| API validation error | Inline field errors on form, summary at top of panel |
| Job failure | Error card replaces progress bar with error message + support link |
| File upload error | Inline error below dropzone with specific reason |
| Auth token expiry | Modal: "Session expired — please log in again" with redirect to login |
| Permission denied | Inline message: "You don't have access to this resource" |
| Unknown error | Error boundary UI with "Reload" and "Report Issue" buttons |

### 10.3 Experiment History UX

The experiment history page provides:

- Paginated list (20 per page) with infinite scroll option
- Filter bar: by system (P1/P2/P3), status (complete/running/failed), date range, project
- Search: by experiment name or ID
- Each row shows: experiment name, system, status badge, creation time, runtime, project name
- Row actions: View Results, Reload Config, Duplicate, Delete
- Bulk actions: Delete selected, Export selected as ZIP

### 10.4 Downloadable Reports

| Report Type | Format | Contents |
|-------------|--------|---------|
| P1 Full Report | PDF | Patient summary, age prediction, SHAP chart, disease scores, therapeutic targets |
| P1 SHAP Data | CSV | Gene name, SHAP value, expression level, direction |
| P1 Raw Results | JSON | Full API response object |
| P2 Synthetic Dataset | CSV | Generated omics matrix |
| P2 Sample Metadata | CSV | Sample IDs, age, tissue, condition |
| P2 QC Report | PDF | Quality metrics, PCA plot, distribution comparison |
| P3 Drug Rankings | CSV | Ranked compound list with scores |
| P3 Expression Changes | CSV | Gene × compound expression matrix |
| P3 Full Report | PDF | Top candidates, mechanism summaries, pathway analysis |

---

## SECTION 11 — Frontend Development Roadmap

### Phase 1 — Foundation & Authentication (Week 1–2)

**Deliverables:**
- Project scaffold with Vite + React + TypeScript + TailwindCSS + shadcn/ui
- MSW setup and base mock handlers (auth + projects)
- Zustand store setup (authStore, uiStore)
- PublicLayout and AppLayout skeleton
- Login page and Registration page (with role selection)
- JWT authentication flow (login, persist session, logout, token refresh)
- ProtectedRoute component
- React Router configuration (all routes defined, pages as stubs)
- Dashboard page (static layout with placeholder cards)
- Basic sidebar navigation

**Completion Criteria:** User can log in, see dashboard, navigate between page stubs, and log out.

---

### Phase 2 — WallahGPT1 UI (Week 3–4)

**Deliverables:**
- P1 experiment page layout (split-panel: input left, results right)
- FileUploadZone component (drag-and-drop, file validation, preview table)
- P1 input form (all parameters with React Hook Form + Zod validation)
- P1 mock API handler with simulated 10-second delay
- Job polling hook (`useExperimentJob`) with progress bar UI
- P1 Results Panel with 4 tabs
- `ShapBarChart` component (Recharts)
- `BiologicalAgeGauge` component (D3/SVG)
- `DiseaseClassificationChart` component (Recharts)
- Therapeutic targets table
- CSV and JSON download functionality
- Experiment config save to history (mock)

**Completion Criteria:** User can upload files, configure P1 experiment, watch simulated job run, and view complete results with functional charts.

---

### Phase 3 — WallahGPT2 UI (Week 5–6)

**Deliverables:**
- P2 experiment page layout
- P2 input form (all parameters including dual-range age slider)
- P2 mock API handler (simulated 30-second generation delay)
- Generation progress UI (multi-stage progress bar, log stream)
- `OmicsPCAPlot` (Plotly)
- `DensityComparisonPlot` (Plotly)
- Dataset preview table (paginated)
- QC metrics cards
- File download manifest with mock file downloads

**Completion Criteria:** User can configure synthetic data generation, watch multi-stage progress, and access quality metrics and downloads.

---

### Phase 4 — WallahGPT3 UI (Week 7–8)

**Deliverables:**
- P3 experiment page layout
- P3GeneTargetEditor (dynamic table for gene/expression input)
- Compound SMILES input with basic syntax validation
- P3 mock API handler (simulated 20-second screen delay)
- Screening progress UI with compounds-screened counter
- Drug rankings sortable table with row expansion
- `ExpressionHeatmap` (Plotly)
- `VolcanoPlot` (Plotly)
- `GenePathwayNetwork` (D3.js force-directed)
- `EnrichedPathwayChart` (Recharts)
- Multi-compound comparison view

**Completion Criteria:** User can configure a drug screening experiment and view complete ranked results with all visualization tabs functional.

---

### Phase 5 — Model Selection System (Week 9)

**Deliverables:**
- `ModelSelectorModal` component (all 6 provider tabs)
- `ModelSelectorWidget` (compact inline version for experiment panels)
- `modelStore` Zustand store (global + per-system model configs)
- Model profiles CRUD (create, save, edit, delete named profiles)
- `ApiKeyField` component (masked input + reveal toggle)
- Connection test mock handler
- Model Settings page (`/settings/models`) with all sections
- Per-system model override panels
- Model config passed through experiment submission payloads

**Completion Criteria:** Senior users can configure any supported model provider per experiment, save named profiles, and have model config flow through to experiment submissions.

---

### Phase 6 — Experiment History & Dashboard (Week 10)

**Deliverables:**
- Experiment history page (paginated list, filters, search)
- History row actions (view, reload config, duplicate, delete)
- Bulk actions (delete, export)
- Results Viewer page (standalone full-screen results for past experiments)
- Dashboard enhancements (recent experiments, project summary cards, quick-launch buttons)
- Project workspace page (project-level experiment list)
- `ExperimentTimelineChart` (experiments over time)

**Completion Criteria:** Complete experiment lifecycle visible — run, view results, access history, reload and re-run past configurations.

---

### Phase 7 — Admin Panel & Polish (Week 11–12)

**Deliverables:**
- Admin page (user list table, role management, system status cards)
- Profile settings page (name, email, notification preferences)
- Notification system (toast queue, in-app notification center)
- Browser notification integration (job completion alerts)
- Full error handling pass (all API errors, form errors, boundary errors)
- Colorblind-safe chart palette pass
- Accessibility audit (keyboard navigation, ARIA labels, focus management)
- Performance optimization (code splitting, lazy loading of chart libraries)
- End-to-end smoke tests (Playwright)
- Documentation: component library Storybook stories for all major components

**Completion Criteria:** Production-quality prototype ready for user testing with full UX polish, admin capabilities, and test coverage.

---

## SECTION 12 — Future Backend Integration

### 12.1 FastAPI Backend Integration

The frontend API layer (`/src/api/`) is designed for zero-friction backend integration. Each API module exports typed async functions that call specific endpoints. To connect to a real FastAPI backend:

1. Set `VITE_API_MODE=live` in the production environment file
2. Set `VITE_API_BASE_URL` to the FastAPI base URL (e.g., `https://api.WallahGPT.com`)
3. Remove MSW service worker initialization from `main.tsx`
4. Ensure FastAPI CORS configuration allows the frontend origin

No component code, hooks, or stores require modification. TanStack Query's `queryFn` already calls the typed API functions — those functions simply start hitting real endpoints instead of MSW interceptors.

**Expected FastAPI Route Alignment:**

| Frontend Mock | FastAPI Route |
|---------------|--------------|
| `POST /api/p1/predict-age` | `POST /api/v1/p1/predict-age` |
| `GET /api/p1/results/:id` | `GET /api/v1/p1/results/{experiment_id}` |
| `GET /api/p1/jobs/:jobId/status` | `GET /api/v1/jobs/{job_id}/status` |
| `POST /api/p2/generate-data` | `POST /api/v1/p2/generate-data` |
| `POST /api/p3/drug-screen` | `POST /api/v1/p3/drug-screen` |

### 12.2 GPU Inference Worker Integration

The frontend interacts with GPU inference workers indirectly through the FastAPI backend. The integration contract from the frontend's perspective:

- **Submission:** Frontend POSTs experiment config → FastAPI enqueues job in Celery/Ray queue → returns `jobId`
- **Polling:** Frontend polls `GET /api/jobs/:jobId/status` every 5 seconds → FastAPI reads job state from Redis
- **Completion:** Job status returns `{ status: "complete", resultId: "..." }` → Frontend fetches results by ID
- **The `useExperimentJob` hook** handles this polling lifecycle and is fully implemented in Phase 1 — only the data source changes

### 12.3 ML Model API Integration

The model configuration object (`ModelConfiguration`) passed with each experiment request is forwarded from the frontend through FastAPI to the ML inference layer. The frontend already collects:

- Provider, model name, temperature, max tokens, API key, endpoint URL

The backend must accept this configuration and use it to route inference requests to the appropriate model provider. No frontend changes are required when new model providers are added — only a new provider tab in the `ModelSelectorModal` is needed.

### 12.4 File Upload and Storage Integration

In Phase 1, file references are mock strings. In production:

1. Frontend requests a pre-signed upload URL from the backend: `POST /api/files/upload-url`
2. Frontend uploads file directly to cloud storage (S3/GCS) using the pre-signed URL
3. Frontend sends the returned `fileId` (S3 key / GCS path) as part of the experiment config
4. Backend ML pipeline reads files directly from cloud storage by `fileId`

The `useFileUpload` hook is architected to support this two-step upload pattern. In mock mode, it skips step 1–2 and returns a mock `fileId`.

### 12.5 Data Storage Systems

| Data Type | Recommended Storage | Frontend Impact |
|-----------|-------------------|-----------------|
| User accounts, project metadata | PostgreSQL via FastAPI | REST CRUD already designed |
| Experiment configurations | PostgreSQL (JSON column) | Experiment history API already designed |
| Uploaded omics files | S3 / GCS | Pre-signed URL upload pattern ready |
| Experiment results | S3 (JSON) + PostgreSQL (metadata) | Results fetched by experiment ID |
| Generated synthetic datasets | S3 | Download URLs already in response schema |
| Job state / progress | Redis | Polling endpoint already implemented |
| Audit logs | PostgreSQL | Admin panel ready to display |

### 12.6 Authentication Integration

The frontend JWT auth flow is compatible with standard FastAPI JWT implementations (e.g., `python-jose`, `fastapi-users`). To connect:

1. Point `POST /api/auth/login` to the FastAPI login endpoint
2. Ensure the response shape matches: `{ token: string, user: UserProfile, expiresAt: number }`
3. The Axios client interceptor already attaches `Authorization: Bearer <token>` to all requests
4. Token refresh is handled by the Axios response interceptor on 401 responses

If OAuth2 (Google, ORCID) is added to the backend, the frontend login page will need OAuth redirect buttons added — the auth store architecture already supports storing external provider tokens.

---

## Appendix A — TypeScript Type Reference

### Core Types

```typescript
// User and Auth
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'researcher' | 'analyst' | 'clinician' | 'manager' | 'engineer' | 'admin';
  organization?: string;
  createdAt: string;
}

// Experiment
interface Experiment {
  id: string;
  name: string;
  system: 'p1' | 'p2' | 'p3';
  projectId: string;
  status: 'draft' | 'queued' | 'running' | 'complete' | 'failed';
  modelConfig: ModelConfiguration;
  config: P1Config | P2Config | P3Config;
  createdAt: string;
  completedAt?: string;
  runtimeSeconds?: number;
}

// Model
interface ModelConfiguration {
  provider: 'platform_default' | 'openai' | 'anthropic' | 'huggingface' | 'local' | 'custom';
  modelName: string;
  temperature: number;
  maxTokens: number;
  endpointUrl?: string;
  apiKey?: string;
  authHeader?: string;
}

// P1
interface P1Config {
  methylationFileId: string;
  rnaSeqFileId?: string;
  tissueType: string;
  species: string;
  chronologicalAge: number;
  sex: string;
  preprocessingOptions: string[];
}

interface P1Results {
  predictedBiologicalAge: number;
  chronologicalAge: number;
  ageAccelerationScore: number;
  ageAccelerationClass: 'normal' | 'accelerated' | 'decelerated';
  shapGenes: ShapGene[];
  diseaseClassification: DiseaseClassification;
  therapeuticTargets: TherapeuticTarget[];
}
```

---

## Appendix B — Environment Variables

```bash
# Development (.env.development)
VITE_API_MODE=mock
VITE_APP_TITLE=WallahGPT Platform (Dev)
VITE_MOCK_JOB_DELAY_P1=10000
VITE_MOCK_JOB_DELAY_P2=30000
VITE_MOCK_JOB_DELAY_P3=20000

# Production (.env.production)
VITE_API_MODE=live
VITE_API_BASE_URL=https://api.WallahGPT.com
VITE_APP_TITLE=WallahGPT Platform
VITE_SENTRY_DSN=https://...
VITE_ANALYTICS_ID=G-XXXXXXXXXX
```

---

*End of WallahGPT Frontend Architecture Document v1.0.0*

*This document is intended for use by engineering teams, code generation systems, and platform architects. All API contracts, type definitions, and architectural decisions described herein should be treated as binding specifications for the initial frontend implementation.*
