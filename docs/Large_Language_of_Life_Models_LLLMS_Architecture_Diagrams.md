# Large Language of Life Models (LLLMS) — Complete Architecture Diagrams Reference

**Document Version:** 1.0  
**Date:** March 2026  
**Project:** Large Language of Life Models (LLLMS) In-Silico Drug Discovery & Omics Platform  
**Author:** ZeroKost Engineering  
**Status:** Final

> This document contains all **12 derived and advanced architecture diagrams** for the Large Language of Life Models (LLLMS) platform, organized into two categories:
> - **Category 2 — Implicit / Hidden Diagrams** (Diagrams 7–12): Derived from the codebase structure and data flows.
> - **Category 3 — Advanced / Marketing Diagrams** (Diagrams 13–18): High-value platform positioning and reliability views.

---

## CATEGORY 2 — IMPLICIT / HIDDEN DIAGRAMS

---

## Diagram 7: AI Pipeline Diagram
### LLM + Parser + Fallback Flow

This diagram shows the complete AI inference pipeline inside every controller (`P1Controller`, `P2Controller`, `P3Controller`). It maps directly to the code in `controllers/p{1,2,3}_controller.py` and `llm/`.

```mermaid
flowchart TD
    A([User Request\nP1Request / P2Request / P3Request]) --> B

    B[Model Validation\nmodel_registry.validate_model]
    B --> C

    C[Prompt Construction\nbuild_p1/p2/p3_prompt]

    subgraph PE ["Prompt Engine — prompts/p{n}_prompts.py"]
        C --> C1[SYSTEM_PROMPT\nScientific role + JSON rules]
        C --> C2[USER_PROMPT\nBiomarker values + schema hint]
    end

    C1 --> D
    C2 --> D

    D[LLM Client\nollama_client.generate_with_retry]

    subgraph OLLAMA_LAYER ["Ollama Inference — localhost:11434"]
        D --> E1{Retry 1}
        E1 -->|Fail| E2{Retry 2}
        E2 -->|Fail| TIMEOUT([LLM Timeout / Unreachable])
        E1 -->|Success| RAW[Raw Text Response]
        E2 -->|Success| RAW
    end

    RAW --> F[ResponseParser.extract_json\nBalanced-brace extraction\nMarkdown strip\nRegex fallback]

    F --> G{Parse\nSuccess?}

    G -->|YES| H[Pydantic Schema Validation\nP1Response / P2Response / P3Response]
    H --> I{Schema\nValid?}

    I -->|YES ✅| J[Build Final Response\n_build_response]
    I -->|NO ❌| FALLBACK

    G -->|NO ❌| FALLBACK
    TIMEOUT --> FALLBACK

    subgraph FALLBACK_LAYER ["Statistical Fallback — simulation/p{n}_simulation.py"]
        FALLBACK([Activate Fallback Simulator\nP1Simulator / P2Simulator / P3Simulator])
        FALLBACK --> F1[NumPy RNG\nseed=settings.simulation_seed]
        F1 --> F2[Tissue-conditioned\nDistribution Sampling]
        F2 --> F3[Simulated Result Dict\nsimulation_mode=True]
    end

    J --> K
    F3 --> K

    K[log_experiment\nexperiment_service.py → MongoDB]
    K --> L([Return Response to Router\nHTTP 200 JSON])

    style FALLBACK_LAYER fill:#1a1a2e,color:#e0e0e0,stroke:#ff6b6b
    style OLLAMA_LAYER fill:#0f3460,color:#e0e0e0,stroke:#4fc3f7
    style PE fill:#162032,color:#e0e0e0,stroke:#a29bfe
```

---

## Diagram 8: Module Architecture Diagram
### Large Language of Life Models (LLLMS) as a Three-Module System

Each module is fully independent — its own router, controller, prompt, schema, simulator, and frontend panel — yet shares common infrastructure.

