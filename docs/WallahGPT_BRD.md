# WallahGPT — Business Requirements Document (BRD)

**Document Version:** 1.0  
**Date:** March 2026  
**Project:** WallahGPT In-Silico Drug Discovery & Omics Platform  
**Prepared By:** ZeroKost Engineering Team  
**Status:** Approved for Development

---

## 1. Executive Summary

WallahGPT is an AI-powered, cloud-deployable, in-silico computational biology platform targeting pharmaceutical researchers, academic scientists, and bioinformaticians. The platform eliminates the cost and time barriers associated with wet-lab experimentation by providing three specialized AI modules — a **Biological Aging Clock** (WallahGPT1), a **Synthetic Omics Data Generator** (WallahGPT2), and a **Digital Drug Discovery Engine** (WallahGPT3) — all powered by locally-hosted Large Language Models (LLMs) through an Ollama inference layer.

The platform is engineered to deliver scientifically valid simulation outputs within seconds, enable data export, provide structured experiment tracking, and serve as a research-grade alternative to wet-lab pre-screening.

---

## 2. Business Objectives

| # | Objective | KPI / Success Metric |
|---|-----------|----------------------|
| BO-01 | Reduce in-silico research time from weeks to minutes | 90% of experiments complete in < 2 minutes |
| BO-02 | Provide zero-wet-lab simulation capability | All 3 modules return structured scientific JSON output |
| BO-03 | Be deployable at zero-cloud-cost (local Ollama inference) | $0 LLM API cost per experiment |
| BO-04 | Enable reproducible scientific exploration | All experiments logged to MongoDB with UUIDs |
| BO-05 | Serve a global research community (multi-user SaaS) | JWT-authenticated user accounts with project isolation |
| BO-06 | Provide export-ready datasets for downstream analysis | CSV/TSV export available on all result panels |
| BO-07 | Offer fallback science when LLM is unavailable | Statistical simulation fallback on all 3 modules |

---

## 3. Scope

### 3.1 In Scope

- **WallahGPT1:** Biological age prediction from molecular biomarker inputs (DNA methylation, RNA-seq, etc.)
- **WallahGPT2:** Synthetic multi-omics dataset generation with preserved correlation structures
- **WallahGPT3:** In-silico drug perturbation screening and lead compound ranking
- JWT-based user authentication and registration
- Project management (create, list, assign experiments to projects)
- Experiment history tracking and result retrieval
- LLM model selection per experiment (Phi-3, Llama 3, Gemma, Mistral via Ollama)
- Statistical simulation fallback engine for all three modules
- Scientific data visualization using Recharts and Plotly
- CSV/TSV export of results
- ZeroKost glassmorphic dark-mode UI

### 3.2 Out of Scope (v1.0)

- Real wet-lab data integration (LIMS connectivity)
- Proprietary compound databases (e.g., ChEMBL API real-time)
- Cloud-hosted LLM inference (OpenAI/Anthropic) — deferred to v2.0
- Mobile application
- PDF report generation
- Real-time multi-user collaboration (live editing)

---

## 4. Stakeholders

| Role | Responsibility | Representative |
|------|---------------|----------------|
| Product Owner | Approve BRD & prioritize features | ZeroKost Leadership |
| Engineering Lead | Architecture & implementation | Development Team |
| End Users — Pharma Researchers | Primary consumers of drug discovery module (WallahGPT3) | External |
| End Users — Bioinformaticians | Primary consumers of aging & omics modules | External |
| QA Team | Test all API endpoints and UI flows | Internal |
| DevOps | Deployment, CI/CD, and Ollama server management | Internal |

---

## 5. Business Requirements

### 5.1 User Authentication & Account Management

| Req ID | Requirement | Priority |
|--------|-------------|----------|
| BR-AUTH-01 | Users SHALL be able to register with email and password | MUST |
| BR-AUTH-02 | Users SHALL receive a JWT token upon successful login | MUST |
| BR-AUTH-03 | Tokens SHALL expire after a configurable time window | MUST |
| BR-AUTH-04 | Password MUST be hashed using bcrypt before storage | MUST |
| BR-AUTH-05 | Failed login attempts SHALL return a non-descriptive 401 error | SHOULD |

