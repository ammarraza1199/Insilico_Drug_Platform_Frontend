# Large Language of Life Models (LLLMS) — Technical Architecture Document

**Document Version:** 1.0  
**Date:** March 2026  
**Project:** Large Language of Life Models (LLLMS) In-Silico Drug Discovery & Omics Platform  
**Author:** ZeroKost Engineering — Systems Architecture  
**Status:** Approved

---

## 1. System Overview

Large Language of Life Models (LLLMS) is a full-stack, AI-powered computational biology platform built on a **decoupled microservice-style architecture**. It comprises:

- A **React + TypeScript SPA** (frontend) — bundled with Vite for development.
- A **FastAPI (Python) asynchronous REST API** (backend) — handles all business logic and LLM orchestration.
- A **MongoDB** NoSQL database — stores users, projects, and experiment records.
- An **Ollama** local inference server — runs open-source LLMs (Phi-3, Llama 3, etc.) locally.

The three core AI modules (LifespanAI, Clinomics Engine, Multispecies & Tissue Engine) are independently routed but share the same LLM client infrastructure, prompt engine, simulation fallback layer, and experiment logging service.

---

## 2. High-Level Architecture Diagram

```mermaid
graph TD
    subgraph CLIENT ["🌐 Client Tier — Browser"]
        UI["React SPA (TypeScript + Vite)"]
        ZUSTAND["State: Zustand Store"]
        RQ["Server State: React Query"]
        AXIOS["HTTP: Axios API Client"]
    end

    subgraph BACKEND ["⚙️ Application Tier — FastAPI Backend"]
        GATEWAY["API Gateway (FastAPI + CORS)"]
        AUTH_R["Auth Router /api/auth"]
        PROJ_R["Project Router /api/projects"]
        EXP_R["Experiment Router /api/experiments"]
        P1_R["P1 Router /api/p1"]
        P2_R["P2 Router /api/p2"]
        P3_R["P3 Router /api/p3"]
        HEALTH["Health Router /api/health"]

        P1_C["P1Controller"]
        P2_C["P2Controller"]
        P3_C["P3Controller"]

        PROMPT["Prompt Engine (build_p1/2/3_prompt)"]
        LLM_CLIENT["Ollama Client (generate_with_retry)"]
        PARSER["ResponseParser (extract_json)"]
        FALLBACK1["P1Simulator (Statistical Fallback)"]
        FALLBACK2["P2Simulator (Statistical Fallback)"]
        FALLBACK3["P3Simulator (Statistical Fallback)"]
        EXP_SVC["Experiment Service (log_experiment)"]
    end

    subgraph DATA ["🗄️ Data Tier"]
        MONGO[("MongoDB")]
        USERS_COL["users collection"]
        PROJ_COL["projects collection"]
        EXP_COL["experiments collection"]
    end

    subgraph INFERENCE ["🤖 Inference Tier"]
        OLLAMA["Ollama Server (localhost:11434)"]
        PHI3["phi3 (3.8B)"]
        LLAMA3["llama3 (8B)"]
        GEMMA2["gemma2 (9B)"]
        MISTRAL["mistral (7B)"]
    end

    UI --> ZUSTAND
    UI --> RQ
    RQ --> AXIOS
    AXIOS -->|"HTTP REST"| GATEWAY

    GATEWAY --> AUTH_R
    GATEWAY --> PROJ_R
    GATEWAY --> EXP_R
    GATEWAY --> P1_R
    GATEWAY --> P2_R
    GATEWAY --> P3_R
    GATEWAY --> HEALTH

    P1_R --> P1_C
    P2_R --> P2_C
    P3_R --> P3_C

    P1_C --> PROMPT
    P2_C --> PROMPT
    P3_C --> PROMPT

    PROMPT --> LLM_CLIENT
    LLM_CLIENT -->|"Ollama API"| OLLAMA
    OLLAMA --- PHI3
    OLLAMA --- LLAMA3
    OLLAMA --- GEMMA2
    OLLAMA --- MISTRAL

    LLM_CLIENT --> PARSER
    PARSER -->|"Parse Success"| P1_C
    PARSER -->|"Parse Failure"| FALLBACK1
    PARSER -->|"Parse Failure"| FALLBACK2
    PARSER -->|"Parse Failure"| FALLBACK3

    P1_C --> EXP_SVC
    P2_C --> EXP_SVC
    P3_C --> EXP_SVC

    EXP_SVC --> MONGO
    AUTH_R --> MONGO
    PROJ_R --> MONGO
    EXP_R --> MONGO

    MONGO --- USERS_COL
    MONGO --- PROJ_COL
    MONGO --- EXP_COL
```