```mermaid
graph TD
    subgraph PLATFORM ["🧬 Large Language of Life Models (LLLMS) Platform"]

        subgraph SHARED ["⚙️ Shared Infrastructure"]
            LLM_CLI[LLM Client\nollama_client.py]
            PARSER[Response Parser\nresponse_parser.py]
            MODEL_REG[Model Registry\nmodel_registry.py]
            EXP_SVC[Experiment Service\nexperiment_service.py]
            DB[(MongoDB)]
            AUTH_MOD[Auth Module\nauth_router + auth_service]
            PROJ_MOD[Project Module\nproject_router + project_service]
        end

        subgraph P1 ["🕰️ LifespanAI — Biological Aging Clock"]
            P1_ROUTER[p1_router.py\nPOST /api/p1/predict-age]
            P1_CTRL[p1_controller.py]
            P1_PROMPT[p1_prompts.py\nSYSTEM_PROMPT_P1\nbuild_p1_prompt]
            P1_SCHEMA[p1_schemas.py\nP1Request / P1Response]
            P1_SIM[p1_simulation.py\nP1Simulator]
            P1_FE["P1InputForm.tsx\nP1ExperimentPanel.tsx\nP1ResultsPanel.tsx"]
        end

        subgraph P2 ["🔬 Clinomics Engine — Synthetic Omics Generator"]
            P2_ROUTER[p2_router.py\nPOST /api/p2/generate-omics]
            P2_CTRL[p2_controller.py]
            P2_PROMPT[p2_prompts.py\nSYSTEM_PROMPT_P2\nbuild_p2_prompt]
            P2_SCHEMA[p2_schemas.py\nP2Request / P2Response]
            P2_SIM[p2_simulation.py\nP2Simulator]
            P2_FE["P2InputForm.tsx\nP2ExperimentPanel.tsx\nP2ResultsPanel.tsx"]
        end

        subgraph P3 ["💊 Multispecies & Tissue Engine — Digital Drug Discovery"]
            P3_ROUTER[p3_router.py\nPOST /api/p3/run-screen]
            P3_CTRL[p3_controller.py]
            P3_PROMPT[p3_prompts.py\nSYSTEM_PROMPT_P3\nbuild_p3_prompt]
            P3_SCHEMA[p3_schemas.py\nP3Request / P3Response]
            P3_SIM[p3_simulation.py\nP3Simulator]
            P3_FE["P3InputForm.tsx\nP3ExperimentPanel.tsx\nP3ResultsPanel.tsx"]
        end

    end

    P1_ROUTER --> P1_CTRL --> P1_PROMPT --> LLM_CLI
    P1_CTRL --> P1_SCHEMA
    P1_CTRL --> P1_SIM
    P1_CTRL --> EXP_SVC

    P2_ROUTER --> P2_CTRL --> P2_PROMPT --> LLM_CLI
    P2_CTRL --> P2_SCHEMA
    P2_CTRL --> P2_SIM
    P2_CTRL --> EXP_SVC

    P3_ROUTER --> P3_CTRL --> P3_PROMPT --> LLM_CLI
    P3_CTRL --> P3_SCHEMA
    P3_CTRL --> P3_SIM
    P3_CTRL --> EXP_SVC

    LLM_CLI --> PARSER
    LLM_CLI --> MODEL_REG
    EXP_SVC --> DB
    AUTH_MOD --> DB
    PROJ_MOD --> DB

    P1_FE -.->|"HTTP POST"| P1_ROUTER
    P2_FE -.->|"HTTP POST"| P2_ROUTER
    P3_FE -.->|"HTTP POST"| P3_ROUTER

    style P1 fill:#0d2137,stroke:#74b9ff
    style P2 fill:#0d2137,stroke:#00cec9
    style P3 fill:#0d2137,stroke:#a29bfe
    style SHARED fill:#1e1e2f,stroke:#636e72
```

---

## Diagram 9: LLM Interaction Diagram
### Prompt → Model → Output → Parser

A focused view of the single-turn LLM conversation structure used in every Large Language of Life Models (LLLMS) experiment.

```mermaid
sequenceDiagram
    participant CTRL as Controller\n(p{n}_controller.py)
    participant PE as Prompt Engine\n(p{n}_prompts.py)
    participant OC as OllamaClient\n(ollama_client.py)
    participant OL as Ollama Runtime\n(localhost:11434)
    participant LM as LLM Model\n(phi3 / llama3 / gemma2)
    participant RP as ResponseParser\n(response_parser.py)

    CTRL->>PE: build_p{n}_prompt(request)
    Note over PE: Injects: biomarker values,<br/>tissue context, JSON schema hint
    PE-->>CTRL: user_prompt (string, ~800 tokens)

    CTRL->>OC: generate_with_retry(model, prompt,\nsystem_prompt, temperature, max_tokens)

    loop Retry (max 2 attempts)
        OC->>OL: POST /api/generate\n{model, system, prompt, options}
        OL->>LM: Load model weights + tokenize
        LM-->>OL: Token stream → assembled response
        OL-->>OC: {"response": "...JSON..."}

        alt HTTP 200 + non-empty
            OC-->>CTRL: raw_output (string)
        else Timeout / Error
            OC->>OC: backoff + retry
        end
    end

    CTRL->>RP: ResponseParser.extract_json(raw_output)

    Note over RP: Strategy 1: Find balanced {} block<br/>Strategy 2: Strip ```json blocks<br/>Strategy 3: Regex JSON boundary<br/>Strategy 4: Return None → Fallback

    RP-->>CTRL: parsed_dict (or None)
