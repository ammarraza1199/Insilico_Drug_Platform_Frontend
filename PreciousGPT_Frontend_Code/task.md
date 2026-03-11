 📋 PreciousGPT Frontend Complete TODO List


  Phase 1: Project Scaffolding & Core Architecture
   - [ ] Initialize Vite + React + TypeScript project.
   - [ ] Configure pnpm as the package manager.
   - [ ] Install Core Dependencies:
     - [ ] Routing: react-router-dom
     - [ ] State: zustand, @tanstack/react-query
     - [ ] Styling/UI: tailwindcss, lucide-react, shadcn/ui (Radix UI primitives)
     - [ ] Forms/Validation: react-hook-form, zod, @hookform/resolvers
     - [ ] Utilities: axios, jwt-decode, date-fns
     - [ ] Charts: recharts, plotly.js, react-plotly.js, d3
     - [ ] Components: react-dropzone
   - [ ] Create Exact Folder Structure (as per Section 9.1).
   - [ ] Configure Tailwind CSS with scientific color palette (Primary Blue: #2563EB, Accent Green: #16A34A, Warning   
     Amber: #D97706, Alert Red: #DC2626, Neutral Gray: #6B7280, Purple: #7C3AED, Teal: #0D9488).
   - [ ] Set up Environment Variables (.env.development, .env.production).
   - [ ] Implement utility files (formatters.ts, colorScales.ts, constants.ts).


  Phase 2: State Management & Mock API (MSW)
   - [ ] Set up Zustand Stores:
     - [ ] authStore.ts (JWT, role, session)
     - [ ] experimentStore.ts (active config)
     - [ ] modelStore.ts (global/system models, API keys)
     - [ ] uiStore.ts (sidebar, theme, notifications)
   - [ ] Define all TypeScript Interfaces (/src/types/ - Auth, Experiment, Model, P1, P2, P3, API).
   - [ ] Setup Axios Client (/src/api/client.ts) with interceptors for JWT.
   - [ ] Initialize Mock Service Worker (MSW) (/src/mocks/browser.ts).
   - [ ] Create Mock API Handlers (with specified randomized delays):
     - [ ] Auth & Users (/api/auth/login, /register, /me)
     - [ ] Projects & History (/api/projects, /api/experiments)
     - [ ] P1 Endpoints (Predict, Results, Job Status)
     - [ ] P2 Endpoints (Generate, Results, Job Status)
     - [ ] P3 Endpoints (Screen, Results, Job Status)
   - [ ] Create Mock Data Fixtures (JSON/CSV representations).


  Phase 3: Routing, Layouts & Authentication
   - [ ] Configure React Router (/src/router/index.tsx) with all specified routes.
   - [ ] Implement Layouts:
     - [ ] PublicLayout.tsx (Marketing/Auth pages)
     - [ ] AppLayout.tsx (Authenticated shell)
     - [ ] AppSidebar.tsx (Collapsible left nav)
     - [ ] AppTopBar.tsx (Logo, user menu, global model indicator, jobs running indicator)
   - [ ] Implement ProtectedRoute.tsx (Auth & role guards).
   - [ ] Build Pages:
     - [ ] Landing Page (/)
     - [ ] Login & Register Pages (/login, /register)
     - [ ] Dashboard Page (/dashboard - Quick launch, recent experiments)


  Phase 4: Shared UI & Model Selection System
   - [ ] Setup shadcn/ui generic components (Buttons, Inputs, Dialogs, Selects, Sliders, Tabs).
   - [ ] Build Custom Shared Components:
     - [ ] FileUploadZone.tsx (React Dropzone wrapper with validation & mini-table preview)
     - [ ] ProgressBar.tsx (Animated, multi-stage)
     - [ ] StatusBadge.tsx, DataTable.tsx, DownloadButton.tsx
   - [ ] Implement Model Selection System (Section 5):
     - [ ] ModelSettingsPage.tsx (Global default, per-system overrides, saved profiles, secure API keys)
     - [ ] ModelSelectorModal.tsx (6 provider tabs, dynamic fields, test connection button)
     - [ ] ModelSelectorWidget.tsx (Compact inline view for experiment panels)
     - [ ] ApiKeyField.tsx (Masked input)


  Phase 5: Precious1GPT Module (Biological Aging Clock)
   - [ ] Build P1 Input Panel (P1InputForm.tsx):
     - [ ] Dropzones for DNA methylation & RNA-seq
     - [ ] Biological Parameters (Searchable selects for Tissue/Species, Age input, Sex, Preprocessing toggles)        
   - [ ] Build P1 Results Panel (P1ResultsPanel.tsx):
     - [ ] Age Header Card (Predicted vs Chronological, Acceleration badge)
     - [ ] BiologicalAgeGauge.tsx (D3/SVG gauge)
     - [ ] AgingDistributionChart.tsx (Recharts AreaChart)
     - [ ] ShapBarChart.tsx (Recharts, top 20 genes)
     - [ ] DiseaseClassificationChart.tsx (Recharts BarChart)
     - [ ] Therapeutic Targets Table (Sortable)
     - [ ] PDF, CSV, JSON export buttons.


  Phase 6: Precious2GPT Module (Synthetic Data Generator)
   - [ ] Build P2 Input Panel (P2InputForm.tsx):
     - [ ] Generation Parameters (Tissue, Species, Dual-handle Age slider, Bio Condition, Modalities, Sample count     
       slider)
     - [ ] Advanced Options (Reference dataset, Noise slider, Batch effect toggle, Correlation, Random Seed)
   - [ ] Build P2 Results Panel (P2ResultsPanel.tsx):
     - [ ] Generation Progress Section (Multi-stage bar + log stream)
     - [ ] Dataset Preview Table (Paginated matrix)
     - [ ] DensityComparisonPlot.tsx (Plotly, synthetic vs reference)
     - [ ] OmicsPCAPlot.tsx (Plotly, PCA scatter)
     - [ ] QC pass/fail badges
     - [ ] Downloads table (Manifest of mock files)


  Phase 7: Precious3GPT Module (Drug Discovery Engine)
   - [ ] Build P3 Input Panel (P3InputForm.tsx):
     - [ ] Target Biology (Tissue, Disease, Age Range)
     - [ ] P3GeneTargetEditor.tsx (Upload, manual entry dynamic row table, or load from P1)
     - [ ] Compound Input (SMILES textarea or CSV upload)
     - [ ] Screening Config (Mode, Max compounds slider, Pathway multi-select, Toxicity filter)
   - [ ] Build P3 Results Panel (P3ResultsPanel.tsx):
     - [ ] Ranked Table (Sortable, row expansion for compound details)
     - [ ] ExpressionHeatmap.tsx (Plotly, genes × compounds)
     - [ ] VolcanoPlot.tsx (Plotly, log2 fold change)
     - [ ] EnrichedPathwayChart.tsx (Recharts horizontal bars)
     - [ ] GenePathwayNetwork.tsx (D3.js force-directed graph)
  Phase 8: History, Polish, & Final Integration
   - [ ] Build ExperimentHistoryPage.tsx (Paginated, filters, search, bulk actions).
   - [ ] Build ResultsViewerPage.tsx (Standalone results view for history).
   - [ ] Build ProjectWorkspacePage.tsx (Project-specific views).
   - [ ] Build AdminPage.tsx (User management, system status).
   - [ ] Build ProfileSettingsPage.tsx.
   - [ ] Implement Global UX Features:
     - [ ] Toast notification queue & browser notifications.
     - [ ] Persistent "Reload Config" functionality across all history items.
     - [ ] Error boundary fallbacks.

  ---
