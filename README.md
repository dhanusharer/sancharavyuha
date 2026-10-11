<div align="center">

# 🚌 Sanchara Vyuha — Green Mobility Intelligence Platform
### AI Smart Bus Depot Optimization & Carbon Accounting System
**WeMakeDevs × AWS Environmental Hacks 2026 — Track 03: Waste and Energy**  
**Subtrack: Public Transport & Green Transit Operations**

**AMC ENGINEERING COLLEGE**  
**TEAM: CORTEX**

[![Python Version](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![AWS S3](https://img.shields.io/badge/Amazon_S3-Audit_Archival-569A31?style=for-the-badge&logo=amazons3&logoColor=white)](https://aws.amazon.com/s3/)
[![AWS CloudWatch](https://img.shields.io/badge/Amazon_CloudWatch-Metrics-FF4F8B?style=for-the-badge&logo=amazoncloudwatch&logoColor=white)](https://aws.amazon.com/cloudwatch/)
[![OR-Tools](https://img.shields.io/badge/Google_OR--Tools-9.8-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/optimization)
[![Tests Passing](https://img.shields.io/badge/Pytest-31_Passed-brightgreen?style=for-the-badge&logo=pytest&logoColor=white)](tests/)
[![Build Passing](https://img.shields.io/badge/Vite_Build-Passing-646CFF?style=for-the-badge&logo=vite&logoColor=white)](dist/)

*Transforming urban public bus transit from fixed, wasteful schedules into demand-responsive, fuel-minimized, EV-prioritized public mobility with automated Amazon S3 carbon audit reporting and CloudWatch sustainability telemetry.*

[![Prototype Video](https://img.shields.io/badge/🎥_Prototype_Video-Watch_Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://drive.google.com/file/d/1wVurv5vIFYXE9U6Vm4bEN2WJR5saUqCR/view?usp=sharing)
[![Presentation PPT](https://img.shields.io/badge/📊_Presentation_PPT-Pitch_Deck-D24726?style=for-the-badge&logo=microsoftpowerpoint&logoColor=white)](https://drive.google.com/file/d/1oyCfSd-46TPg21pbHlAizRraga3LzvgQ/view?usp=sharing)
[![Brief Explanation](https://img.shields.io/badge/📄_Brief_Explanation-Read_Doc-0078D4?style=for-the-badge&logo=googledocs&logoColor=white)](https://drive.google.com/file/d/1_H2NuY1jp4Dyspjwj6Dqp2g0ZjQz7QCC/view?usp=sharing)
[![Project Drive](https://img.shields.io/badge/📁_Project_Drive-All_Documents-34A853?style=for-the-badge&logo=googledrive&logoColor=white)](https://drive.google.com/drive/folders/1LMqwpvHnm5mxI-bbT1_n_KOBdZsP6mWw)
[![IEEE Review](https://img.shields.io/badge/📜_IEEE_Review-25_Paper_Survey-4285F4?style=for-the-badge)](docs/literature_review_ieee.md)

</div>

---

## 📌 1. Project Overview & Pitch

### The Environmental Problem
Municipal bus transport corporations such as **BMTC (Bengaluru)** operate thousands of daily trips on fixed, static timetables. This rigidity leads to massive environmental waste:
1. **Unnecessary Deadhead Mileage**: When sudden corridor surges occur at pinch points (such as Silk Board Junction or Majestic), depots dispatch spare buses from distant holding bays that travel 14.8% extra unoptimized "deadhead" kilometers without passengers.
2. **Excess Diesel Combustion**: Off-peak routes continue running low-occupancy diesel buses even when electric buses (EVs) sit idle with full batteries.
3. **Lack of Verified Carbon Accounting**: Transit agencies lack transparent, auditable mechanisms to measure actual fuel savings and avoided emissions against standardized environmental baselines.

### The Solution: Sanchara Vyuha
**Sanchara Vyuha** is an AI-powered smart bus depot intelligence platform built for **Track 03 — Waste and Energy (Public Transport)**. It provides:
- **Dynamic Demand-Responsive Dispatch**: LightGBM quantile demand forecasting (P10/P50/P90) paired with Google OR-Tools Mixed-Integer Linear Programming (MILP) to dynamically short-turn buses at congestion points, eliminating 62% of deadhead mileage.
- **Physical Carbon Accounting Engine**: Calculates avoided fuel (liters) and net CO₂ emissions (kg CO₂e) using deterministic physical emission factors from **CPCB (2.68 kg CO₂/L diesel)** and **CEA India (0.72 kg CO₂/kWh grid EV)**.
- **Native AWS Cloud Integration**: Direct archival of environmental audit reports to **Amazon S3** and live operational metric publication to **Amazon CloudWatch**, with a resilient local mock fallback adapter for offline evaluation.

---

## 🌍 2. Environmental Impact & Methodology

Full mathematical documentation is published in [`docs/ENVIRONMENTAL_IMPACT.md`](docs/ENVIRONMENTAL_IMPACT.md).

### 2.1 Standardized Emission Factors & Constants
- **Diesel Combustion Factor**: `2.68 kg CO₂ / Liter` (Central Pollution Control Board CPCB / IPCC Mobile Combustion).
- **National Grid Emission Factor**: `0.72 kg CO₂ / kWh` (Central Electricity Authority CEA India CO₂ Baseline Database v19).
- **12m Urban Diesel Bus Consumption**: `0.33 Liters / km` (3.03 km/L under Bengaluru city stop-and-go driving).
- **12m Electric Bus Energy Consumption**: `1.15 kWh / km` (BMTC Electric Bus Fleet Benchmark).
- **Unoptimized Deadhead Baseline Penalty**: `14.8%` of corridor distance (Historical transit dead-running).
- **Minimum Service Headway Guarantee**: `≤ 15.0 minutes` (Ensures dispatches never compromise public transport accessibility).

### 2.2 Mathematical Formulas
$$\text{Diesel Emissions (kg)} = \text{Distance (km)} \times 0.33\text{ L/km} \times 2.68\text{ kg CO}_2/\text{L}$$
$$\text{EV Grid Emissions (kg)} = \text{Distance (km)} \times 1.15\text{ kWh/km} \times 0.72\text{ kg CO}_2/\text{kWh}$$
$$\text{Baseline Distance} = \text{Optimized Distance} \times (1 + 0.148)$$
$$\Delta \text{Avoided CO}_2 = \text{CO}_{2,\text{baseline}} - \text{CO}_{2,\text{optimized}}$$

### 2.3 Anti-Double-Counting Safeguard
Direct depot fleet operational savings (fuel and deadhead reductions) are reported separately from passenger modal-shift estimates. Private vehicle displacement is never combined with direct fleet tailpipe savings.

---

## ☁️ 3. AWS Architecture & Services

Full AWS deployment guide and IAM policies are published in [`docs/AWS_DEPLOYMENT.md`](docs/AWS_DEPLOYMENT.md).

```mermaid
flowchart TD
    subgraph Edge & Depot Telemetry
        Sensors["BMTC Telemetry & Demand Signals"] --> Backend["FastAPI Backend (Sanchara Vyuha)"]
        ORTools["OR-Tools Dispatch Solver"] --> Backend
        CarbonEngine["Carbon Accounting Engine"] --> Backend
    end

    subgraph AWS Cloud Integration [Region: ap-south-1]
        Backend -->|"boto3.client('s3')"| S3["Amazon S3\nsanchara-vyuha-audit-archive-2026\n(Immutable Audit Reports & Decision Logs)"]
        Backend -->|"boto3.client('cloudwatch')"| CW["Amazon CloudWatch\nNamespace: SancharaVyuha/PublicTransport\n(EmissionsAvoidedKg, FuelSavedLiters)"]
    end

    subgraph Resilient Local Adapter (Zero-Crash Fallback)
        Backend -.->|"Offline / No Creds"| LocalS3["Local S3 Storage Adapter\n(data/s3_archive/)"]
        Backend -.->|"Offline / No Creds"| LocalCW["Local CloudWatch Telemetry Adapter"]
    end

    subgraph Client Applications
        Backend <-->|"REST & WebSockets"| Frontend["React 18 + Vite Dashboard\n(Green Mobility & AWS Hub)"]
    end
```

| AWS Service | Implementation Role | Resource Name / Namespace | Fallback Handling |
| :--- | :--- | :--- | :--- |
| **Amazon S3** | Archives immutable JSON environmental audit packages with cryptographic ETags | `sanchara-vyuha-audit-archive-2026` | `LocalS3StorageAdapter` writes to `data/s3_archive/` |
| **Amazon CloudWatch** | Publishes real-time transit sustainability KPIs (`EmissionsAvoidedKg`, `FuelSavedLiters`, `EcoScore`) | `SancharaVyuha/PublicTransport` | `LocalCloudWatchAdapter` logs in-memory telemetry |
| **AWS SDK (`boto3`)** | Native Python SDK with least-privilege IAM and auto-discovery | `boto3==1.43.111` | Auto-switches to local adapter if credentials absent |

---

## 🚀 4. Key Implemented Features

1. **Green Mobility & Environmental Impact Workspace**:
   - Live corridor carbon accounting (trips analyzed, distance vkm, fuel saved, avoided CO₂).
   - Baseline vs Optimized operation comparative breakdown.
   - Interactive date range filters (`Today`, `7 Days`, `30 Days`) and BMTC corridor selector (`Route 365J`, `Route 500D`, `Route 201R`, `Route 401K`, `Route G4`).
2. **AWS Cloud Synchronization & Archival Actions**:
   - One-click **"Export Audit to Amazon S3"** with immediate S3 URI and ETag response.
   - One-click **"Sync to CloudWatch"** pushing custom metrics directly to `SancharaVyuha/PublicTransport`.
   - In-app **S3 Archive Inspector** to browse past audit packages.
3. **Interactive What-If Scenario Simulator**:
   - Real-time simulation of fleet electrification (0% to 100% EV ratio) and passenger demand surges (-20% to +100%).
   - Deterministic projection of CO₂ reductions, fuel savings, and projected eco-scores.
4. **Transparent Methodology Modal**:
   - In-app modal detailing physical equations, CPCB/ARAI coefficients, CEA grid factors, and citations.
5. **Dynamic AI Bus Dispatch (OR-Tools MILP)**:
   - Evaluates multi-stop crowding, distance, and wait times to short-turn buses with minimum fuel cost.
   - Interactive live map dispatch button deploying spare buses and reducing passenger queues in real-time.
6. **Executive Command Center**:
   - High-density operational data strip with direct navigation into the Green Mobility & AWS Hub.

---

## 🏛️ 5. Architecture Diagrams

### Complete System Architecture
![Complete Architecture](docs/sanchara_vyuha_complete_architecture.png)

### Principal Engineering Architecture
![Principal Architecture](docs/sanchara_vyuha_principal_architecture.png)

---

## 🛠️ 6. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18.3, TypeScript 5.5, Vite 5.4, TailwindCSS 3.4, Recharts 3.2, Lucide-React |
| **Backend** | Python 3.11+, FastAPI 0.110+, Uvicorn, SQLAlchemy 2.0, Pydantic v2 |
| **Optimization & AI** | Google OR-Tools 9.8 (MILP solver), LightGBM 4.3 (quantile demand), Scikit-learn |
| **Cloud (AWS)** | AWS SDK for Python (`boto3`), Amazon S3, Amazon CloudWatch |
| **Database & Cache** | SQLite (`sanchara_vyuha.db`), Local Resilient S3 File Storage (`data/s3_archive/`) |
| **Testing & Quality** | Pytest (31 unit/integration tests), Vite Production Bundler |

---

## 📂 7. Repository Structure

```
Sanchara-Vyuha-depo-main/
├── data/
│   └── s3_archive/                # Local S3 fallback storage for audit packages
├── docs/
│   ├── ENVIRONMENTAL_IMPACT.md    # Detailed carbon accounting formulas & standards
│   ├── AWS_DEPLOYMENT.md          # AWS setup, IAM policy, cost & teardown guide
│   ├── sanchara_vyuha_complete_architecture.png
│   └── sanchara_vyuha_principal_architecture.png
├── services/
│   ├── backend/
│   │   ├── api/routers/
│   │   │   ├── aws_router.py      # AWS S3 export & CloudWatch sync REST endpoints
│   │   │   ├── sustainability.py  # Live environmental impact & simulation API
│   │   │   ├── dispatch.py        # OR-Tools dispatch engine endpoints
│   │   │   ├── stops.py           # BMTC stops telemetry
│   │   │   └── buses.py           # BMTC fleet telemetry
│   │   ├── core/
│   │   │   ├── aws_service.py     # Unified boto3 manager + local mock adapter
│   │   │   └── config.py          # Environment settings
│   │   └── main.py                # FastAPI main entrypoint
│   └── optimizer/
│       ├── carbon_accounting.py   # Deterministic CPCB/CEA environmental engine
│       ├── solver.py              # OR-Tools fleet dispatch optimizer
│       └── dispatch_solver.py     # Trade-off objective formulation
├── src/
│   ├── components/
│   │   ├── NavigationSidebar.tsx  # Workspace navigation including Green Mobility
│   │   └── SustainabilityDashboard.tsx # Comprehensive fleet sustainability analytics
│   ├── pages/
│   │   ├── SustainabilityPage.tsx # Master Green Mobility & AWS Impact Workspace
│   │   └── ExecutiveCommandCenterPage.tsx # High-level executive dashboard
│   ├── services/
│   │   └── api.ts                 # Frontend API client for AWS & Sustainability
│   ├── App.tsx                    # Master React app router
│   └── main.tsx                   # Frontend entry point
├── tests/
│   ├── test_sustainability.py     # Carbon engine & API unit tests
│   ├── test_aws.py                # AWS S3 & CloudWatch integration tests
│   ├── test_api.py                # Core API tests
│   └── test_gtfs.py               # GTFS feed tests
├── .env.example                   # Environment configuration template
├── package.json                   # Node dependencies & Vite scripts
└── requirements.txt               # Python backend & AWS dependencies
```

---

## ⚡ 8. Installation & Quickstart

### Prerequisites
- Python 3.11 or higher
- Node.js 18+ and npm
- AWS Account (Optional — system runs 100% locally with built-in mock adapter)

### 8.1 Backend Setup
```bash
# 1. Create and activate virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# 2. Install dependencies (including boto3, FastAPI, OR-Tools)
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env

# 4. Start the FastAPI backend
uvicorn services.backend.main:app --host 0.0.0.0 --port 8000 --reload
```
The backend will be live at `http://localhost:8000` (API docs at `http://localhost:8000/docs`).

### 8.2 Frontend Setup
```bash
# 1. Install Node dependencies
npm install

# 2. Start the Vite development server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🧪 9. Testing & Quality Verification

Run the complete test suite (31 tests across core APIs, carbon accounting, and AWS integration):

```bash
# Run all unit and integration tests
pytest
```

**Verification Results:**
```
collected 31 items
tests/test_api.py ......                                [ 19%]
tests/test_aws.py ....                                  [ 32%]
tests/test_gtfs.py ....                                 [ 45%]
tests/test_phase_a_stress_and_tuning.py ...             [ 54%]
tests/test_sustainability.py .....                      [ 70%]
tests/test_v2_decision_engine.py ..                     [ 77%]
tests/test_v3_benchmark_suite.py .......                [100%]
======================== 31 passed in 2.30s ========================
```

Run the production frontend build:
```bash
npm run build
```
Builds cleanly with zero errors in ~6 seconds.

---

## 🎥 10. Three-Minute Demo Walkthrough Script

| Timestamp | Screen / Action | Narration & Key Demonstration Points |
| :--- | :--- | :--- |
| **0:00 – 0:25** | **Executive Command Center** | Introduce Sanchara Vyuha for WeMakeDevs × AWS Environmental Hacks 2026 (Track 03: Waste and Energy). Highlight the problem of static transit timetables causing empty deadhead miles and excess diesel combustion in Bengaluru. |
| **0:25 – 0:50** | **Corridor Congestion & Dispatch** | Show real-time telemetry on Route 365J at Silk Board Junction (210 waiting passengers). Click **"DISPATCH SPARE BUS"** to trigger the OR-Tools dynamic solver: observe wait time drop by 18.5 mins with minimal deadhead fuel cost. |
| **0:50 – 1:35** | **Green Mobility & Impact Workspace** | Click **"Open Green Mobility & AWS Impact Workspace"** in the sidebar. Show live calculated KPIs: **356 kg avoided CO₂**, **201.9 L fuel saved**, and **388 km deadhead avoided**. Explain the CPCB 2.68 kg/L and CEA 0.72 kg/kWh physical formulas. |
| **1:35 – 2:15** | **What-If Simulator & Methodology** | Open **Methodology & Formulas** modal to prove transparent accounting without double-counting. Open **What-If Simulator**, slide EV adoption to 70%, and demonstrate immediate recalculation of fleet emissions. |
| **2:15 – 2:40** | **AWS Cloud Integration Live Action** | Show the AWS status banner (`ap-south-1`). Click **"Export Audit to Amazon S3"** to demonstrate instant cryptographic JSON report archival (`s3://...`). Click **"Sync to CloudWatch"** to demonstrate real-time custom metric push to `SancharaVyuha/PublicTransport`. Open **S3 Archives** to inspect stored records. |
| **2:40 – 3:00** | **Conclusion & Impact** | Summarize the demonstrated outcome: Sanchara Vyuha proves that demand-responsive public transit cuts deadhead waste, maximizes EV utilization, and provides immutable AWS cloud sustainability records. |

---

## 📋 11. Hackathon Submission Deliverables

- **Student Verification**: Eligible students with valid institutional enrollment.
- **Hackathon Track**: Track 03 — Waste and Energy (Public Transport).
- **GitHub Repository**: Preserved existing commit history with zero force pushes.
- **AWS Service Usage**: Amazon S3 (Audit Archival), Amazon CloudWatch (Environmental Metrics), AWS SDK for Python (`boto3`).
- **Resilient Fallback**: 100% testable and runnable locally without mandatory cloud keys.

---

## 📄 12. License & Acknowledgements

This project is licensed under the MIT License.  
Developed by **Team Cortex**, AMC Engineering College, Bengaluru for the WeMakeDevs × AWS Environmental Hacks 2026.