```

---

## Diagram 10: Experiment Lifecycle Diagram
### Create → Run → Process → Store → Retrieve → Visualize

The full state machine of a single Large Language of Life Models (LLLMS) experiment from user intent to visualized insight.

```mermaid
stateDiagram-v2
    [*] --> IDLE : User opens module page

    IDLE --> CONFIGURING : User fills input form\n(react-hook-form + Zod)

    CONFIGURING --> VALIDATING : User clicks Submit

    VALIDATING --> CONFIGURING : Zod validation failure\n(show field errors)
    VALIDATING --> RUNNING : Zod validation passes\n(axios POST /api/p{n}/...)

    state RUNNING {
        [*] --> PROMPT_BUILD : Controller receives request
        PROMPT_BUILD --> LLM_CALL : build_p{n}_prompt()
        LLM_CALL --> PARSING : Ollama returns raw output
        PARSING --> SCHEMA_CHECK : ResponseParser.extract_json()

        state SCHEMA_CHECK {
            [*] --> LLM_PATH : Parsed dict valid
            [*] --> FALLBACK_PATH : None or invalid
            LLM_PATH --> [*]
            FALLBACK_PATH --> [*]: P{n}Simulator.simulate()
        }

        SCHEMA_CHECK --> STORING : log_experiment() → MongoDB
        STORING --> [*]
    }

    RUNNING --> DISPLAY : HTTP 200 + P{n}Response JSON\n(React Query cache update)
    RUNNING --> ERROR_STATE : HTTP 5xx / Network failure

    ERROR_STATE --> IDLE : User dismisses error toast

    state DISPLAY {
        [*] --> CHARTS : ResultsPanel renders
        CHARTS --> EXPORT : User clicks Download CSV/TSV
        CHARTS --> HISTORY : Experiment logged to history
    }

    DISPLAY --> HISTORY_VIEW : User navigates to\nExperiment History page

    state HISTORY_VIEW {
        [*] --> LISTING : GET /api/experiments
        LISTING --> DETAIL : GET /api/experiments/{id}
    }

    HISTORY_VIEW --> IDLE : User starts new experiment
```

---

## Diagram 11: API Flow Diagram
### Frontend → Axios → FastAPI → Router → Controller

Shows the complete HTTP request journey from UI interaction through all backend middleware layers to the controller response.

```mermaid
flowchart LR
    subgraph FE ["🖥️ Frontend (React)"]
        FORM["Form Submit\n(handleSubmit)"]
        RQ["React Query\nuseMutation"]
        AX["Axios Instance\n(client.ts)"]
        INT["JWT Interceptor\nAuthorization: Bearer token"]
    end

    subgraph NETWORK ["🌐 HTTP Transport"]
        REQ["POST /api/p1/predict-age\nContent-Type: application/json\nAuthorization: Bearer eyJ..."]
    end

    subgraph FASTAPI ["⚙️ FastAPI Backend"]
        CORS["CORS Middleware\nOrigin check\nPreflight handling"]
        LOG_MW["Logging Middleware\npath + method + origin"]
        GW["FastAPI App\nRoute dispatch"]

        subgraph ROUTER ["P1 Router — api/p1_router.py"]
            AUTH_DEP["JWT Dependency\nOAuth2PasswordBearer\ndecode + validate token"]
            PYDANTIC["Pydantic Validation\nP1Request schema\nField type coercion"]
            HANDLER["Route Handler\nPOST /predict-age"]
        end

        subgraph CTRL ["P1 Controller — controllers/p1_controller.py"]
            MODEL_VAL["validate_model()"]
            PROMPT_B["build_p1_prompt()"]
            LLM_CALL["ollama_client.generate_with_retry()"]
            PARSE["ResponseParser.extract_json()"]
            FALLB["P1Simulator (if needed)"]
            LOG_EXP["log_experiment() → MongoDB"]
            RESPONSE["Return P1Response"]
        end
    end

    subgraph DB_LLM ["🔧 External Services"]
        OLLAMA_S["Ollama :11434"]
        MONGO_S["MongoDB :27017"]
    end

    FORM -->|trigger| RQ
    RQ --> AX
    AX --> INT
    INT --> REQ
    REQ --> CORS --> LOG_MW --> GW --> AUTH_DEP
    AUTH_DEP -->|token valid| PYDANTIC
    AUTH_DEP -->|invalid| ERR401(["HTTP 401 Unauthorized"])
    PYDANTIC -->|valid| HANDLER
    PYDANTIC -->|invalid| ERR422(["HTTP 422 Validation Error\n+ field details"])
    HANDLER --> MODEL_VAL --> PROMPT_B --> LLM_CALL
    LLM_CALL --> OLLAMA_S
    LLM_CALL --> PARSE
    PARSE -->|fail| FALLB
    FALLB --> LOG_EXP
    PARSE -->|success| LOG_EXP
    LOG_EXP --> MONGO_S
    LOG_EXP --> RESPONSE
    RESPONSE -->|HTTP 200 JSON| RQ
    RQ -->|cache result| FE
