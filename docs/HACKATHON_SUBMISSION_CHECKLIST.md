# 📋 WeMakeDevs × AWS Environmental Hacks 2026 — Submission Checklist

**Team**: Trust Builders  
**Institution**: AMC Engineering College  
**Selected Track**: **Track 03 — Waste and Energy**  
**Subtrack**: **Public Transport & Green Transit Operations**  
**Submission Date**: October 11, 2026  

---

## 1. Official Deliverables & Media Links Verification

- [x] **🌟 AI Concept & Idea Explanation Video (Core Highlight)**:
  - Link: [YouTube AI Video](https://youtu.be/WE_v0WWnrbw)
  - Content: Visual AI explanation of Sanchara Vyuha multi-stream telemetry, dynamic short-turning, and carbon accounting.
- [x] **🎥 Prototype Explanation Video**:
  - Link: [YouTube Prototype Walkthrough](https://youtu.be/Fyf3-KiufVw)
  - Content: End-to-end platform demonstration showing live bus tracking, YOLO passenger counting, holding bay allocation, and sustainability dashboard.
- [x] **📊 Presentation Deck (PPT)**:
  - Link: [Google Drive PPT Pitch Deck](https://drive.google.com/file/d/1B5uk_gHGnL9AhauX4m3sGhapFinYeZjr/view?usp=drive_link)
  - Content: Pitch deck detailing problem statement, market feasibility, technical architecture, and ₹12.58 Cr ROI.
- [x] **📄 Project Report (PDF)**:
  - Link: [Google Drive Report PDF](https://drive.google.com/file/d/1j_HOolP42qlp1VSGBdOxcd8Q6JdS6hKd/view?usp=drive_link)
  - Content: Full technical dossier, empirical latency validations, and mathematical proofs.
- [x] **📁 Complete Project Necessary Documents**:
  - Link: [Google Drive Main Folder](https://drive.google.com/drive/folders/1LMqwpvHnm5mxI-bbT1_n_KOBdZsP6mWw?usp=sharing)
  - Content: Master archive containing all schematics, diagrams, datasets, and presentation assets.

---

## 2. Technical Implementation Checklist

- [x] **Track 03 Alignment (Waste & Energy)**:
  - Physical carbon accounting engine based on Central Pollution Control Board (CPCB: $2.68\text{ kg CO}_2/\text{L}$ diesel) and Central Electricity Authority (CEA India: $0.72\text{ kg CO}_2/\text{kWh}$ grid EV).
  - Reduction of $14.8\%$ unoptimized transit deadhead mileage.
  - Annualized abatement of $412.8\text{ Metric Tons CO}_2\text{e}$.
- [x] **Native AWS Cloud Integration**:
  - Amazon S3 bucket (`sanchara-vyuha-audit-archive-2026`) for immutable carbon audit archival.
  - Amazon CloudWatch (`SancharaVyuha/PublicTransport`) for operational metric telemetry.
  - Zero-crash local mock fallback adapter for offline evaluation.
- [x] **Full-Stack Execution & Testing**:
  - 31 out of 31 backend Pytest automated tests passing (`pytest tests/ -v`).
  - Production Vite frontend build passes in < 5 seconds (`npm run build`).
- [x] **Mathematical Optimization & AI**:
  - LightGBM Quantile Regressor ($P10/P50/P90$ surge bounds).
  - TreeSHAP sub-10ms explainability.
  - Google OR-Tools 7-Gate Mixed-Integer Linear Programming (MILP) solver.

---

## 3. Team Information

- **Institution**: AMC Engineering College, Bengaluru
- **Team Name**: **Trust Builders**
- **Members**:
  1. **Bhuvan Gowda H K** — System Modeling, Sensor Fusion, Data Processing & Field Testing
  2. **Dhanush A G** — Lead System Architect, Centralized AI Engine, MILP Solver, AWS Cloud Architecture & Backend