### 5.2 Project Management

| Req ID | Requirement | Priority |
|--------|-------------|----------|
| BR-PROJ-01 | Authenticated users SHALL create named research projects | MUST |
| BR-PROJ-02 | Each experiment SHALL belong to exactly one project | MUST |
| BR-PROJ-03 | Users SHALL list all their projects | MUST |
| BR-PROJ-04 | Projects SHALL store a name, description, and creation timestamp | MUST |

### 5.3 WallahGPT1 — Biological Aging Clock

| Req ID | Requirement | Priority |
|--------|-------------|----------|
| BR-P1-01 | User SHALL provide chronological age, tissue type, and omics data | MUST |
| BR-P1-02 | System SHALL predict biological age with acceleration score | MUST |
| BR-P1-03 | System SHALL return SHAP-ranked gene importance list | MUST |
| BR-P1-04 | System SHALL classify result as Accelerated / Normal / Decelerated | MUST |
| BR-P1-05 | System SHALL return disease risk classification | MUST |
| BR-P1-06 | System SHALL return therapeutic target suggestions | SHOULD |
| BR-P1-07 | If LLM fails, system SHALL fall back to statistical simulation | MUST |
| BR-P1-08 | Supported tissue types: Brain, Blood, Skin, Liver, Muscle, Lung | MUST |

### 5.4 WallahGPT2 — Synthetic Omics Generator

| Req ID | Requirement | Priority |
|--------|-------------|----------|
| BR-P2-01 | User SHALL specify dataset type (RNA-seq, Methylation, Proteomics, ATAC-seq) | MUST |
| BR-P2-02 | User SHALL specify number of samples (N) and feature count | MUST |
| BR-P2-03 | System SHALL generate statistically valid synthetic matrices | MUST |
| BR-P2-04 | User SHALL configure group definitions (e.g., control vs. aged) | MUST |
| BR-P2-05 | System SHALL preserve inter-gene correlation structures | MUST |
| BR-P2-06 | System SHALL support batch effect simulation | SHOULD |
| BR-P2-07 | Output SHALL be downloadable as CSV/TSV | MUST |
| BR-P2-08 | System SHALL provide dataset quality metrics (variance explained, etc.) | SHOULD |

### 5.5 WallahGPT3 — Digital Drug Discovery

| Req ID | Requirement | Priority |
|--------|-------------|----------|
| BR-P3-01 | User SHALL provide gene targets with expression direction & level | MUST |
| BR-P3-02 | User SHALL specify tissue type, disease condition, and age range | MUST |
| BR-P3-03 | User SHALL select screening mode: Broad / Targeted / Lead Optimization | MUST |
| BR-P3-04 | System SHALL return a ranked list of candidate drug compounds | MUST |
| BR-P3-05 | System SHALL return predicted gene expression changes per compound | MUST |
| BR-P3-06 | System SHALL return pathway enrichment scores | MUST |
| BR-P3-07 | User SHALL be able to apply ADME/Toxicity filtering | MUST |
| BR-P3-08 | System SHALL support pathway focus specifications | SHOULD |
| BR-P3-09 | System SHALL support up to 50,000 in-silico compound screened | MUST |

### 5.6 Experiment History & Logging

| Req ID | Requirement | Priority |
|--------|-------------|----------|
| BR-EXP-01 | All experiments SHALL be persisted in MongoDB with a UUID | MUST |
| BR-EXP-02 | Users SHALL retrieve a list of past experiments per project | MUST |
| BR-EXP-03 | Each experiment record SHALL store: type, request payload, result, timestamp | MUST |
| BR-EXP-04 | Users SHALL be able to view any past experiment result | SHOULD |

### 5.7 Model Selection

| Req ID | Requirement | Priority |
|--------|-------------|----------|
| BR-MOD-01 | Users SHALL select LLM per experiment from available Ollama models | MUST |
| BR-MOD-02 | Supported models: phi3, llama3, gemma2, mistral | MUST |
| BR-MOD-03 | Users SHALL configure temperature and max token parameters | MUST |
| BR-MOD-04 | System SHALL validate that the model exists before execution | MUST |

---

## 6. Non-Functional Requirements