```

---

## Diagram 12: Data Flow Diagram (DFD)
### How Data Moves Across the Entire System

A level-1 DFD showing all data stores, data flows, and processes in the Large Language of Life Models (LLLMS) system.

```mermaid
flowchart TD
    U((👤 Researcher\nUser))

    subgraph FE_PROC ["Frontend Processes"]
        P_AUTH["P1: Authentication\nlogin / register"]
        P_PROJ["P2: Project Management\ncreate / select project"]
        P_EXP["P3: Experiment Configuration\nfill form + select model"]
        P_VIZ["P4: Visualization\nrender charts + export"]
        P_HIST["P5: History Browser\nview past results"]
    end

    subgraph BE_PROC ["Backend Processes"]
        P_VALIDATE["P6: Input Validation\nPydantic schema check"]
        P_PROMPT["P7: Prompt Construction\nbuild_p{n}_prompt"]
        P_INFER["P8: LLM Inference\nOllama API call"]
        P_PARSE["P9: Response Parsing\nextract_json + validate"]
        P_FALLBACK["P10: Statistical Simulation\nP{n}Simulator NumPy"]
        P_LOG["P11: Experiment Logging\nexperiment_service"]
    end

    DS1[("DS1: MongoDB\nusers")]
    DS2[("DS2: MongoDB\nprojects")]
    DS3[("DS3: MongoDB\nexperiments")]
    DS4[("DS4: Ollama Model\nWeights / Context")]
    DS5["DS5: Zustand Store\n(JWT + active project)"]
    DS6["DS6: React Query Cache\n(API results)"]

    U -->|"email + password"| P_AUTH
    P_AUTH -->|"read/write user"| DS1
    P_AUTH -->|"JWT token"| DS5
    DS5 -->|"Bearer token"| P_PROJ

    U -->|"project name + description"| P_PROJ
    P_PROJ -->|"read/write project"| DS2
    P_PROJ -->|"selected project_id"| DS5

    DS5 -->|"project_id + JWT"| P_EXP
    U -->|"biomarker inputs\ngene targets\nmodel config"| P_EXP
    P_EXP -->|"P{n}Request JSON"| P_VALIDATE
    P_VALIDATE -->|"validated request"| P_PROMPT
    P_PROMPT -->|"system + user prompt"| P_INFER
    P_INFER -->|"prompt tokens"| DS4
    DS4 -->|"generated text"| P_PARSE

    P_PARSE -->|"parse failure"| P_FALLBACK
    P_PARSE -->|"valid result dict"| P_LOG
    P_FALLBACK -->|"simulated result dict"| P_LOG

    P_LOG -->|"experiment record"| DS3
    P_LOG -->|"P{n}Response"| DS6
    DS6 -->|"result data"| P_VIZ
    U -->|"view charts / download"| P_VIZ

    U -->|"request history"| P_HIST
    P_HIST -->|"query user experiments"| DS3
    DS3 -->|"past results"| P_HIST
    P_HIST -->|"cached list"| DS6

    style DS1 fill:#1a1a2e,stroke:#4fc3f7,color:#ffffff
    style DS2 fill:#1a1a2e,stroke:#4fc3f7,color:#ffffff
    style DS3 fill:#1a1a2e,stroke:#4fc3f7,color:#ffffff
    style DS4 fill:#0f3460,stroke:#a29bfe,color:#ffffff
    style DS5 fill:#16213e,stroke:#00cec9,color:#ffffff
    style DS6 fill:#16213e,stroke:#00cec9,color:#ffffff
```

---
---

## CATEGORY 3 — ADVANCED / MARKETING DIAGRAMS

---

## Diagram 13: AI Operating System View
### Large Language of Life Models (LLLMS) as a Scientific AI Platform

This positions Large Language of Life Models (LLLMS) not as a single application, but as a **platform** — an AI Operating System for computational biology — with pluggable modules, a shared intelligence layer, and extensibility for future scientific domains.

```mermaid
graph TD
    subgraph PLATFORM_OS ["🚀 Large Language of Life Models (LLLMS) — AI Operating System for Computational Biology"]

        subgraph APPS ["📱 Application Layer — Pluggable Scientific Modules"]
            APP1["🕰️ LifespanAI\nBiological Aging Clock\n(Epigenomics / Transcriptomics)"]
            APP2["🔬 Clinomics Engine\nSynthetic Omics Generator\n(RNA-seq / Methylation / Proteomics)"]
            APP3["💊 Multispecies & Tissue Engine\nDigital Drug Discovery\n(CMAP-style Perturbation Screening)"]
            APP_FUTURE["🔭 Future Modules\nProtein Folding / Pathway Analysis\n/ Clinical Trial Simulation"]
        end

        subgraph INTELLIGENCE ["🧠 Intelligence Layer — Shared AI Engine"]
            PROMPT_OS["Scientific Prompt Engine\n(CRIST Framework)"]
            LLM_OS["Multi-Model LLM Router\n(phi3 / llama3 / gemma2 / mistral)"]
            PARSER_OS["Response Intelligence\n(JSON extraction + schema coercion)"]
            SIM_OS["Statistical Fallback Engine\n(NumPy / SciPy simulation)"]
        end

        subgraph PLATFORM_SVC ["🔧 Platform Services — Core Infrastructure"]
            AUTH_OS["Identity & Access\n(JWT Auth + User Isolation)"]
            PROJ_OS["Research Workspace\n(Projects + Experiment Organization)"]
            LOG_OS["Experiment Ledger\n(Full audit trail in MongoDB)"]
            EXPORT_OS["Data Export Service\n(CSV / TSV / JSON)"]
        end

        subgraph DATA_OS ["🗄️ Data Platform"]
            MONGO_OS["MongoDB\n(Experiments + Users + Projects)"]
            OLLAMA_OS["Ollama Runtime\n(Local GPU/CPU Inference)"]
        end

        subgraph UX_OS ["🎨 Researcher Experience Layer"]
            UI_OS["ZeroKost Design System\n(Glassmorphic Dark Mode UI)"]
            VIZ_OS["Scientific Visualization\n(Recharts + Plotly)"]
            MODEL_SEL["Model Selection Control\n(Per-experiment LLM config)"]
        end

    end

    APPS --> INTELLIGENCE
    INTELLIGENCE --> PLATFORM_SVC
    PLATFORM_SVC --> DATA_OS
    UX_OS --> APPS

    style APPS fill:#0d1b2a,stroke:#74b9ff,color:#ffffff
    style INTELLIGENCE fill:#1a0030,stroke:#a29bfe,color:#ffffff
    style PLATFORM_SVC fill:#001a1a,stroke:#00cec9,color:#ffffff
    style DATA_OS fill:#1a1000,stroke:#fdcb6e,color:#ffffff
    style UX_OS fill:#1a0020,stroke:#fd79a8,color:#ffffff
