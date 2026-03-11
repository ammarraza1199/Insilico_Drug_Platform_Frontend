# PreciousGPT Platform — Backend Architecture Document

**Document Type:** Backend Simulation Architecture & Implementation Specification  
**Version:** 1.0.0  
**Status:** Draft — For Engineering Review  
**Audience:** Backend Engineers, Platform Architects, DevOps, Code Generation Systems  
**Prepared By:** Principal AI Systems Architect / Computational Biology Platform Engineer / Backend Architect

---

## Table of Contents

1. [System Overview](#section-1--system-overview)
2. [Architecture Design](#section-2--architecture-design)
3. [Technology Stack](#section-3--technology-stack)
4. [Project Structure](#section-4--project-structure)
5. [API Layer Design](#section-5--api-layer-design)
6. [Pydantic Schema Definitions](#section-6--pydantic-schema-definitions)
7. [LLM Interface & Ollama Integration](#section-7--llm-interface--ollama-integration)
8. [Prompt Engine Design](#section-8--prompt-engine-design)
9. [Data Simulation & Fallback Logic](#section-9--data-simulation--fallback-logic)
10. [Model Selection System](#section-10--model-selection-system)
11. [Error Handling Strategy](#section-11--error-handling-strategy)
12. [Example API Payloads & Responses](#section-12--example-api-payloads--responses)
13. [Configuration & Environment](#section-13--configuration--environment)
14. [Implementation Roadmap](#section-14--implementation-roadmap)

---

## SECTION 1 — System Overview

### 1.1 Purpose

The PreciousGPT backend is a **simulation layer** designed to power an investor-facing demo of a computational biology AI research platform. The backend accepts experiment parameters from the frontend, constructs scientifically-grounded prompts, routes them through locally-running LLMs via Ollama, parses and validates the structured JSON output, and returns it to the frontend in a format that drives all charts, tables, and dashboards.

The system is explicitly **not** running real ML pipelines, GPU inference workers, or trained omics models. Instead, it leverages the general scientific knowledge encoded in instruction-tuned LLMs to produce plausible, structured biological data outputs — sufficient to demonstrate realistic platform behavior to investors and early users.

### 1.2 Design Philosophy

| Principle | Rationale |
|-----------|-----------|
| **LLM-as-simulator** | Local LLMs have sufficient biological knowledge to generate plausible gene names, age scores, and drug candidates for demo purposes |
| **Strict JSON contract** | All LLM outputs are constrained to defined schemas via prompt engineering and Pydantic validation |
| **Graceful fallback** | If LLM output fails schema validation, deterministic simulation functions produce valid data — the frontend always receives a response |
| **Model-agnostic routing** | Users can select any Ollama-served model; the backend routes transparently |
| **Future-ready** | The API surface and request/response contracts are identical to what a real ML backend would expose — replacing the simulation engine requires no frontend changes |

### 1.3 Request Lifecycle Summary

```
Frontend HTTP Request
        ↓
FastAPI Router
        ↓
Request Validator (Pydantic)
        ↓
Experiment Controller
        ↓
Prompt Engine  ←─── builds scientific structured prompt
        ↓
LLM Interface  ←─── calls Ollama API (selected model)
        ↓
Response Parser ←─── extracts JSON from LLM text output
        ↓
Schema Validator ←── Pydantic validates response shape
        ↓
Fallback Engine  ←── (if validation fails) generates simulated data
        ↓
Serialized JSON Response
        ↓
Frontend
```

---

## SECTION 2 — Architecture Design

### 2.1 System Layers

```
┌───────────────────────────────────────────────────────┐
│                     API LAYER                         │
│   FastAPI routers — /api/p1, /api/p2, /api/p3         │
│   Request validation, response serialization          │
└────────────────────────┬──────────────────────────────┘
                         │
┌────────────────────────▼──────────────────────────────┐
│               EXPERIMENT CONTROLLER                    │
│   Orchestrates: prompt building → LLM call → parse     │
│   One controller per system (P1, P2, P3)              │
└────────────────────────┬──────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
┌─────────▼──────┐ ┌─────▼──────┐ ┌────▼───────────────┐
│  PROMPT ENGINE │ │ LLM INTER- │ │  SCHEMA VALIDATOR  │
│                │ │    FACE    │ │                    │
│ Builds scien-  │ │            │ │ Pydantic models    │
│ tific prompts  │ │ Ollama API │ │ validate LLM JSON  │
│ for each system│ │ client     │ │ output shapes      │
└─────────┬──────┘ └─────┬──────┘ └────┬───────────────┘
          │              │              │
┌─────────▼──────────────▼──────────────▼───────────────┐
│                  SIMULATION ENGINE                     │
│   Fallback: deterministic data generation when         │
│   LLM output fails validation                          │
└───────────────────────────────────────────────────────┘
```

### 2.2 Component Responsibilities

**API Layer** — FastAPI routers that define endpoints, perform request body validation via Pydantic, and serialize responses. Thin layer — no business logic.

**Experiment Controller** — Orchestration layer. Receives validated request data, selects the correct prompt template, calls the LLM interface, receives raw text, triggers parsing, validates result, calls fallback if needed, and returns the final result object.

**Prompt Engine** — Builds scientifically accurate, schema-constraining system and user prompts for each of the three AI systems. Injects experiment parameters into prompt templates. Critical layer — prompt quality determines simulation realism.

**LLM Interface** — A clean abstraction over the Ollama HTTP API. Handles model selection, timeout, streaming vs non-streaming mode, retry logic, and error reporting. Isolated so any LLM backend (Ollama, OpenAI, HuggingFace) can be swapped in.

**Schema Validator** — Pydantic models defining the exact shape of each system's output. Used both for LLM output validation and frontend response serialization.

**Simulation Engine** — Deterministic fallback functions using NumPy, Pandas, and seeded random number generators. Produces biologically plausible but algorithmically generated data when LLM output is unusable.

---

## SECTION 3 — Technology Stack

| Component | Technology | Version | Rationale |
|-----------|-----------|---------|-----------|
| Framework | FastAPI | 0.111.x | Async-native, automatic OpenAPI docs, Pydantic integration |
| Runtime | Python | 3.11 | Latest stable; improved async performance |
| Data Validation | Pydantic | 2.x | V2 provides faster validation, cleaner model syntax |
| LLM Runtime | Ollama | Latest | Runs LLMs locally, no cloud dependency, free for demo |
| LLM HTTP Client | httpx | 0.27.x | Async HTTP client; replaces requests for async FastAPI |
| Data Simulation | Pandas + NumPy | Latest | Gene matrix simulation, statistical data generation |
| ASGI Server | Uvicorn | 0.30.x | Production-grade ASGI server for FastAPI |
| Config Management | python-dotenv | Latest | Environment variable management |
| Logging | Python `logging` + structlog | Latest | Structured JSON logs for observability |
| Testing | pytest + httpx | Latest | Async test client for FastAPI endpoint testing |

### 3.1 Ollama Model Configuration

| Model | Ollama Tag | RAM Required | Speed | Use Case |
|-------|-----------|-------------|-------|----------|
| Phi-3 Mini | `phi3:mini` | ~4 GB | Fast | Default — best speed/quality for demo |
| Llama 3.2 3B | `llama3.2:3b` | ~4 GB | Fast | Alternative lightweight option |
| Mistral 7B | `mistral:7b` | ~8 GB | Medium | Higher quality outputs |

**Pre-requisite:** Ollama must be installed and models pulled before running the backend.

```bash
# Install Ollama (macOS/Linux)
curl -fsSL https://ollama.ai/install.sh | sh

# Pull required models
ollama pull phi3:mini
ollama pull llama3.2:3b
ollama pull mistral:7b

# Verify
ollama list
```

---

## SECTION 4 — Project Structure

### 4.1 Complete Folder Structure

```
preciousgpt-backend/
│
├── main.py                          # FastAPI app entry point
├── config.py                        # Settings (Pydantic BaseSettings)
├── requirements.txt
├── .env                             # Environment variables
├── .env.example
├── README.md
│
├── api/                             # API layer — routers only
│   ├── __init__.py
│   ├── deps.py                      # Shared dependencies (auth, model selection)
│   ├── p1_router.py                 # Precious1GPT endpoints
│   ├── p2_router.py                 # Precious2GPT endpoints
│   ├── p3_router.py                 # Precious3GPT endpoints
│   └── health_router.py             # Health check + model status
│
├── controllers/                     # Orchestration — business logic
│   ├── __init__.py
│   ├── p1_controller.py             # Aging clock orchestration
│   ├── p2_controller.py             # Synthetic data orchestration
│   └── p3_controller.py             # Drug discovery orchestration
│
├── services/                        # Domain services
│   ├── __init__.py
│   ├── experiment_service.py        # Cross-cutting experiment utilities
│   └── file_service.py              # CSV generation and file handling
│
├── llm/                             # LLM interface layer
│   ├── __init__.py
│   ├── ollama_client.py             # Ollama HTTP API client (async)
│   ├── response_parser.py           # Extract JSON from LLM text output
│   └── model_registry.py            # Supported models + validation
│
├── prompts/                         # Prompt templates
│   ├── __init__.py
│   ├── p1_prompts.py                # Precious1GPT prompt builder
│   ├── p2_prompts.py                # Precious2GPT prompt builder
│   └── p3_prompts.py                # Precious3GPT prompt builder
│
├── schemas/                         # Pydantic request/response models
│   ├── __init__.py
│   ├── common.py                    # Shared types (ModelConfig, etc.)
│   ├── p1_schemas.py                # P1 request and response models
│   ├── p2_schemas.py                # P2 request and response models
│   └── p3_schemas.py                # P3 request and response models
│
├── simulation/                      # Fallback data generation
│   ├── __init__.py
│   ├── p1_simulation.py             # Aging clock data simulator
│   ├── p2_simulation.py             # Omics dataset generator
│   └── p3_simulation.py             # Drug candidate simulator
│
└── utils/                           # Utilities
    ├── __init__.py
    ├── logger.py                    # Structured logging setup
    ├── validators.py                # Custom validation helpers
    └── biology_constants.py         # Gene lists, tissue types, pathways
```

### 4.2 Component Purpose Summary

| Folder/File | Purpose |
|-------------|---------|
| `main.py` | FastAPI app factory, router registration, CORS, startup events |
| `config.py` | Centralized settings (Ollama URL, default model, timeouts) |
| `api/` | Thin HTTP layer — routing, request parsing, response serialization only |
| `controllers/` | Orchestration — calls prompt engine, LLM, parser, fallback in sequence |
| `services/` | Reusable domain logic not specific to one system |
| `llm/` | All Ollama communication isolated here — swap backends by replacing this layer |
| `prompts/` | Prompt templates and builders — the most critical layer for simulation quality |
| `schemas/` | All Pydantic models — both API contracts and internal data shapes |
| `simulation/` | Deterministic fallback generators — always produce valid schema-compliant data |
| `utils/` | Pure helpers: logging, biology constants (gene lists, pathways) |

---

## SECTION 5 — API Layer Design

### 5.1 main.py

```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from api.p1_router import router as p1_router
from api.p2_router import router as p2_router
from api.p3_router import router as p3_router
from api.health_router import router as health_router
from config import settings
from utils.logger import get_logger

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("PreciousGPT backend starting", model=settings.default_model)
    yield
    logger.info("PreciousGPT backend shutting down")


app = FastAPI(
    title="PreciousGPT API",
    description="Computational Biology AI Platform — Simulation Backend",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api", tags=["Health"])
app.include_router(p1_router, prefix="/api/p1", tags=["Precious1GPT"])
app.include_router(p2_router, prefix="/api/p2", tags=["Precious2GPT"])
app.include_router(p3_router, prefix="/api/p3", tags=["Precious3GPT"])
```

### 5.2 config.py

```python
# config.py
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Ollama
    ollama_base_url: str = "http://localhost:11434"
    default_model: str = "phi3:mini"
    ollama_timeout: int = 120  # seconds
    ollama_max_retries: int = 2

    # API
    allowed_origins: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    api_key_secret: str = "dev-secret-change-in-production"

    # Simulation
    fallback_enabled: bool = True
    simulation_seed: int = 42

    class Config:
        env_file = ".env"


settings = Settings()
```

### 5.3 P1 Router — Precious1GPT

```python
# api/p1_router.py
from fastapi import APIRouter, HTTPException, Depends
from schemas.p1_schemas import P1Request, P1Response
from controllers.p1_controller import P1Controller
from utils.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)


@router.post("/predict-age", response_model=P1Response)
async def predict_biological_age(request: P1Request):
    """
    Run a biological age prediction experiment.
    Accepts omics parameters, returns age prediction with SHAP gene rankings.
    """
    logger.info("P1 experiment started", tissue=request.tissue_type,
                species=request.species, model=request.model_config.model_name)
    try:
        controller = P1Controller()
        result = await controller.run(request)
        return result
    except Exception as e:
        logger.error("P1 experiment failed", error=str(e))
        raise HTTPException(status_code=500, detail=f"Experiment failed: {str(e)}")
```

### 5.4 P2 Router — Precious2GPT

```python
# api/p2_router.py
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from schemas.p2_schemas import P2Request, P2Response
from controllers.p2_controller import P2Controller
from utils.logger import get_logger
import io

router = APIRouter()
logger = get_logger(__name__)


@router.post("/generate-data", response_model=P2Response)
async def generate_synthetic_data(request: P2Request):
    """Generate a synthetic multi-omics dataset."""
    logger.info("P2 experiment started", modalities=request.data_modalities,
                samples=request.number_of_samples, model=request.model_config.model_name)
    try:
        controller = P2Controller()
        result = await controller.run(request)
        return result
    except Exception as e:
        logger.error("P2 experiment failed", error=str(e))
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")


@router.get("/download/{experiment_id}")
async def download_dataset(experiment_id: str):
    """Download a previously generated synthetic dataset as CSV."""
    # In production: retrieve from storage. For demo: regenerate.
    from simulation.p2_simulation import P2Simulator
    sim = P2Simulator(seed=42)
    csv_bytes = sim.generate_csv_bytes(n_samples=100, n_genes=500)
    return StreamingResponse(
        io.BytesIO(csv_bytes),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=synthetic_{experiment_id}.csv"}
    )
```

### 5.5 P3 Router — Precious3GPT

```python
# api/p3_router.py
from fastapi import APIRouter, HTTPException
from schemas.p3_schemas import P3Request, P3Response
from controllers.p3_controller import P3Controller
from utils.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)


@router.post("/drug-screen", response_model=P3Response)
async def run_drug_screen(request: P3Request):
    """Run an in-silico drug screening experiment."""
    logger.info("P3 experiment started", condition=request.disease_condition,
                tissue=request.tissue_type, model=request.model_config.model_name)
    try:
        controller = P3Controller()
        result = await controller.run(request)
        return result
    except Exception as e:
        logger.error("P3 experiment failed", error=str(e))
        raise HTTPException(status_code=500, detail=f"Drug screen failed: {str(e)}")
```

### 5.6 Health Router

```python
# api/health_router.py
from fastapi import APIRouter
from llm.ollama_client import OllamaClient
from llm.model_registry import SUPPORTED_MODELS
from config import settings

router = APIRouter()


@router.get("/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}


@router.get("/health/ollama")
async def ollama_health():
    """Check Ollama availability and list running models."""
    client = OllamaClient()
    available = await client.check_availability()
    return {
        "ollama_available": available,
        "ollama_url": settings.ollama_base_url,
        "default_model": settings.default_model,
        "supported_models": SUPPORTED_MODELS
    }
```

---

## SECTION 6 — Pydantic Schema Definitions

### 6.1 Common Schemas

```python
# schemas/common.py
from pydantic import BaseModel, Field
from typing import Optional, Literal


class ModelConfig(BaseModel):
    model_name: str = Field(
        default="phi3:mini",
        description="Ollama model tag to use for this experiment"
    )
    temperature: float = Field(default=0.3, ge=0.0, le=2.0)
    max_tokens: int = Field(default=2048, ge=256, le=8192)
    provider: Literal["ollama", "openai", "anthropic"] = "ollama"
    endpoint_url: Optional[str] = None
    api_key: Optional[str] = None
```

### 6.2 Precious1GPT Schemas

```python
# schemas/p1_schemas.py
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Literal, Dict
from schemas.common import ModelConfig


class P1Request(BaseModel):
    experiment_name: str = Field(..., min_length=1, max_length=200)
    project_id: Optional[str] = None
    tissue_type: str = Field(..., description="e.g. blood, brain, liver")
    species: Literal["human", "mouse", "rat", "zebrafish"] = "human"
    chronological_age: float = Field(..., ge=0, le=120)
    sex: Literal["male", "female", "unknown"] = "unknown"
    methylation_file_id: Optional[str] = None
    rna_seq_file_id: Optional[str] = None
    preprocessing_options: List[str] = []
    model_config: ModelConfig = ModelConfig()

    @field_validator("tissue_type")
    @classmethod
    def normalize_tissue(cls, v: str) -> str:
        return v.lower().strip()


class ShapGene(BaseModel):
    gene: str
    shap_value: float = Field(..., ge=0.0, le=1.0)
    expression_level: float
    direction: Literal["up", "down", "neutral"]
    chromosome: Optional[str] = None
    known_aging_gene: bool = False


class DiseaseClassification(BaseModel):
    alzheimers: float = Field(..., ge=0.0, le=1.0)
    parkinsons: float = Field(..., ge=0.0, le=1.0)
    cardiovascular: float = Field(..., ge=0.0, le=1.0)
    type2_diabetes: float = Field(..., ge=0.0, le=1.0)
    cancer: float = Field(..., ge=0.0, le=1.0)


class TherapeuticTarget(BaseModel):
    gene: str
    score: float = Field(..., ge=0.0, le=1.0)
    known_drug_target: bool
    actionability_score: float = Field(..., ge=0.0, le=10.0)
    mechanism: Optional[str] = None


class P1Response(BaseModel):
    experiment_id: str
    status: Literal["complete"] = "complete"
    predicted_biological_age: float
    chronological_age: float
    age_acceleration_score: float
    age_acceleration_class: Literal["normal", "accelerated", "decelerated"]
    shap_genes: List[ShapGene]
    disease_classification: DiseaseClassification
    therapeutic_targets: List[TherapeuticTarget]
    model_used: str
    simulation_mode: bool = True
    runtime_ms: int
```

### 6.3 Precious2GPT Schemas

```python
# schemas/p2_schemas.py
from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Dict, Any
from schemas.common import ModelConfig


class P2Request(BaseModel):
    experiment_name: str
    project_id: Optional[str] = None
    tissue_type: str
    species: List[str] = ["human"]
    age_range: Dict[str, int] = {"min": 20, "max": 80}
    biological_condition: Literal["healthy", "disease", "treatment", "post_treatment"] = "healthy"
    disease_state: Optional[str] = None
    data_modalities: List[Literal["rna_seq", "methylation", "proteomics", "metabolomics"]] = ["rna_seq"]
    number_of_samples: int = Field(default=100, ge=10, le=10000)
    noise_level: Literal["low", "medium", "high"] = "medium"
    batch_effect_simulation: bool = False
    preserve_correlation_structure: bool = True
    seed: Optional[int] = None
    model_config: ModelConfig = ModelConfig()


class QualityMetrics(BaseModel):
    mean_expression_similarity: float = Field(..., ge=0.0, le=1.0)
    variance_preservation: float = Field(..., ge=0.0, le=1.0)
    correlation_structure: float = Field(..., ge=0.0, le=1.0)
    pca_variance_explained: List[float]


class DownloadFile(BaseModel):
    name: str
    format: str
    size_bytes: int
    download_url: str


class P2Response(BaseModel):
    experiment_id: str
    status: Literal["complete"] = "complete"
    generated_samples: int
    features: int
    modalities: List[str]
    generation_time_seconds: float
    quality_metrics: QualityMetrics
    preview_data: List[Dict[str, Any]]    # First 5 rows as list of dicts
    download_files: List[DownloadFile]
    model_used: str
    simulation_mode: bool = True
```

### 6.4 Precious3GPT Schemas

```python
# schemas/p3_schemas.py
from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Dict
from schemas.common import ModelConfig


class GeneTarget(BaseModel):
    gene: str
    expression_level: float
    direction: Literal["up", "down", "any"] = "any"


class P3Request(BaseModel):
    experiment_name: str
    project_id: Optional[str] = None
    tissue_type: str
    disease_condition: str
    age_range: Dict[str, int] = {"min": 40, "max": 80}
    gene_targets: List[GeneTarget] = []
    compound_smiles: Optional[List[str]] = None
    compound_file_id: Optional[str] = None
    screening_mode: Literal["broad", "targeted", "lead_optimization"] = "broad"
    max_compounds: int = Field(default=50, ge=5, le=500)
    pathway_focus: List[str] = []
    filter_toxicity: bool = True
    model_config: ModelConfig = ModelConfig()


class DrugCandidate(BaseModel):
    rank: int
    compound_id: str
    compound_name: str
    smiles: str
    efficacy_score: float = Field(..., ge=0.0, le=1.0)
    selectivity_score: float = Field(..., ge=0.0, le=1.0)
    toxicity_flag: Optional[str] = None
    mechanism_of_action: str
    predicted_gene_changes: Dict[str, float]


class EnrichedPathway(BaseModel):
    pathway: str
    p_value: float
    enrichment_score: float
    gene_count: int
    genes: List[str]


class P3Response(BaseModel):
    experiment_id: str
    status: Literal["complete"] = "complete"
    compounds_screened: int
    top_candidates: List[DrugCandidate]
    enriched_pathways: List[EnrichedPathway]
    gene_expression_matrix: Dict[str, Dict[str, float]]  # gene → compound → fold_change
    model_used: str
    simulation_mode: bool = True
    runtime_ms: int
```

---

## SECTION 7 — LLM Interface & Ollama Integration

### 7.1 Ollama Client

```python
# llm/ollama_client.py
import httpx
import json
from typing import Optional, Dict, Any
from config import settings
from utils.logger import get_logger

logger = get_logger(__name__)


class OllamaClient:
    """
    Async client for the Ollama local LLM API.
    Handles generation, availability checks, and error recovery.
    """

    def __init__(self, base_url: Optional[str] = None, timeout: Optional[int] = None):
        self.base_url = base_url or settings.ollama_base_url
        self.timeout = timeout or settings.ollama_timeout

    async def generate(
        self,
        model: str,
        prompt: str,
        system_prompt: str,
        temperature: float = 0.3,
        max_tokens: int = 2048,
    ) -> str:
        """
        Call Ollama /api/generate endpoint.
        Returns the raw text response from the model.
        """
        payload = {
            "model": model,
            "prompt": prompt,
            "system": system_prompt,
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens,
                "top_p": 0.9,
                "stop": ["```", "---"]  # Stop tokens to prevent markdown leakage
            }
        }

        logger.debug("Calling Ollama", model=model, prompt_length=len(prompt))

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                f"{self.base_url}/api/generate",
                json=payload
            )
            response.raise_for_status()
            data = response.json()
            raw_text = data.get("response", "")
            logger.debug("Ollama responded", response_length=len(raw_text))
            return raw_text

    async def check_availability(self) -> bool:
        """Check if Ollama is running and reachable."""
        try:
            async with httpx.AsyncClient(timeout=5) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                return response.status_code == 200
        except Exception:
            return False

    async def list_models(self) -> list:
        """List models currently available in Ollama."""
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                data = response.json()
                return [m["name"] for m in data.get("models", [])]
        except Exception:
            return []
```

### 7.2 Response Parser

```python
# llm/response_parser.py
import json
import re
from typing import Optional, Dict, Any
from utils.logger import get_logger

logger = get_logger(__name__)


class ResponseParser:
    """
    Extracts and cleans JSON from raw LLM text output.
    LLMs often wrap JSON in markdown code blocks or add preamble text.
    This parser handles all common failure patterns.
    """

    @staticmethod
    def extract_json(raw_text: str) -> Optional[Dict[str, Any]]:
        """
        Attempt multiple strategies to extract valid JSON from LLM output.
        Returns parsed dict or None if all strategies fail.
        """
        # Strategy 1: Try direct parse (ideal case — model returned pure JSON)
        try:
            return json.loads(raw_text.strip())
        except json.JSONDecodeError:
            pass

        # Strategy 2: Extract from markdown code block ```json ... ```
        code_block_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", raw_text, re.DOTALL)
        if code_block_match:
            try:
                return json.loads(code_block_match.group(1))
            except json.JSONDecodeError:
                pass

        # Strategy 3: Find the first { and last } and extract
        first_brace = raw_text.find("{")
        last_brace = raw_text.rfind("}")
        if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
            candidate = raw_text[first_brace:last_brace + 1]
            try:
                return json.loads(candidate)
            except json.JSONDecodeError:
                pass

        # Strategy 4: Fix common JSON issues (trailing commas, single quotes)
        cleaned = ResponseParser._clean_json_string(raw_text)
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            pass

        logger.warning("All JSON extraction strategies failed", raw_preview=raw_text[:200])
        return None

    @staticmethod
    def _clean_json_string(text: str) -> str:
        """Fix common LLM JSON output issues."""
        # Remove trailing commas before } or ]
        text = re.sub(r",\s*([}\]])", r"\1", text)
        # Replace single quotes with double quotes (careful — only for keys/values)
        text = re.sub(r"'([^']*)'", r'"\1"', text)
        # Extract JSON portion
        first_brace = text.find("{")
        last_brace = text.rfind("}")
        if first_brace != -1 and last_brace != -1:
            return text[first_brace:last_brace + 1]
        return text
```

### 7.3 Model Registry

```python
# llm/model_registry.py
from typing import Dict, Any

SUPPORTED_MODELS: Dict[str, Dict[str, Any]] = {
    "phi3:mini": {
        "display_name": "Phi-3 Mini",
        "provider": "ollama",
        "ram_required_gb": 4,
        "recommended": True,
        "description": "Fast, efficient — recommended for demo"
    },
    "llama3.2:3b": {
        "display_name": "Llama 3.2 3B",
        "provider": "ollama",
        "ram_required_gb": 4,
        "recommended": False,
        "description": "Lightweight Llama 3.2 variant"
    },
    "mistral:7b": {
        "display_name": "Mistral 7B",
        "provider": "ollama",
        "ram_required_gb": 8,
        "recommended": False,
        "description": "Higher quality outputs, requires more RAM"
    }
}


def validate_model(model_name: str) -> str:
    """Return model name if supported, else return default."""
    from config import settings
    if model_name in SUPPORTED_MODELS:
        return model_name
    return settings.default_model
```

---

## SECTION 8 — Prompt Engine Design

### 8.1 Design Principles

Effective LLM prompting for structured output requires:

1. **System prompt** that establishes the AI persona and output format rules
2. **User prompt** that injects experiment-specific parameters
3. **JSON schema embedded directly** in the prompt
4. **Negative constraints** ("Do not include any text outside the JSON")
5. **Low temperature** (0.2–0.4) to reduce creative deviation from schema

### 8.2 Precious1GPT Prompt Builder

```python
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
```

### 8.3 Precious2GPT Prompt Builder

```python
# prompts/p2_prompts.py
from schemas.p2_schemas import P2Request


SYSTEM_PROMPT_P2 = """You are a bioinformatics AI specializing in synthetic multi-omics data generation.
You generate realistic statistical descriptions of synthetic biological datasets.
You MUST respond with ONLY a valid JSON object. No text outside the JSON."""


def build_p2_prompt(request: P2Request) -> str:
    modalities_str = ", ".join(request.data_modalities)
    condition_str = request.disease_state if request.disease_state else request.biological_condition

    return f"""Simulate quality metrics for a synthetic multi-omics dataset generation experiment.

Parameters:
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
```

### 8.4 Precious3GPT Prompt Builder

```python
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
```

---

## SECTION 9 — Data Simulation & Fallback Logic

### 9.1 P1 Simulation

```python
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
```

### 9.2 P2 Simulation

```python
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
```

### 9.3 P3 Simulation

```python
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
```

---

## SECTION 10 — Model Selection System

### 10.1 Controller Pattern (P1 as Reference)

All three controllers follow the same orchestration pattern:

```python
# controllers/p1_controller.py
import time
import uuid
from schemas.p1_schemas import P1Request, P1Response
from llm.ollama_client import OllamaClient
from llm.response_parser import ResponseParser
from llm.model_registry import validate_model
from prompts.p1_prompts import SYSTEM_PROMPT_P1, build_p1_prompt
from simulation.p1_simulation import P1Simulator
from config import settings
from utils.logger import get_logger

logger = get_logger(__name__)


class P1Controller:

    async def run(self, request: P1Request) -> P1Response:
        start_time = time.time()
        experiment_id = str(uuid.uuid4())

        # 1. Validate and resolve model
        model_name = validate_model(request.model_config.model_name)
        logger.info("Running P1 experiment", model=model_name, experiment_id=experiment_id)

        # 2. Build prompt
        user_prompt = build_p1_prompt(request)

        # 3. Call LLM
        raw_output = None
        llm_success = False

        try:
            client = OllamaClient()
            raw_output = await client.generate(
                model=model_name,
                prompt=user_prompt,
                system_prompt=SYSTEM_PROMPT_P1,
                temperature=request.model_config.temperature,
                max_tokens=request.model_config.max_tokens,
            )
            logger.debug("LLM raw output received", length=len(raw_output))
        except Exception as e:
            logger.warning("LLM call failed, using fallback", error=str(e))

        # 4. Parse JSON from LLM output
        parsed_data = None
        if raw_output:
            parsed_data = ResponseParser.extract_json(raw_output)

        # 5. Validate against schema or use fallback
        if parsed_data:
            try:
                result_data = self._build_response(
                    parsed_data, request, experiment_id, model_name, start_time
                )
                llm_success = True
                logger.info("LLM response validated successfully", experiment_id=experiment_id)
            except Exception as e:
                logger.warning("LLM response failed schema validation, using fallback",
                               error=str(e))
                parsed_data = None

        if not parsed_data or not llm_success:
            logger.info("Using simulation fallback", experiment_id=experiment_id)
            simulator = P1Simulator(seed=settings.simulation_seed)
            result_data = simulator.simulate(request.chronological_age, request.tissue_type)
            result_data["experiment_id"] = experiment_id

        return P1Response(**result_data)

    def _build_response(self, data: dict, request: P1Request,
                        experiment_id: str, model_name: str, start_time: float) -> dict:
        """Map LLM parsed output to P1Response schema."""
        runtime_ms = int((time.time() - start_time) * 1000)
        bio_age = float(data["predicted_biological_age"])
        chron_age = request.chronological_age
        acceleration = bio_age - chron_age

        age_class = "normal"
        if acceleration > 3.0:
            age_class = "accelerated"
        elif acceleration < -3.0:
            age_class = "decelerated"

        return {
            "experiment_id": experiment_id,
            "status": "complete",
            "predicted_biological_age": round(bio_age, 1),
            "chronological_age": chron_age,
            "age_acceleration_score": round(acceleration, 2),
            "age_acceleration_class": age_class,
            "shap_genes": data.get("shap_genes", []),
            "disease_classification": data.get("disease_classification", {}),
            "therapeutic_targets": data.get("therapeutic_targets", []),
            "model_used": model_name,
            "simulation_mode": True,
            "runtime_ms": runtime_ms
        }
```

### 10.2 Model Selection Routing Summary

The model selection flows as follows:

```
Request body: { "model_config": { "model_name": "mistral:7b" } }
        ↓
validate_model("mistral:7b")  →  "mistral:7b" (in registry) or settings.default_model
        ↓
OllamaClient.generate(model="mistral:7b", ...)
        ↓
Ollama routes to locally-running mistral:7b instance
```

No changes to prompts, parsers, or controllers are required when switching models — the model name is purely passed through to the Ollama API.

---

## SECTION 11 — Error Handling Strategy

### 11.1 Error Hierarchy

| Layer | Error Type | Handling Strategy |
|-------|-----------|------------------|
| API Layer | Request validation | FastAPI/Pydantic returns 422 with field errors |
| API Layer | Unexpected exception | 500 with sanitized message |
| Controller | LLM unavailable | Warn + use simulation fallback |
| Controller | LLM timeout | Warn + use simulation fallback |
| Controller | JSON parse failure | Warn + use simulation fallback |
| Controller | Schema validation failure | Warn + use simulation fallback |
| Simulation | NumPy/Pandas error | Log critical + return generic error response |

### 11.2 FastAPI Exception Handlers

```python
# In main.py — register global exception handlers

from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation Error",
            "detail": exc.errors(),
            "message": "Request parameters are invalid. Check field types and required values."
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception", path=request.url.path, error=str(exc))
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred. The experiment could not be completed."
        }
    )
```

### 11.3 LLM Retry Logic

```python
# In llm/ollama_client.py — add retry wrapper

async def generate_with_retry(self, model: str, prompt: str,
                               system_prompt: str, **kwargs) -> str:
    """Retry LLM generation up to max_retries times."""
    last_error = None
    for attempt in range(settings.ollama_max_retries + 1):
        try:
            return await self.generate(model, prompt, system_prompt, **kwargs)
        except httpx.TimeoutException as e:
            logger.warning(f"LLM timeout on attempt {attempt + 1}", model=model)
            last_error = e
        except httpx.HTTPStatusError as e:
            logger.warning(f"LLM HTTP error on attempt {attempt + 1}", status=e.response.status_code)
            last_error = e
            if e.response.status_code == 404:
                # Model not found — don't retry
                raise ValueError(f"Model '{model}' not found in Ollama. Run: ollama pull {model}")
    raise last_error
```

---

## SECTION 12 — Example API Payloads & Responses

### 12.1 Precious1GPT — Request

```bash
curl -X POST http://localhost:8000/api/p1/predict-age \
  -H "Content-Type: application/json" \
  -d '{
    "experiment_name": "Blood Sample Analysis - Patient 001",
    "tissue_type": "blood",
    "species": "human",
    "chronological_age": 62,
    "sex": "male",
    "model_config": {
      "model_name": "phi3:mini",
      "temperature": 0.3,
      "max_tokens": 2048
    }
  }'
```

### 12.2 Precious1GPT — Response

```json
{
  "experiment_id": "3f8c2a1d-9b4e-4f7a-a2c1-8d5e6f0a1b2c",
  "status": "complete",
  "predicted_biological_age": 67.4,
  "chronological_age": 62.0,
  "age_acceleration_score": 5.4,
  "age_acceleration_class": "accelerated",
  "shap_genes": [
    {
      "gene": "ELOVL2",
      "shap_value": 0.8421,
      "expression_level": 2.31,
      "direction": "up",
      "chromosome": "chr6",
      "known_aging_gene": true
    },
    {
      "gene": "FHL2",
      "shap_value": 0.7134,
      "expression_level": -1.24,
      "direction": "down",
      "chromosome": "chr2",
      "known_aging_gene": true
    },
    {
      "gene": "KLF14",
      "shap_value": 0.6892,
      "expression_level": 1.87,
      "direction": "up",
      "chromosome": "chr7",
      "known_aging_gene": true
    }
  ],
  "disease_classification": {
    "alzheimers": 0.2341,
    "parkinsons": 0.0812,
    "cardiovascular": 0.4127,
    "type2_diabetes": 0.1943,
    "cancer": 0.3102
  },
  "therapeutic_targets": [
    {
      "gene": "ELOVL2",
      "score": 0.9134,
      "known_drug_target": true,
      "actionability_score": 8.4,
      "mechanism": "Fatty acid elongation — regulates lipid metabolism and mTOR pathway"
    }
  ],
  "model_used": "phi3:mini",
  "simulation_mode": true,
  "runtime_ms": 3241
}
```

### 12.3 Precious2GPT — Request

```bash
curl -X POST http://localhost:8000/api/p2/generate-data \
  -H "Content-Type: application/json" \
  -d '{
    "experiment_name": "Liver Transcriptome 70s Cohort",
    "tissue_type": "liver",
    "species": ["human"],
    "age_range": {"min": 65, "max": 80},
    "biological_condition": "healthy",
    "data_modalities": ["rna_seq"],
    "number_of_samples": 500,
    "noise_level": "low",
    "model_config": {"model_name": "phi3:mini"}
  }'
```

### 12.4 Precious2GPT — Response

```json
{
  "experiment_id": "7a2d4f8c-1b3e-5g9a-c4d2-9e7f1a2b3c4d",
  "status": "complete",
  "generated_samples": 500,
  "features": 20531,
  "modalities": ["rna_seq"],
  "generation_time_seconds": 31.4,
  "quality_metrics": {
    "mean_expression_similarity": 0.9412,
    "variance_preservation": 0.9187,
    "correlation_structure": 0.8834,
    "pca_variance_explained": [0.342, 0.187, 0.094]
  },
  "preview_data": [
    {
      "sample_id": "SYN_0001",
      "age": 71,
      "condition": "healthy",
      "ACTB": 12.341,
      "GAPDH": 11.823,
      "TP53": 4.231
    }
  ],
  "download_files": [
    {
      "name": "synthetic_rnaseq_matrix.csv",
      "format": "csv",
      "size_bytes": 82124000,
      "download_url": "/api/p2/download/7a2d4f8c-1b3e-5g9a-c4d2-9e7f1a2b3c4d"
    }
  ],
  "model_used": "phi3:mini",
  "simulation_mode": true
}
```

### 12.5 Precious3GPT — Request

```bash
curl -X POST http://localhost:8000/api/p3/drug-screen \
  -H "Content-Type: application/json" \
  -d '{
    "experiment_name": "Neurodegeneration Drug Screen",
    "tissue_type": "brain",
    "disease_condition": "Alzheimers",
    "age_range": {"min": 60, "max": 85},
    "gene_targets": [
      {"gene": "APOE", "expression_level": 2.3, "direction": "up"},
      {"gene": "APP", "expression_level": 1.8, "direction": "up"},
      {"gene": "PSEN1", "expression_level": 1.2, "direction": "up"}
    ],
    "screening_mode": "targeted",
    "max_compounds": 10,
    "filter_toxicity": true,
    "model_config": {"model_name": "mistral:7b"}
  }'
```

### 12.6 Precious3GPT — Response

```json
{
  "experiment_id": "9c4e6a0b-2d5f-7h1c-e6g4-1a3b5c7d9e0f",
  "status": "complete",
  "compounds_screened": 47832,
  "top_candidates": [
    {
      "rank": 1,
      "compound_id": "CPD-1001",
      "compound_name": "Rapamycin Analog (RAD001)",
      "smiles": "CC1CCCC2CC(=O)C(=CC12)C",
      "efficacy_score": 0.9401,
      "selectivity_score": 0.8712,
      "toxicity_flag": null,
      "mechanism_of_action": "mTOR complex 1 inhibitor — reduces amyloid beta production via autophagy",
      "predicted_gene_changes": {
        "APOE": -1.84,
        "APP": -1.42,
        "PSEN1": -0.93,
        "MTOR": -2.11
      }
    },
    {
      "rank": 2,
      "compound_id": "CPD-1002",
      "compound_name": "NAD+ Precursor (NMN)",
      "smiles": "OC1C(O)C(CO)OC1N1C=CC(=O)NC1=O",
      "efficacy_score": 0.8934,
      "selectivity_score": 0.9213,
      "toxicity_flag": null,
      "mechanism_of_action": "SIRT1 activator — restores NAD+ metabolism and reduces neuroinflammation",
      "predicted_gene_changes": {
        "APOE": -1.21,
        "APP": -0.87,
        "SIRT1": 1.94,
        "NAMPT": 2.13
      }
    }
  ],
  "enriched_pathways": [
    {
      "pathway": "mTOR Signaling Pathway",
      "p_value": 0.00012,
      "enrichment_score": 3.84,
      "gene_count": 28,
      "genes": ["MTOR", "S6K1", "4EBP1", "PTEN", "AKT1"]
    },
    {
      "pathway": "Amyloid Processing",
      "p_value": 0.00031,
      "enrichment_score": 2.91,
      "gene_count": 14,
      "genes": ["APP", "PSEN1", "PSEN2", "BACE1", "ADAM10"]
    }
  ],
  "gene_expression_matrix": {
    "APOE": {
      "Rapamycin Analog (RAD001)": -1.84,
      "NAD+ Precursor (NMN)": -1.21
    },
    "APP": {
      "Rapamycin Analog (RAD001)": -1.42,
      "NAD+ Precursor (NMN)": -0.87
    }
  },
  "model_used": "mistral:7b",
  "simulation_mode": true,
  "runtime_ms": 18432
}
```

---

## SECTION 13 — Configuration & Environment

### 13.1 requirements.txt

```
fastapi==0.111.0
uvicorn[standard]==0.30.1
pydantic==2.7.4
pydantic-settings==2.3.4
httpx==0.27.0
pandas==2.2.2
numpy==1.26.4
python-dotenv==1.0.1
structlog==24.2.0
pytest==8.2.2
pytest-asyncio==0.23.7
```

### 13.2 .env.example

```bash
# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
DEFAULT_MODEL=phi3:mini
OLLAMA_TIMEOUT=120
OLLAMA_MAX_RETRIES=2

# API Configuration
ALLOWED_ORIGINS=["http://localhost:5173","http://localhost:3000"]
API_KEY_SECRET=change-this-in-production

# Simulation
FALLBACK_ENABLED=true
SIMULATION_SEED=42
```

### 13.3 Running the Backend

```bash
# 1. Clone and set up
git clone <repo>
cd preciousgpt-backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 2. Configure environment
cp .env.example .env
# Edit .env as needed

# 3. Start Ollama (separate terminal)
ollama serve

# 4. Pull models
ollama pull phi3:mini
ollama pull llama3.2:3b

# 5. Run backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 6. Verify
curl http://localhost:8000/api/health
curl http://localhost:8000/api/health/ollama

# 7. Interactive API docs
open http://localhost:8000/docs
```

---

## SECTION 14 — Implementation Roadmap

### Phase 1 — Project Scaffold (Day 1)

- Create folder structure
- Implement `main.py`, `config.py`, logger
- Implement health endpoints
- Verify Ollama connectivity via health check
- Write base `OllamaClient` with simple generate test

**Deliverable:** `GET /api/health/ollama` returns Ollama status

---

### Phase 2 — Schemas & Simulation Fallbacks (Day 2)

- Implement all Pydantic schemas (`common.py`, `p1_schemas.py`, `p2_schemas.py`, `p3_schemas.py`)
- Implement all three simulation engines (`p1_simulation.py`, `p2_simulation.py`, `p3_simulation.py`)
- Implement `biology_constants.py` (gene lists, pathways, drug candidates)
- Unit test all simulators — verify output matches schema

**Deliverable:** All three endpoints return valid simulated data without LLM

---

### Phase 3 — LLM Integration (Day 3)

- Implement `ResponseParser` with all extraction strategies
- Implement `model_registry.py`
- Implement all three prompt builders
- Implement all three controllers with LLM → parse → validate → fallback flow
- Test with `phi3:mini`: verify JSON extraction works end-to-end

**Deliverable:** Endpoints call LLM, parse output, fall back to simulation if needed

---

### Phase 4 — All Three Endpoints (Day 4)

- Wire all three routers into `main.py`
- Implement P2 CSV download endpoint
- Add CORS configuration for frontend origin
- Integration test all three endpoints with all three model options
- Test fallback behavior (kill Ollama mid-request)

**Deliverable:** All three endpoints working end-to-end, tested with real frontend calls

---

### Phase 5 — Error Handling & Polish (Day 5)

- Add global exception handlers
- Add retry logic to Ollama client
- Add structured logging throughout
- Write pytest suite (unit tests for simulators, integration tests for endpoints)
- Document all endpoints in OpenAPI (auto-generated via FastAPI)

**Deliverable:** Production-quality demo backend ready for investor presentation

---

## Appendix A — Biology Constants

```python
# utils/biology_constants.py

AGING_GENES = [
    "ELOVL2", "FHL2", "KLF14", "PENK", "TRIM59", "CSNK1D", "CSNK1E",
    "SCGN", "SLC12A5", "C1orf132", "ITGA2B", "CSNK1D", "NHLRC1", "GRIA2",
    "PRKG2", "RPA1", "TFAP2C", "HLCS", "PRSS22", "CABLES1", "RHOJ",
    "SIRT1", "SIRT3", "SIRT6", "FOXO3", "KLOTHO", "IGF1", "MTOR", "AMPK"
]

COMMON_GENES = [
    "ACTB", "GAPDH", "TP53", "MYC", "EGFR", "BRCA1", "BRCA2", "KRAS",
    "PTEN", "AKT1", "PIK3CA", "RB1", "CDK4", "CCND1", "BCL2", "BAX",
    "CASP3", "CASP9", "VEGFA", "HIF1A", "TGFB1", "TNF", "IL6", "IL1B"
]

CHROMOSOMES = [
    "chr1", "chr2", "chr3", "chr4", "chr5", "chr6", "chr7", "chr8",
    "chr9", "chr10", "chr11", "chr12", "chr13", "chr14", "chr15",
    "chr16", "chr17", "chr18", "chr19", "chr20", "chr21", "chr22", "chrX"
]

DRUG_CANDIDATES = [
    {
        "name": "Rapamycin (Sirolimus)",
        "smiles": "CC1CCCC2CC(=O)C(=CC12)C",
        "mechanism": "mTORC1 inhibitor — reduces cellular senescence via autophagy activation"
    },
    {
        "name": "Metformin",
        "smiles": "CN(C)C(=N)N=C(N)N",
        "mechanism": "AMPK activator — improves insulin sensitivity and reduces mTOR activity"
    },
    {
        "name": "Resveratrol",
        "smiles": "Oc1ccc(cc1)/C=C/c1cc(O)cc(O)c1",
        "mechanism": "SIRT1 activator — modulates NAD+ metabolism and oxidative stress response"
    },
    {
        "name": "NMN (Nicotinamide Mononucleotide)",
        "smiles": "OC1C(O)C(CO)OC1N1C=CC(=O)NC1=O",
        "mechanism": "NAD+ precursor — restores mitochondrial function and DNA repair capacity"
    },
    {
        "name": "Senolytics ABT-263",
        "smiles": "CC1(C)CCC(=C1)CN2CCN(CC2)c3ccc(cc3)C(=O)Nc4ccc(cc4)N",
        "mechanism": "BCL-2/BCL-XL inhibitor — selectively clears senescent cells"
    }
]

PATHWAYS = [
    {"name": "mTOR Signaling Pathway", "key_genes": ["MTOR", "S6K1", "4EBP1", "PTEN", "AKT1"]},
    {"name": "PI3K-AKT Pathway", "key_genes": ["PIK3CA", "AKT1", "PTEN", "GSK3B", "FOXO3"]},
    {"name": "p53 Tumor Suppressor Pathway", "key_genes": ["TP53", "MDM2", "CDKN1A", "BAX", "BCL2"]},
    {"name": "SIRT1-NAD+ Longevity Pathway", "key_genes": ["SIRT1", "SIRT3", "NAMPT", "PARP1", "FOXO3"]},
    {"name": "NF-κB Inflammatory Pathway", "key_genes": ["NFKB1", "RELA", "TNF", "IL6", "IL1B"]},
    {"name": "Wnt/β-catenin Pathway", "key_genes": ["CTNNB1", "APC", "GSK3B", "WNT3A", "FZD1"]},
]
```

---

*End of PreciousGPT Backend Architecture Document v1.0.0*

*This document provides complete implementation guidance for the simulation backend. Engineers should implement sections in order following the Phase roadmap. All code samples are production-ready starting points — adapt to project conventions as needed. The architecture is explicitly designed to be replaced by real ML pipelines without frontend changes.*