| NFR ID | Category | Requirement |
|--------|----------|-------------|
| NFR-01 | **Performance** | API endpoints SHALL respond within 120 seconds (including LLM inference) |
| NFR-02 | **Performance** | Statistical fallback SHALL respond within 3 seconds |
| NFR-03 | **Availability** | Platform SHALL target 99% uptime during business hours |
| NFR-04 | **Security** | All API endpoints (except `/health` and `/auth`) SHALL require JWT |
| NFR-05 | **Security** | Passwords SHALL never be stored in plaintext |
| NFR-06 | **Scalability** | System SHALL support up to 100 concurrent LLM experiments (with queue) |
| NFR-07 | **Usability** | UI SHALL display experiment progress indicators during long LLM calls |
| NFR-08 | **Reliability** | System SHALL gracefully degrade to simulation if Ollama is offline |
| NFR-09 | **Maintainability** | All modules shall be independently deployable via FastAPI routers |
| NFR-10 | **Logging** | Structured JSON logging SHALL be enabled for all API operations |
| NFR-11 | **Data Privacy** | Experiment data SHALL be isolated per user_id |
| NFR-12 | **Interoperability** | All result payloads SHALL be structured as validated JSON/Pydantic schemas |

---

## 7. Assumptions

1. Ollama LLM server runs either locally or on the same network as the backend.
2. MongoDB is accessible via the `MONGODB_URI` environment variable.
3. Users must have Node.js 18+ and Python 3.10+ to run the platform locally.
4. The system does not provide real molecular data — all outputs are AI/statistical simulations.
5. The frontend is a React SPA served by Vite dev server for local use.

---

## 8. Constraints

1. LLM inference is limited to models supported by Ollama (open-source models only in v1.0).
2. No cloud GPU — LLM runtime depends on local hardware capability.
3. MongoDB must be running for experiment logging to succeed.
4. Max token outputs per LLM response: configurable, default 4096.

---

## 9. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| LLM produces invalid JSON | HIGH | HIGH | ResponseParser + schema validation + simulation fallback |
| LLM inference times out | MEDIUM | HIGH | Configurable timeout + retry logic + automatic fallback |
| MongoDB connection failure | MEDIUM | MEDIUM | Async connection with structured error handling |
| Compound data accuracy misleads researchers | HIGH | HIGH | Clear disclaimer: "In-Silico Simulation — Not Clinical Advice" |
| Large synthetic datasets slow frontend | LOW | MEDIUM | Paginated API responses + lazy chart rendering |

---

## 10. Acceptance Criteria

| Module | Acceptance Criterion |
|--------|--------------------|
| WallahGPT1 | Returns valid P1Response with bio age, SHAP genes, disease risk within 120s |
| WallahGPT2 | Returns synthetic matrix schema with N×M dimensions and download link |
| WallahGPT3 | Returns minimum 5 ranked drug candidates with pathway scores |
| Auth | JWT issued on login; protected routes return 401 without valid token |
| Projects | Users can CRUD projects and assign experiments |
| Fallback | All 3 modules return simulation data when Ollama is unreachable |
| Export | CSV/TSV downloadable from all result panels |

---

## 11. Glossary

| Term | Definition |
|------|-----------|
| **LLM** | Large Language Model — AI model used for scientific reasoning (Phi-3, Llama 3, etc.) |
| **Ollama** | Open-source local LLM inference engine |
| **In-Silico** | Computer simulation of biological processes |
| **SHAP** | SHapley Additive exPlanations — method for feature importance in ML models |
| **ADME** | Absorption, Distribution, Metabolism, Excretion — drug pharmacokinetics |
| **Omics** | High-throughput molecular biology data (genome, transcriptome, proteome, etc.) |
| **RNA-seq** | RNA Sequencing — measures gene expression levels |
| **DNA Methylation** | Epigenetic modification used as biological aging biomarker |
| **Pathway Enrichment** | Statistical method to identify significantly active biological pathways |
| **Fallback Simulation** | Statistical random-seed simulation used when LLM is unavailable |
| **JWT** | JSON Web Token — standard for stateless authentication |

---

*End of Business Requirements Document — WallahGPT v1.0*