```

---

## Diagram 14: Scientific Workflow Diagram
### From Raw Biological Question to Actionable Insight

This shows the researcher's journey through the platform and the scientific transformation at each stage.

```mermaid
flowchart LR
    subgraph QUESTION ["❓ Scientific Question"]
        Q1["What is my\nsubject's biological age?"]
        Q2["Generate a synthetic\nomics dataset for\nmy study design"]
        Q3["Which drug compounds\nreverse my target\ngene signature?"]
    end

    subgraph INPUT ["📥 Structured Input"]
        I1["Biomarkers:\nMethylation, RNA-seq,\nTelomere length\nTissue type"]
        I2["Design params:\nN samples, M features\nGroup conditions\nDataset type"]
        I3["Gene targets:\nGene + log2FC + direction\nDisease + Tissue\nScreening mode"]
    end

    subgraph ENGINE ["🧠 AI Experiment Engine"]
        E_PROMPT["Scientific Prompt\nConstruction"]
        E_LLM["LLM Reasoning\n(Ollama: phi3 / llama3)"]
        E_VALID["Schema Validation\n+ Quality Control"]
        E_SIM["Statistical Simulation\n(Fallback guarantee)"]
        E_LOG["Experiment Logging\n(MongoDB audit trail)"]
    end

    subgraph INSIGHT ["📊 Actionable Insight"]
        OUT1["Biological Age Report:\nAcceleration score\nSHAP gene drivers\nDisease risk\nTherapeutic targets"]
        OUT2["Synthetic Dataset:\nN×M expression matrix\nDE gene annotations\nQuality metrics\nCSV/TSV export"]
        OUT3["Drug Candidate Report:\nRanked compounds\nGene expression changes\nPathway enrichment\nADME profiles"]
    end

    Q1 --> I1 --> E_PROMPT
    Q2 --> I2 --> E_PROMPT
    Q3 --> I3 --> E_PROMPT

    E_PROMPT --> E_LLM --> E_VALID
    E_VALID -->|valid| E_LOG
    E_VALID -->|invalid| E_SIM --> E_LOG

    E_LOG --> OUT1
    E_LOG --> OUT2
    E_LOG --> OUT3

    style QUESTION fill:#0d1b2a,stroke:#74b9ff,color:#e0e0e0
    style INPUT fill:#1a0030,stroke:#a29bfe,color:#e0e0e0
    style ENGINE fill:#001a1a,stroke:#00cec9,color:#e0e0e0
    style INSIGHT fill:#1a1000,stroke:#fdcb6e,color:#e0e0e0