---

## 3. Layer Architecture Diagram

```mermaid
graph BT
    subgraph FE ["Frontend — Presentation Layer"]
        direction TB
        L1_PAGES["Pages (LandingPage, P1Page, P2Page, P3Page)"]
        L1_MODULES["Modules (P1/P2/P3 InputForms, ExperimentPanels, ResultsPanels)"]
        L1_CHARTS["Charts (Recharts / Plotly components)"]
        L1_COMP["Shared Components (ModelSelectorWidget, Nav, Layout)"]
        L1_HOOKS["Hooks (useExperiment, useProject)"]
        L1_STORE["State (Zustand stores)"]
        L1_API["API Services (Axios clients)"]
    end

    subgraph BE_LAYER ["Backend — Application Layer"]
        direction TB
        L2_ROUTER["API Routers (FastAPI — per module)"]
        L2_CTRL["Controllers (Orchestration Logic)"]
        L2_PROMPT["Prompt Engine (templates per module)"]
        L2_LLM["LLM Client (Ollama HTTP API)"]
        L2_PARSER["Response Parser (JSON extraction)"]
        L2_SIM["Simulation Fallback (NumPy-based)"]
        L2_SVC["Services (experiment_service, auth_service)"]
        L2_SCHEMA["Schemas (Pydantic — request/response)"]
    end

    subgraph INFRA ["Infrastructure Layer"]
        direction TB
        L3_DB["MongoDB (Motor async driver)"]
        L3_OLLAMA["Ollama (Local LLM Runtime)"]
        L3_CONFIG["Config (Pydantic Settings from .env)"]
        L3_LOGGER["Logger (structlog JSON logger)"]
    end

    L1_API -->|"Axios HTTP"| L2_ROUTER
    L2_ROUTER --> L2_CTRL
    L2_CTRL --> L2_PROMPT
    L2_CTRL --> L2_SCHEMA
    L2_PROMPT --> L2_LLM
    L2_LLM --> L2_PARSER
    L2_PARSER -->|"Fail"| L2_SIM
    L2_CTRL --> L2_SVC
    L2_SVC --> L3_DB
    L2_LLM --> L3_OLLAMA
    L2_SVC --> L3_LOGGER
    L2_CTRL --> L3_CONFIG
```

---

## 4. Request Sequence Diagram

### 4.1 LifespanAI — Full Experiment Flow

```mermaid
sequenceDiagram
    actor U as User
    participant FE as React Frontend
    participant GW as FastAPI Gateway
    participant R1 as P1 Router
    participant C1 as P1 Controller
    participant PE as Prompt Engine
    participant OL as Ollama LLM
    participant RP as Response Parser
    participant SIM as P1 Simulator
    participant DB as MongoDB

    U->>FE: Fill P1 Form & Submit
    FE->>FE: React-Hook-Form Zod validate
    FE->>GW: POST /api/p1/predict-age (Bearer JWT)
    GW->>GW: CORS check + request logging
    GW->>R1: Route to P1Router
    R1->>R1: Pydantic schema validation (P1Request)
    R1->>C1: P1Controller.run(request)
    C1->>C1: validate_model (model registry)
    C1->>PE: build_p1_prompt(request)
    PE-->>C1: user_prompt string
    C1->>OL: generate_with_retry(model, prompt, system, temp, max_tokens)

    alt LLM Success
        OL-->>C1: Raw text output (JSON inside)
        C1->>RP: ResponseParser.extract_json(raw_output)
        RP-->>C1: Parsed dict
        C1->>C1: _build_response() → Pydantic validate
        C1->>DB: await log_experiment(experiment_id, ...)
        C1-->>R1: P1Response (llm_mode=True)
    else LLM Timeout or Parse Failure
        C1->>SIM: P1Simulator.simulate(age, tissue)
        SIM-->>C1: Simulated result dict
        C1->>DB: await log_experiment(experiment_id, ...)
        C1-->>R1: P1Response (simulation_mode=True)
    end

    R1-->>GW: JSON 200 Response
    GW-->>FE: P1Response JSON
    FE->>FE: React Query cache update
    FE->>U: Render Charts & Results Panel
```

---

## 5. Database Schema Design

### 5.1 Collections Overview

