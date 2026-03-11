# PreciousGPT — In-Silico Computational Biology Platform

PreciousGPT is a cutting-edge AI-powered computational biology research platform designed to replace or supplement wet laboratory pre-clinical experimentation with **in-silico digital simulation**. 

Inspired by the Large Language of Life Models (LLLM) ecosystem, PreciousGPT leverages multi-omics AI models to enable researchers to run biological experiments computationally, dramatically reducing the time, cost, and ethical constraints of physical laboratory work.

---

## 🧬 Core AI Systems

### 1. Precious1GPT: Biological Aging Clock
Predicts biological age from molecular data (DNA methylation arrays and RNA-seq).
- **Outputs:** Predicted biological age, age acceleration scores, and SHAP gene importance rankings.

### 2. Precious2GPT: Synthetic Multi-Omics Generator
Produces statistically valid synthetic biological datasets for rare tissue types or underrepresented cohorts.
- **Outputs:** Synthetic gene expression matrices and statistical validation reports.

### 3. Precious3GPT: Digital Drug Discovery
Simulates drug perturbation experiments in silico to identify compounds that reverse pathological gene expression.
- **Outputs:** Ranked lead candidates, compound efficacy scores, and pathway network visualizations.

---

## 🚀 Key Features

- **Scientific Visualization:** Interactive Volcano plots, Heatmaps, Gauge charts, and D3.js force-directed Gene Interaction Networks.
- **Model Selection System:** Flexibly swap between model providers including **Ollama (local)**, OpenAI, Anthropic, and HuggingFace.
- **MVP Ready UI/UX:**
  - **Full Responsiveness:** Optimized for desktop and mobile with adaptive navigation.
  - **Skeleton Loaders:** Professional perceived performance for data-heavy views.
  - **Error Resilience:** Global Error Boundaries and automated API error toast notifications.
- **Mock Service Worker (MSW):** Realistic async simulation for development and rapid prototyping.

---

## 🛠 Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** TailwindCSS, shadcn/ui
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Scientific Charting:** Plotly.js, Recharts, D3.js
- **Validation:** Zod + React Hook Form

---

## 📡 Backend & AI Integration (Future)

The platform is architected for seamless integration with a Node.js/Express proxy layer:
- **LLM Engine:** Local **Ollama** integration (phi3, llama3, med-llama).
- **Persistence:** **MongoDB** for project management and experiment history storage.
- **Data Flow:** Structured JSON contracts ensure the frontend charts remain functional as you move from mock to real data.

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm or npm

### Installation
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## 📄 Documentation

Detailed architectural and research documents can be found here:
- [Frontend Architecture](./PreciousGPT_Frontend_Architecture.md)
- [MVP Readiness Plan](./brain/mvp_readiness_plan.md)
- [ML Research Report](./brain/ml_research_report.md)

---

Developed for **Advanced Agentic Computational Biology Research**.