```

---

## Diagram 15: Reliability Architecture Diagram
### The Fallback System — Always-On Guarantee

Large Language of Life Models (LLLMS) is designed to **never return an error to the researcher**. This diagram shows the three-layer reliability architecture.

```mermaid
flowchart TD
    REQUEST([📨 Experiment Request]) --> LAYER1

    subgraph LAYER1 ["🥇 Tier 1 — LLM Primary Path (Best Quality)"]
        L1_LLM["Ollama LLM\nph3 / llama3 / gemma2"]
        L1_PARSE["ResponseParser\nJSON Extraction"]
        L1_SCHEMA["Pydantic Schema\nValidation"]
        L1_LLM --> L1_PARSE --> L1_SCHEMA
    end

    L1_SCHEMA -->|✅ Valid JSON| SUCCESS_LLM(["✅ LLM Response\nsimulation_mode=False\nHigh-fidelity output"])

    L1_LLM -->|Timeout ⏱️\nor HTTP Error| LAYER2
    L1_PARSE -->|Parse\nFailure ❌| LAYER2
    L1_SCHEMA -->|Schema\nInvalid ❌| LAYER2

    subgraph LAYER2 ["🥈 Tier 2 — Statistical Simulation Fallback (Always Available)"]
        L2_SIM["P{n}Simulator\nNumPy RNG (seed=42)"]
        L2_TISSUE["Tissue-conditioned\nDistribution Sampling"]
        L2_STRUCT["Structured Result\nmatching P{n}Response schema"]
        L2_SIM --> L2_TISSUE --> L2_STRUCT
    end

    L2_STRUCT -->|✅ Simulated Data| SUCCESS_SIM(["⚡ Simulated Response\nsimulation_mode=True\nDeterministic output"])

    SUCCESS_LLM --> LAYER3
    SUCCESS_SIM --> LAYER3

    subgraph LAYER3 ["🥉 Tier 3 — Persistence Layer (Best Effort)"]
        L3_LOG["log_experiment()\nMongoDB write"]
        L3_LOG -->|DB Error| L3_WARN["Log warning\n(structlog)"]
        L3_LOG -->|Success| L3_OK["Experiment saved"]
    end

    L3_WARN --> RETURN
    L3_OK --> RETURN

    RETURN(["📤 HTTP 200 Response\nResult always returned\nto researcher"])

    style LAYER1 fill:#003300,stroke:#00e676,color:#ffffff
    style LAYER2 fill:#1a1000,stroke:#ffab40,color:#ffffff
    style LAYER3 fill:#0d1b2a,stroke:#4fc3f7,color:#ffffff
    style SUCCESS_LLM fill:#1b5e20,color:#ffffff
    style SUCCESS_SIM fill:#e65100,color:#ffffff
```

---

## Diagram 16: Multi-Model Strategy Diagram
### Model Selection Layer — LLM Choice Architecture

Large Language of Life Models (LLLMS) exposes a **per-experiment model selection layer** via the `ModelSelectorWidget` frontend component and the `model_registry` backend, enabling researchers to trade off speed vs. scientific fidelity.

```mermaid
graph TD
    subgraph FE_SEL ["🖥️ Frontend — ModelSelectorWidget\n(src/components/model/ModelSelectorWidget.tsx)"]
        UI_MODEL["Model Dropdown\nselect model_name"]
        UI_TEMP["Temperature Slider\n0.0 – 1.0"]
        UI_TOKENS["Max Tokens Input\n256 – 8192"]
        LLMConfig["LLMConfig Object\n{model_name, temperature, max_tokens}"]
        UI_MODEL --> LLMConfig
        UI_TEMP --> LLMConfig
        UI_TOKENS --> LLMConfig
    end

    LLMConfig -->|"included in P{n}Request"| REGISTRY

    subgraph REGISTRY ["⚙️ Backend — model_registry.py"]
        R_VALIDATE["validate_model(model_name)"]
        R_WHITELIST{"Whitelist Check"}
        R_NORMALIZE["Normalize ID\nlowercase + strip"]
        R_DEFAULT["Fallback: settings.default_model\n= phi3"]
        R_VALIDATE --> R_WHITELIST
        R_WHITELIST -->|Known model| R_NORMALIZE
        R_WHITELIST -->|Unknown model| R_DEFAULT
    end

    subgraph MODELS ["🤖 Available Models via Ollama"]
        direction TB
        M1["phi3\n3.8B params\n⚡ Fast ~15s\nBest for: quick iterations"]
        M2["phi3:medium\n14B params\n🔬 Balanced ~40s\nBest for: detailed aging analysis"]
        M3["llama3\n8B params\n🧬 Scientific ~30s\nBest for: drug discovery"]
        M4["llama3:70b\n70B params\n🔬 High-fidelity ~120s\nBest for: complex omics"]
        M5["gemma2\n9B params\n📋 Instruction-tuned ~35s\nBest for: structured JSON output"]
        M6["mistral\n7B params\n⚡ Efficient ~25s\nBest for: multi-step reasoning"]
    end

    R_NORMALIZE --> M1
    R_NORMALIZE --> M2
    R_NORMALIZE --> M3
    R_NORMALIZE --> M4
    R_NORMALIZE --> M5
    R_NORMALIZE --> M6
    R_DEFAULT --> M1

    subgraph ROUTING ["📡 LLM Client Routing"]
        CLIENT["OllamaClient.generate_with_retry\n(model=validated_model_name)"]
        M1 --> CLIENT
        M2 --> CLIENT
        M3 --> CLIENT
        M4 --> CLIENT
        M5 --> CLIENT
        M6 --> CLIENT
    end

    style M1 fill:#004d00,stroke:#00e676,color:#fff
    style M2 fill:#004d00,stroke:#69f0ae,color:#fff
    style M3 fill:#003366,stroke:#4fc3f7,color:#fff
    style M4 fill:#003366,stroke:#29b6f6,color:#fff
    style M5 fill:#4a0030,stroke:#f48fb1,color:#fff
    style M6 fill:#1a1a00,stroke:#fff176,color:#fff