```mermaid
erDiagram
    USERS {
        ObjectId _id PK
        string email UK
        string hashed_password
        string username
        datetime created_at
        bool is_active
    }

    PROJECTS {
        ObjectId _id PK
        string user_id FK
        string name
        string description
        datetime created_at
        datetime updated_at
    }

    EXPERIMENTS {
        ObjectId _id PK
        string experiment_id UK
        string user_id FK
        string project_id FK
        string exp_type
        object request_payload
        object result_data
        datetime created_at
        int runtime_ms
        bool simulation_mode
        string model_used
    }

    USERS ||--o{ PROJECTS : "has"
    USERS ||--o{ EXPERIMENTS : "owns"
    PROJECTS ||--o{ EXPERIMENTS : "contains"
```

### 5.2 Experiment Document Example (P1)

```json
{
  "_id": "ObjectId(...)",
  "experiment_id": "e4a2b1c3-...-uuid4",
  "user_id": "user_abc123",
  "project_id": "proj-1",
  "exp_type": "p1",
  "request_payload": {
    "experiment_name": "Brain Aging Study 01",
    "chronological_age": 55.0,
    "tissue_type": "Brain",
    "methylation_level": 0.72,
    "llm_config": { "model_name": "phi3", "temperature": 0.3 }
  },
  "result_data": {
    "predicted_biological_age": 62.4,
    "age_acceleration_score": 7.4,
    "age_acceleration_class": "accelerated",
    "shap_genes": [{"gene": "FOXO3", "importance": 0.87, "direction": "down"}],
    "simulation_mode": false,
    "runtime_ms": 18420
  },
  "created_at": "2026-03-24T10:30:00Z"
}
```

---

## 6. API Endpoint Map

### 6.1 Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, receive JWT |
| GET | `/api/auth/me` | JWT | Get current user info |

### 6.2 Projects

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/projects` | JWT | Create project |
| GET | `/api/projects` | JWT | List all user projects |
| GET | `/api/projects/{id}` | JWT | Get single project |
| DELETE | `/api/projects/{id}` | JWT | Delete project |

### 6.3 Experiments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/experiments` | JWT | List all user experiments |
| GET | `/api/experiments/{id}` | JWT | Get experiment by ID |

### 6.4 LifespanAI (Biological Aging)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/p1/predict-age` | JWT | Run biological age prediction |
| GET | `/api/p1/experiments` | JWT | List P1 experiment history |
| GET | `/api/p1/experiments/{id}` | JWT | Get P1 experiment result |

### 6.5 Clinomics Engine (Synthetic Omics)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/p2/generate-omics` | JWT | Generate synthetic omics dataset |
| GET | `/api/p2/experiments` | JWT | List P2 experiment history |
| GET | `/api/p2/experiments/{id}` | JWT | Get P2 experiment result |
| GET | `/api/p2/download/{id}` | JWT | Download full matrix as CSV/TSV |

### 6.6 Multispecies & Tissue Engine (Drug Discovery)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/p3/run-screen` | JWT | Run in-silico drug screen |
| GET | `/api/p3/experiments` | JWT | List P3 experiment history |
| GET | `/api/p3/experiments/{id}` | JWT | Get P3 experiment result |

### 6.7 System

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | Health check + Ollama status |

---

## 7. Frontend Architecture

### 7.1 Application Component Tree

```mermaid
graph TD
    APP["App.tsx (Router Root)"]
    LAYOUT["MainLayout (Sidebar + TopBar)"]
    LAND["LandingPage"]
    P1PAGE["P1Page (LifespanAI)"]
    P2PAGE["P2Page (Clinomics Engine)"]
    P3PAGE["P3Page (Multispecies & Tissue Engine)"]
    DASH["DashboardPage"]
    PROJ["ProjectsPage"]
    HIST["ExperimentHistoryPage"]

    P1EXP["P1ExperimentPanel (split-pane container)"]
    P1IN["P1InputForm (react-hook-form + zod)"]
    P1RES["P1ResultsPanel (charts + export)"]

    P2EXP["P2ExperimentPanel"]
    P2IN["P2InputForm"]
    P2RES["P2ResultsPanel"]

    P3EXP["P3ExperimentPanel"]
    P3IN["P3InputForm"]
    P3RES["P3ResultsPanel"]

    MSELECTOR["ModelSelectorWidget (shared)"]

    APP --> LAYOUT
    LAYOUT --> LAND
    LAYOUT --> P1PAGE
    LAYOUT --> P2PAGE
    LAYOUT --> P3PAGE
    LAYOUT --> DASH
    LAYOUT --> PROJ
    LAYOUT --> HIST

    P1PAGE --> P1EXP
    P1EXP --> P1IN
    P1EXP --> P1RES
    P1IN --> MSELECTOR

    P2PAGE --> P2EXP
    P2EXP --> P2IN
    P2EXP --> P2RES
    P2IN --> MSELECTOR

    P3PAGE --> P3EXP
    P3EXP --> P3IN
    P3EXP --> P3RES
    P3IN --> MSELECTOR
```

