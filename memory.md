<!-- Sanchara Vyuha AI-TOS v6.0 Memory Log Tag -->
# 🧠 Sanchara Vyuha — Master System Architecture & Project Brain (`memory.md`)

## 1. Executive Summary & Project Purpose

**Sanchara Vyuha** is an **Autonomous Transit Decision Intelligence Platform (AI-TOS v3.0)** built for modern urban public transit authorities (specifically modeled on BMTC Route 365J corridor in Bengaluru). 

The platform transforms raw telemetry—line-crossing CCTV passenger detection via YOLOv8/ByteTrack, Electronic Ticketing Machines (ETM), and GTFS feeds—into real-time quantile demand forecasts, policy-compliant **Missions**, 13-module intelligence pipelines, multi-option Monte Carlo simulations (Options A, B, C), and counterfactual explainable **Decision Packages**.

---

## 2. System Architecture (AI-TOS v3.0 — 13-Module Engine)

```
                            Decision Intelligence Engine v3.0
                            
                       Context Intelligence (Module 1)
                                      │
                         Data Quality Intel (Module 2)
                                      │
                          Feature Intel (Module 3)
                                      │
                         Forecast Intel (Module 4)
                                      │
                      Decision Trigger Intel (Module 5)
                                      │
                          Policy Intel (Module 6)
                                      │
                           Risk Intel (Module 7)
                                      │
                          Utility Intel (Module 8)
                                      │
                        Optimization Intel (Module 9)
                                      │
                       Explainability Intel (Module 10)
                                      │
                      Decision Package Intel (Module 11)
                                      │
                         Feedback Intel (Module 12)
                                      │
                      Evaluation & Benchmark (Module 13)
```

---

## 3. Directory Layout & Key Modules

```text
services/
├── backend/
│   ├── context_engine.py      # Module 1 (Context Intel) & Module 2 (Data Quality Intel)
│   ├── policy_risk_engine.py  # Module 6 (Policy Intel), Module 7 (Risk Intel), Module 8 (Utility Intel)
│   ├── api/routers/
│   │   ├── stops.py           # Stop telemetry & CCTV gate counts
│   │   ├── buses.py           # Bus fleet positions & SoC status
│   │   ├── dispatch.py        # Decision Package v3.0 & Mission Manager endpoints
│   │   ├── forecasting.py     # LightGBM Quantile & SHAP API
│   │   ├── alerts.py          # Anomaly detection & crowd spikes
│   │   ├── gtfs.py            # GTFS Static ZIP & GTFS-RT Protobuf feeds
│   │   ├── sustainability.py  # ISO 14064 Well-to-Wheel carbon metrics
│   │   ├── health.py          # Health & system FPS metrics
│   │   └── websocket.py       # Real-time WebSocket streaming
│   ├── database.py            # SQLAlchemy SQLite DB engine
│   ├── models.py              # DB ORM Models
│   ├── schemas.py             # Pydantic v2 ConfigDict Schemas
│   └── main.py                # FastAPI Application Entry
├── cv_engine/
│   ├── tracker.py             # ByteTrack multi-object tracking
│   └── gate_counter.py        # Virtual line-crossing gate counter
├── optimizer/
│   ├── solver.py              # Module 9 (OR-Tools Solver), Module 10 (Explainability), Module 11 (Decision Package)
│   └── carbon_accounting.py   # ISO 14064 Carbon & Fuel Accounting
├── forecasting/
│   ├── train_and_tune.py      # Module 4 (5-Fold TimeSeriesSplit ML Pipeline)
│   ├── feature_engineering.py# Module 3 (Feature Intel & Lag Engineering)
│   └── best_model.pkl         # Trained LightGBM Quantile Artifact
tests/
├── test_phase_a_stress_and_tuning.py# Phase A (Stress, Extreme Surges & Parameter Tuning) & Phase D (Audit Trail)
├── test_v3_benchmark_suite.py# Module 13 (7-Scenario Automated Benchmark Suite)
├── test_v2_decision_engine.py# Integration test suite
└── test_api.py                # API router test suite

---

## 4. Enterprise Master Roadmap & Exit Gates (Phases 1 – F)

```
Phase 1 ✅ Infrastructure  ►  Phase 2 ✅ AI-TOS  ►  Phase 3 ✅ Decision Intelligence Engine
                                                                 │
┌────────────────────────┐    ┌────────────────────────┐    ┌────▼───────────────────┐
│Phase A: Validation     │───►│Phase B: Prod Hardening │───►│Phase C: Observability  │
│(Does it work?)         │    │(Does it fail safely?)  │    │(Can we observe it?)    │
└────────────────────────┘    └────────────────────────┘    └───────────┬────────────┘
                                                                        │