```

---

## Diagram 17: Performance Flow Diagram
### LLM vs. Simulation Latency — Time-to-Result

Shows the wall-clock time breakdown for each path through the system, helping researchers understand response time expectations.

```mermaid
gantt
    title Large Language of Life Models (LLLMS) — Request Latency Breakdown (milliseconds)
    dateFormat  X
    axisFormat  %s ms

    section LLM Path — phi3 (3.8B) — Fast Mode
    Frontend Validation (Zod)         :done,    fe1, 0, 50
    HTTP Transport + CORS             :done,    net1, 50, 100
    Pydantic Schema Validation        :done,    pyd1, 100, 150
    build_p{n}_prompt()               :done,    pr1, 150, 200
    Ollama generate (phi3)            :active,  llm1, 200, 18000
    ResponseParser.extract_json()     :done,    rp1, 18000, 18100
    Pydantic Output Validation        :done,    pv1, 18100, 18150
    log_experiment() MongoDB write    :done,    db1, 18150, 18300
    HTTP Response + React Query cache :done,    re1, 18300, 18500

    section LLM Path — llama3 (8B) — Balanced Mode
    Frontend Validation (Zod)         :done,    fe2, 0, 50
    HTTP Transport + CORS             :done,    net2, 50, 100
    Pydantic Schema Validation        :done,    pyd2, 100, 150
    build_p{n}_prompt()               :done,    pr2, 150, 200
    Ollama generate (llama3)          :active,  llm2, 200, 45000
    ResponseParser.extract_json()     :done,    rp2, 45000, 45100
    Pydantic Output Validation        :done,    pv2, 45100, 45150
    log_experiment() MongoDB write    :done,    db2, 45150, 45300
    HTTP Response + React Query cache :done,    re2, 45300, 45500

    section Simulation Fallback Path — Always < 1s
    Frontend Validation (Zod)         :done,    fe3, 0, 50
    HTTP Transport + CORS             :done,    net3, 50, 100
    Pydantic Schema Validation        :done,    pyd3, 100, 150
    LLM Timeout / Failure detected    :crit,    fail, 150, 300
    P{n}Simulator.simulate() NumPy    :done,    sim3, 300, 600
    log_experiment() MongoDB write    :done,    db3, 600, 750
    HTTP Response + React Query cache :done,    re3, 750, 900