### 7.2 State Management Architecture

| Store | Technology | Responsibility |
|-------|-----------|---------------|
| `authStore` | Zustand | JWT token, current user, login/logout |
| `projectStore` | Zustand | Active project selection |
| `experimentStore` | Zustand | Current experiment status (running / idle) |
| Server Data Cache | React Query | All API responses — P1/P2/P3 results, project list, history |

### 7.3 API Client Structure (`src/api/`)

| File | Description |
|------|-------------|
| `client.ts` | Axios instance with base URL, JWT interceptor, error handling |
| `p1Api.ts` | `runP1Experiment()`, `getP1Experiment()`, `listP1Experiments()` |
| `p2Api.ts` | `runP2Experiment()`, `downloadOmicsDataset()` |
| `p3Api.ts` | `runP3Experiment()`, `getP3Experiment()` |
| `authApi.ts` | `login()`, `register()`, `getMe()` |
| `projectApi.ts` | `createProject()`, `listProjects()`, `deleteProject()` |

---

## 8. Backend Internal Architecture

### 8.1 Backend Module Map

```
PreciousGPT_Backend_Code/
├── main.py                    # FastAPI app, router registration, middleware, lifespan
├── config.py                  # Pydantic Settings (env vars: MONGO_URI, OLLAMA_URL, etc.)
├── database.py                # Motor async MongoDB connection (connect/close)
│
├── api/                       # FastAPI Routers (HTTP layer only)
│   ├── auth_router.py
│   ├── project_router.py
│   ├── experiment_router.py
│   ├── p1_router.py
│   ├── p2_router.py
│   ├── p3_router.py
│   └── health_router.py
│
├── controllers/               # Business logic orchestration
│   ├── p1_controller.py       # P1: validate → prompt → LLM → parse → fallback → log
│   ├── p2_controller.py       # P2: validate → prompt → LLM → parse → fallback → log
│   └── p3_controller.py       # P3: validate → prompt → LLM → parse → fallback → log
│
├── prompts/                   # Prompt templates (SYSTEM + USER per module)
│   ├── p1_prompts.py
│   ├── p2_prompts.py
│   └── p3_prompts.py
│
├── llm/                       # LLM abstraction layer
│   ├── client_factory.py      # Returns OllamaClient instance
│   ├── ollama_client.py       # HTTP calls to Ollama API with retry
│   ├── response_parser.py     # JSON extraction from raw LLM text
│   └── model_registry.py     # Whitelisted model validation
│
├── simulation/                # Deterministic statistical fallback engines
│   ├── p1_simulation.py
│   ├── p2_simulation.py
│   └── p3_simulation.py
│
├── schemas/                   # Pydantic request/response models
│   ├── p1_schemas.py
│   ├── p2_schemas.py
│   ├── p3_schemas.py
│   └── common_schemas.py
│
├── services/                  # Database interaction services
│   ├── experiment_service.py  # log_experiment(), get_experiment(), list_experiments()
│   ├── auth_service.py        # register_user(), authenticate_user(), create_token()
│   └── project_service.py     # CRUD for projects
│
└── utils/
    └── logger.py              # structlog JSON structured logger
```

### 8.2 Configuration & Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGODB_URI` | Yes | — | MongoDB connection string |
| `OLLAMA_BASE_URL` | Yes | `http://localhost:11434` | Ollama server URL |
| `DEFAULT_MODEL` | No | `phi3` | Default LLM model |
| `JWT_SECRET_KEY` | Yes | — | Secret for JWT signing |
| `JWT_ALGORITHM` | No | `HS256` | JWT algorithm |
| `SIMULATION_SEED` | No | `42` | NumPy RNG seed for fallback |
| `ALLOWED_ORIGINS` | No | `*` | CORS origins |
| `LOG_LEVEL` | No | `INFO` | Logging verbosity |

