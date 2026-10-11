# 🎨 Sanchara Vyuha — AI-TOS Global Frontend Architecture & Design Specification

> **Philosophy**: The frontend is an **Operational Decision Workspace**, not a visualization dashboard.  
> **Order of Information**: Mission $\rightarrow$ Situation $\rightarrow$ Evidence $\rightarrow$ Decision $\rightarrow$ Action $\rightarrow$ Outcome  
> **Visual System**: Monochrome shadcn/ui Clinical Blueprint (`#F5F5F5` canvas, `#FFFFFF` paper cards, `#111827` ink, `#E5E7EB` hairline borders, Inter geometric font)  

---

## 🏛️ 1. Workspace-Centric Persona Mapping

The application is structured into 8 distinct **Operational Workspaces**, each tailored to a specific persona's primary job to be done:

| Persona | Primary Workspace | Core Function & Job to be Done |
| :--- | :--- | :--- |
| **Dispatcher** | **Operations Workspace** | Live corridor telemetry, CCTV gate counts, bus fleet positions, active mission queue |
| **Supervisor** | **Decision Intelligence Workspace** | Supervisory decision packages, multi-option trade-off matrix (Options A/B/C), utility scorecards, counterfactuals |
| **Operations Manager** | **Network Analytics Workspace** | Wait reduction trends, daily fuel savings, ISO 14064 carbon cuts, corridor punctuality rates |
| **Platform Engineer** | **Monitoring Workspace** | Layer 1 infrastructure monitoring (CPU, RAM, DB) & Layer 2 distributed trace breakdown ($31\text{ms}$) |
| **ML Engineer** | **ML Operations Workspace** | LightGBM quantile regression calibration ($P10/P50/P90$), SHAP drivers, feature store, drift detector, model registry |
| **Investigator** | **Audit Workspace** | Forensic post-mortem decision audit log (`decision_audit_log` SQLite DB), full trace replay |
| **Executive** | **Executive Workspace** | High-level corridor ROI metrics, sustainability scorecards, quarterly service level agreements |
| **Administrator** | **Administration Workspace** | User role management (RBAC), API keys, policy threshold calibration, external integration settings |

---

## 🧭 2. Global Navigation & Layout System

```text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ Top Header: Mission Search | Route Search | Global Alerts | Operator Profile | Refresh │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ Breadcrumb: Operations > Mission 365J-014 > Decision Package DISP-2026-069 > Option A   │
├─────────────┬───────────────────────────────────────────────────────────────────────────┤
│ Left Sidebar│                                                                           │
│ Persistent  │                       Active Persona Workspace View                       │
│             │                                                                           │
│ • Logo      │  • Level 1: Mission, Alert, Decision (24px - 32px Font)                  │
│ • Operations│  • Level 2: KPIs, Forecast, Policy Audit (18px Font)                      │
│ • Decision  │  • Level 3: Corridor SVG Map, Quantile Bars (14px Font)                   │
│ • Analytics │  • Level 4: Metadata, IDs, Timestamps (12px Font)                         │
│ • Monitoring│                                                                           │
│ • ML Ops    │                                                                           │
│ • Audit     │                                                                           │
│ • Executive │                                                                           │
│ • Admin     │                                                                           │
└─────────────┴───────────────────────────────────────────────────────────────────────────┘
```

---

## 💅 3. Clinical Blueprint Color & Design System Tokens

- **Page Canvas**: `#F5F5F5` (`--color-canvas`)
- **Paper Cards**: `#FFFFFF` (`--color-paper`)
- **Primary Ink**: `#111827` (`--color-ink`)
- **Mid Gray Text**: `#737373` (`--color-mid-gray`)
- **Hairline Border**: `#E5E7EB` (`--color-hairline`)
- **Status Accent Colors** (Strictly for status cues, never decoration):
  - **Success (Green)**: `#059669` (Policy Pass / Executed)
  - **Information (Blue)**: `#2563EB` (Forecast / Telemetry)
  - **Warning (Orange)**: `#D97706` (Moderate Risk / Elevating Queue)
  - **Critical (Red)**: `#E7000B` (Policy Violation / Overcrowding Emergency)

---

## ⚡ 4. Real-Time Data Refresh Strategy

| Data Domain | Update Mechanism | Refresh Frequency | Workspace Consumer |
| :--- | :--- | :--- | :--- |
| **Active Missions** | WebSockets (SSE Fallback) | Real-time (Instant) | Operations & Decision Workspaces |
| **Alerts & Crowd Spikes** | WebSockets | Real-time (Instant) | Global Header & Monitoring |
| **Fleet Positions & SoC** | WebSockets | Real-time (Instant) | Operations Workspace |
| **System Latency & Monitoring** | Polling | Every $5\text{--}10\text{ seconds}$ | Monitoring & MLOps |
| **Historical Analytics** | Polling | Every $30\text{--}60\text{ seconds}$ | Analytics Workspace |
| **Executive Governance** | Polling | Every $5\text{--}15\text{ minutes}$ | Executive Workspace |

---

## ⚡ 5. Performance Targets

- **Initial Load Time**: $< 2.0\text{ seconds}$
- **Workspace Switch**: $< 200\text{ ms}$
- **Route / Mission Change**: $< 300\text{ ms}$
- **WebSocket Update Render**: $< 100\text{ ms}$
- **Table / Audit Filtering**: $< 50\text{ ms}$