┌────────────────────────┐    ┌────────────────────────┐    ┌───────────▼────────────┐
│Phase F: Research       │◄───│Phase E: MLOps          │◄───│Phase D: Operational    │
│(How to make it smart?) │    │(Operate for years?)    │    │(Will operators trust?) │
└────────────────────────┘    └────────────────────────┘    └────────────────────────┘
```

| Phase | Core Question | Key Exit Gate Criteria | Status | Deliverables |
| :--- | :--- | :--- | :--- | :--- |
| **Phase A** | *Does it work?* | ✅ 15 benchmark scenarios pass, 0 policy violations, false dispatches $<4\%$, latency $<50\text{ms}$ | **PASSED** | [test_phase_a_stress_and_tuning.py](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/tests/test_phase_a_stress_and_tuning.py) |
| **Phase B** | *Does it fail safely?* | ✅ `DependencyHealthManager` monitoring Weather, Traffic, GTFS, SQLite, CCTV feeds with fallback strategies | **PASSED** | [dependency_health.py](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/services/backend/dependency_health.py) |
| **Phase C** | *Can we observe it?* | ✅ Categorized Metrics: Business, ML, System, Data metrics exposed via `/api/v1/health/observability` | **PASSED** | [health.py](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/services/backend/api/routers/health.py) |
| **Phase D** | *Will operators trust it?* | ✅ Operator Acceptance Testing: Understand time $<3.5\text{s}$, SQLite decision audit log & post-mortem investigation DB | **PASSED** | [audit_logger.py](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/services/backend/audit_logger.py) |
| **Phase E** | *Can we operate for years?* | ✅ Model Registry, Feature Store, Drift Detection, Retraining Pipeline & Shadow Deployments | **PASSED** | [mlops.py](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/services/backend/mlops.py) |
| **Phase F** | *How to make it smarter?* | 🔬 Predictive Operations (Pre-surge fleet prep), SUMO 3D Digital Twin, Multi-Agent Inter-Depot Swaps | **ROADMAP** | Predictive Operations Specification |

---

## 5. Architecture Decision Record (ADR) Repository

The project repository includes 7 foundational **Architecture Decision Records (ADRs)** in the [adr/](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/adr) directory:

1. [adr/001-why-lightgbm.md](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/adr/001-why-lightgbm.md): Why LightGBM Multi-Quantile Regressor over Neural Networks / LLMs.
2. [adr/002-why-ortools.md](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/adr/002-why-ortools.md): Why Google OR-Tools for Constrained Fleet Optimization over Deep RL.
3. [adr/003-why-gtfs.md](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/adr/003-why-gtfs.md): Why GTFS Static & GTFS-Realtime Protobuf Open Transit Standards.
4. [adr/004-why-policy-engine.md](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/adr/004-why-policy-engine.md): Why Deterministic Hard Policy Governance in the Decision Loop.
5. [adr/005-why-dual-trigger.md](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/adr/005-why-dual-trigger.md): Why Dual-Trigger Condition ($P50 > 120 \land P90 > 175$) to Eliminate False Dispatches.
6. [adr/006-why-utility-score.md](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/adr/006-why-utility-score.md): Why Multi-Attribute 100-Point Utility Scorecard for Option Ranking.
7. [adr/007-why-monte-carlo.md](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/adr/007-why-monte-carlo.md): Why Monte Carlo Option Simulation (Mean, Variance, 95% CI) under Uncertainty.

---

## 6. Enterprise Master Deliverable Suite & CCTV Video Grid (`docs/` & `run_3x3_cctv_yolo_grid.py`)

1. **`run_3x3_cctv_yolo_grid.py`**: Multi-Camera 3x3 Grid CCTV Viewer displaying 9 bus stop videos (`cctv/busstop_1.MOV` through `busstop_9.mp4`) with live YOLOv8 person detection bounding boxes, per-stop passenger counts, aggregate passenger metrics, and live FPS header.
2. [docs/frontend_architecture_spec.md](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/docs/frontend_architecture_spec.md): AI-TOS Global Frontend Architecture Specification (Workspace-Centric Persona Mapping, 8 Persona Workspaces, Level 1/2/3 Analytics, De-cluttered Top Header, WCAG AA Accessibility).
3. [docs/observability_monitoring_spec.md](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/docs/observability_monitoring_spec.md): 2-Layer Monitoring & Observability Architecture Specification (Layer 1 Monitoring vs Layer 2 Observability, Distributed Tracing, Alert Rules Engine).
4. [docs/architecture_book.md](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/docs/architecture_book.md): Master Architecture Book featuring C4 Model Diagrams (System Context, Container, Component, Deployment, Decision Lifecycle), ADR index, Quality Attributes, and Operations Runbook.
5. [docs/engineering_validation_report.md](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/docs/engineering_validation_report.md): Engineering Validation & Performance Report with metric provenance labels (`[MEASURED]`, `[SIMULATED]`, `[ESTIMATED]`, `[TARGET]`), 100-request stress test benchmarks, documented limitations, and future validation roadmap.
6. [docs/operations_demo_day_in_life.md](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/docs/operations_demo_day_in_life.md): End-to-End "Day in the Life" Operational Demonstration (06:00 to 22:00 timeline) with auto-generated 24-Hour Operations Summary Report.
7. [docs/quality_attributes.md](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/docs/quality_attributes.md): System Quality Attributes Specification mapping non-functional requirements to quantitative targets (99.99% Availability, Zero Policy Violations, <50ms Latency).
8. [docs/operations_runbook.md](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/docs/operations_runbook.md): Operations & Incident Response Runbook outlining SOPs for camera offline, weather API timeout, GTFS delays, solver fallback, and model drift.
9. [docs/traceability_matrix.md](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/docs/traceability_matrix.md): Master Traceability Matrix linking operational requirements to ADRs, code modules, and automated tests.
```
├── components/
│   ├── CommandHeader.tsx      # Network Health Gauge, Scenarios & Mission Brief
│   ├── StopSidebar.tsx        # Priority Stop List (Critical auto-expands)
│   ├── RouteRadar.tsx         # Clean SVG Map with severity halo rings & hover cards
│   ├── AIOperations.tsx       # Human Decision Center, Mission Header & Options A/B/C Matrix
│   ├── FleetStrip.tsx         # Color-coded Fleet Availability (Ready/Full)
│   ├── EventTimeline.tsx      # Chronological timeline with pulsing NOW indicator
│   └── NetworkKPIs.tsx        # Smart Cities Network Intelligence metrics
├── services/api.ts            # Axios API client binding to FastAPI backend
└── App.tsx                    # 100vh CSS Grid single-viewport layout
docs/
├── evaluation.md              # 5-Model Benchmark, Calibration & KPIs Report
├── dataset.md                 # Data Schema & Feature Engineering
├── api.md                     # OpenAPI / Swagger Specification
├── architecture_diagram.md    # System Architecture Diagram
└── demo_story.md              # 8:45 AM Silk Board Rush Scenario & Video Script
```

---

## 4. Key AI & Decision Intelligence Capabilities

1. **Multi-Quantile Demand Forecasting & Dual-Trigger Logic**:
   - Computes $P10$ (Conservative), $P50$ (Median), and $P90$ (Surge Peak) passenger demand bounds using LightGBM.
   - Dual-trigger condition $(P50 > 120) \land (P90 > 175)$ prevents false dispatches from tail-noise alone.
2. **SHAP Feature Explainability**:
   - Identifies top drivers behind demand predictions (`demand_lag_1h`, `boarded_count`, `rain_alert`, `is_peak_hour`).
3. **Hard Policy Engine Governance**:
   - Vets recommendations against 4 hard policy rules: Driver Shift $<8.0\text{h}$, EV Battery SoC $\ge 20\%$, Depot Reserve Minimum $\ge 3$ buses, and 10-Minute Rate Limit per stop.
4. **Human Decision Center & Mission Manager**:
   - Manages corridor-level **Missions** (e.g. `MISSION-365J-014`).
   - Presents a structured **Decision Package** (`DISP-2026-069`) with simulated alternatives (Option A Recommended EV vs. Option B Short-Turn Bus vs. Option C Baseline).
5. **Dynamic Context-Aware Objective Weights**:
   - Adjusts cost weights $\alpha(t), \beta(t), \gamma(t)$ for Peak Rush ($\alpha=0.70$), Rain Emergency ($\alpha=0.85$), and Late Night ($\beta=0.70$) modes.
6. **Interactive Ask AI Operations Copilot**:
   - Conversational AI answers queries regarding policy compliance, mission goals, and contingency plans.

---

## 5. Empirical Model Performance & Fuel Derivation

- **Model**: Tuned LightGBM Multi-Quantile ($P10, P50, P90$)
- **MAE**: **29.54 passengers** | **RMSE**: **50.83 passengers** | **$R^2$ Score**: **0.9629**
- **Empirical Quantile Calibration**:
  - $P10\text{ Coverage}$: **9.8%** (Target $10.0\%$)
  - $P50\text{ Coverage}$: **50.2%** (Target $50.0\%$)
  - $P90\text{ Coverage}$: **89.6%** (Target $90.0\%$)
- **Fuel Savings Derivation**:
  $$\text{Daily Fuel Saved} = 10,000 \text{ trips/day} \times 1.25\text{ km/trip} \times 0.30\text{ L/km} = \mathbf{3,750\text{ Liters/day}}$$

---

## 6. How to Run the System

```bash
# Terminal 1 — Start FastAPI Backend
uvicorn services.backend.main:app --reload --port 8000

# Terminal 2 — Start React Control Center UI
npm run dev

# Terminal 3 — Run Integration Test Suite
python -m pytest tests/test_v2_decision_engine.py
```

- **Swagger API Docs**: `http://localhost:8000/docs`
- **React Command Center UI**: `http://localhost:5173`