```

### Latency Summary Table

| Path | Model | Typical P50 | Typical P95 | Notes |
|------|-------|------------|------------|-------|
| LLM — phi3 | 3.8B | 15–20s | 35s | Default; good for fast iteration |
| LLM — phi3:medium | 14B | 35–50s | 80s | Higher reasoning quality |
| LLM — llama3 | 8B | 25–45s | 70s | Best scientific accuracy balance |
| LLM — llama3:70b | 70B | 90–120s | 180s | Highest fidelity (needs GPU) |
| LLM — gemma2 | 9B | 30–40s | 65s | Best JSON formatting compliance |
| LLM — mistral | 7B | 20–35s | 55s | Fast + strong multi-step reasoning |
| **Simulation Fallback** | — | **< 500ms** | **< 1s** | Always available, deterministic |

---

## Diagram 18: Security Architecture Diagram
### JWT, Validation, Isolation — Defence in Depth

```mermaid
flowchart TD
    subgraph EXTERNAL ["🌍 External — Untrusted Zone"]
        BROWSER["Browser Client"]
        ATTACKER["Potential Attacker"]
    end

    subgraph TRANSPORT ["🔒 Transport Security Layer"]
        TLS["TLS 1.3 (HTTPS)\nEncrypts all traffic in transit"]
        CORS_MW["CORS Middleware\nOrigin allowlist enforcement\nPreflight header validation"]
    end

    subgraph AUTHN ["🔑 Authentication Layer — auth_router.py + auth_service.py"]
        REGISTER["POST /api/auth/register\nInput sanitized via Pydantic\nPassword → bcrypt hash\nStored in MongoDB users"]
        LOGIN["POST /api/auth/login\nEmail + password check\nbcrypt.verify()\nIssue JWT (HS256, 24h TTL)"]
        JWT_ISSUE["JWT Payload:\n{sub: user_id, exp: timestamp}\nSigned with JWT_SECRET_KEY\n(env var, never in code)"]
    end

    subgraph AUTHZ ["🛡️ Authorization Layer — Per-Router Dependency"]
        JWT_DEP["OAuth2PasswordBearer\nExtract Bearer token from header"]
        JWT_VERIFY["python-jose decode\nVerify signature + expiry"]
        USER_CTX["Inject user_id into\nrequest context"]
        ISOLATION["All DB queries filtered\nWHERE user_id = current_user\nNo cross-user data access"]
    end

    subgraph INPUT_SEC ["🔍 Input Security Layer"]
        PYDANTIC_REQ["Pydantic Request Schemas\nStrict type coercion\nEnum whitelisting (tissue_type, etc.)\nRange bounds (temperature 0–1)"]
        PROMPT_ESCAPE["Prompt Injection Prevention\nUser inputs quoted in prompt templates\nNo raw string interpolation from user"]
        RATE["Model Registry Whitelist\nOnly known Ollama model IDs accepted\nUnknown models → default fallback"]
    end

    subgraph OUTPUT_SEC ["📤 Output Security Layer"]
        ERR_GENERIC["Generic 500 Responses\n'An unexpected error occurred'\nNo stack traces to client"]
        SCHEMA_OUT["Pydantic Response Models\nOnly whitelisted fields returned\nNo internal fields (hashed_password, etc.)"]
        STRUCTLOG["structlog JSON Logging\nDetailed errors → server logs only"]
    end

    subgraph DB_SEC ["🗄️ Data Security Layer"]
        PWD_STORE["Passwords: bcrypt hash only\nNever plaintext in DB"]
        ENV_SECRETS["Secrets via env vars only:\nMONGODB_URI, JWT_SECRET_KEY\n.env never committed to git"]
        USER_ISO["Experiments isolated by user_id\nProjects isolated by user_id\nNo admin bypass in v1.0"]
    end

    BROWSER -->|HTTPS| TLS --> CORS_MW
    ATTACKER -->|Blocked by TLS/CORS| TLS

    CORS_MW --> REGISTER
    CORS_MW --> LOGIN
    CORS_MW --> JWT_DEP

    REGISTER --> JWT_ISSUE
    LOGIN --> JWT_ISSUE
    JWT_ISSUE -->|"Bearer token to client"| BROWSER

    BROWSER -->|"Authorization: Bearer <token>"| JWT_DEP
    JWT_DEP --> JWT_VERIFY
    JWT_VERIFY -->|invalid / expired| ERR401(["HTTP 401 Unauthorized"])
    JWT_VERIFY -->|valid| USER_CTX --> ISOLATION

    ISOLATION --> PYDANTIC_REQ --> PROMPT_ESCAPE --> RATE
    RATE -->|invalid model| RATE_FB["Fallback to phi3\n(no error returned)"]
    RATE -->|valid model| CONTROLLER["Controller execution"]

    CONTROLLER --> ERR_GENERIC
    CONTROLLER --> SCHEMA_OUT
    CONTROLLER --> STRUCTLOG
    CONTROLLER --> PWD_STORE
    CONTROLLER --> ENV_SECRETS
    CONTROLLER --> USER_ISO

    style TRANSPORT fill:#003300,stroke:#00e676,color:#ffffff
    style AUTHN fill:#003366,stroke:#4fc3f7,color:#ffffff
    style AUTHZ fill:#1a0030,stroke:#a29bfe,color:#ffffff
    style INPUT_SEC fill:#330000,stroke:#ff6b6b,color:#ffffff
    style OUTPUT_SEC fill:#1a1000,stroke:#fdcb6e,color:#ffffff
    style DB_SEC fill:#001a1a,stroke:#00cec9,color:#ffffff
```

---

## Quick Reference: All 18 Diagrams

| # | Diagram | Location | Category |
|---|---------|----------|----------|
| 1 | High-Level Architecture | Technical Architecture Doc | Core |
| 2 | Layer Architecture | Technical Architecture Doc | Core |
| 3 | Request Sequence (P1) | Technical Architecture Doc | Core |
| 4 | Database ERD | Technical Architecture Doc | Core |
| 5 | Frontend Component Tree | Technical Architecture Doc | Core |
| 6 | Local Deployment Topology | Technical Architecture Doc | Core |
| **7** | **AI Pipeline (LLM + Parser + Fallback)** | **This Document** | Implicit |
| **8** | **Module Architecture (P1/P2/P3 + shared infra)** | **This Document** | Implicit |
| **9** | **LLM Interaction (Prompt → Model → Parser)** | **This Document** | Implicit |
| **10** | **Experiment Lifecycle State Machine** | **This Document** | Implicit |
| **11** | **API Flow (FE → Axios → FastAPI → Controller)** | **This Document** | Implicit |
| **12** | **Data Flow Diagram (DFD Level-1)** | **This Document** | Implicit |
| **13** | **AI Operating System Platform View** | **This Document** | Marketing |
| **14** | **Scientific Workflow (Question → Insight)** | **This Document** | Marketing |
| **15** | **Reliability Architecture (3-Tier Fallback)** | **This Document** | Marketing |
| **16** | **Multi-Model Strategy (LLM Selection Layer)** | **This Document** | Marketing |
| **17** | **Performance Flow (LLM vs. Simulation Latency)** | **This Document** | Marketing |
| **18** | **Security Architecture (JWT + Isolation + Validation)** | **This Document** | Marketing |

---

*End of Large Language of Life Models (LLLMS) Architecture Diagrams — v1.0*