---

## 9. Deployment Architecture

### 9.1 Local Development Topology

```mermaid
graph LR
    DEV["Developer Machine"]
    subgraph DEV["Developer Machine"]
        VITE["Vite Dev Server :5173"]
        UVICORN["Uvicorn / FastAPI :8000"]
        OLLAMA_SRV["Ollama Server :11434"]
        MONGOD["MongoDB :27017"]
    end

    BROWSER["Browser"] -->|"HTTP :5173"| VITE
    VITE -->|"Proxy /api → :8000"| UVICORN
    UVICORN -->|"HTTP :11434"| OLLAMA_SRV
    UVICORN -->|"Motor TCP :27017"| MONGOD
```

### 9.2 Production-Ready (Future) Topology

```mermaid
graph TD
    USERS["End Users"]
    CDN["CDN / Static Host (Vercel / Netlify)"]
    LB["Load Balancer / Reverse Proxy (Nginx)"]
    API1["FastAPI Instance 1"]
    API2["FastAPI Instance 2"]
    MQ["Task Queue (Celery + Redis) — LLM jobs"]
    WORKER1["LLM Worker 1 (Ollama GPU)"]
    WORKER2["LLM Worker 2 (Ollama GPU)"]
    MONGO_CLUSTER["MongoDB Atlas Cluster"]

    USERS --> CDN
    CDN --> LB
    LB --> API1
    LB --> API2
    API1 --> MQ
    API2 --> MQ
    MQ --> WORKER1
    MQ --> WORKER2
    API1 --> MONGO_CLUSTER
    API2 --> MONGO_CLUSTER
```

---

## 10. Security Architecture

| Layer | Control | Implementation |
|-------|---------|---------------|
| Transport | HTTPS | TLS termination at reverse proxy |
| Authentication | JWT Bearer | `HS256` signed tokens, 24h expiry |
| Authorization | User isolation | `user_id` filter on all DB queries |
| Password Storage | bcrypt | `passlib[bcrypt]` with auto-salting |
| Input Validation | Pydantic | Strict schema validation on all request bodies |
| CORS | Configurable | `ALLOWED_ORIGINS` env var |
| LLM Injection | Prompt sanitization | User inputs quoted/escaped in prompt templates |
| Error Leakage | Generic 500 responses | Detailed errors only in server logs |
| API Secrets | Environment variables | Never committed to source code |

---

## 11. Performance Characteristics

| Metric | Target | Notes |
|--------|--------|-------|
| LLM inference (phi3, 3.8B) | 15–40 seconds | Depends on hardware |
| LLM inference (llama3, 8B) | 30–90 seconds | Higher quality, slower |
| Statistical fallback | < 500ms | Pure Python NumPy |
| MongoDB query latency | < 50ms | Indexed on user_id, project_id |
| Frontend initial load | < 2s | Vite code splitting + lazy routes |
| API validation error | < 10ms | Pydantic synchronous validation |

---

## 12. Technology Stack Summary

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Frontend Framework | React | 18.x | Component-based UI |
| Language (FE) | TypeScript | 5.x | Type safety |
| Build Tool | Vite | 5.x | Fast HMR dev server |
| Styling | TailwindCSS | 3.x | Utility-first CSS |
| Animation | Framer Motion | 11.x | Scientific UI transitions |
| State | Zustand | 4.x | Global client state |
| Server State | React Query (TanStack) | 5.x | API caching & sync |
| Forms | React Hook Form + Zod | 7.x / 3.x | Validated form handling |
| Charts | Recharts + Plotly.js | latest | Scientific visualization |
| HTTP Client | Axios | 1.x | JWT-intercepted API calls |
| Backend Framework | FastAPI | 0.110+ | Async REST API |
| Language (BE) | Python | 3.10+ | Type-hinted backend logic |
| DB Driver | Motor (async PyMongo) | 3.x | Non-blocking MongoDB |
| Database | MongoDB | 7.x | Document store |
| LLM Runtime | Ollama | latest | Local open-source LLM |
| Data Validation (BE) | Pydantic v2 | 2.x | Schema enforcement |
| Logging | structlog | latest | Structured JSON logs |
| Password Hashing | passlib[bcrypt] | latest | Secure auth |
| Auth Tokens | python-jose | latest | JWT creation/validation |

---

*End of Technical Architecture Document — Large Language of Life Models (LLLMS) v1.0*
