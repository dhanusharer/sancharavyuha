# 🕒 Sanchara Vyuha — End-to-End "Day in the Life" Operational Demonstration

This document presents a complete 24-hour simulation of transit operations along the BMTC Route 365J corridor (Majestic to Electronic City), demonstrating how the Decision Intelligence Engine transforms changing operational conditions into policy-governed dispatches.

---

## 🎬 24-Hour Timeline of Operations & Decisions

```
                           24-Hour Operational Timeline
                           
   06:00          08:15          09:40          10:30          12:00          16:45          18:10          22:00
  Low Demand   Office Peak    Heavy Rain      Accident     Festival Surge  Camera Failure  Evening Peak   Normalization
      │              │              │              │              │              │              │              │
   Standby       Option A       Option A       Option B       Option A       Fallback UI     Option A       Standby
```

---

### Timeline Events & Decision Packages

#### 1. 06:00 — Low Early Morning Demand
- **Operational Context**: `Off-Peak`, `Normal Weather`, `Clear Traffic`
- **Telemetry**: Queue = 35 pax, CCTV = 30 pax, Delay = 0m
- **Forecast**: $P10 = 25$, $P50 = 35$, $P90 = 44$ pax
- **Trigger Engine**: Dual Trigger `FAILED` ($P50 \le 120$)
- **Action**: **Standby (No Action)**
- **Rationale**: Demand is well within scheduled fleet capacity. Avoiding unnecessary dispatch saves fuel.

---

#### 2. 08:15 — Morning Office Rush Surge
- **Operational Context**: `Peak Rush`, `High Demand Corridor Node`, `Clear Traffic`
- **Telemetry**: Queue = 210 pax at Silk Board, CCTV = 185 pax, Delay = +12m
- **Forecast**: $P10 = 158$, $P50 = 210$, $P90 = 262$ pax
- **Trigger Engine**: Dual Trigger `PASSED` ($P50 > 120 \land P90 > 175$)
- **Policy Audit**: All 5 Policy Domains `PASS` (Driver shift 5.2h $<8\text{h}$, EV SoC 82% $\ge 20\%$, Depot Reserve 4 $\ge 3$)
- **Options Trade-off**:
  - **Option A (Dispatch Spare EV Bus 365J-SP42)**: Utility = **$92.4/100$** | Wait Cut = $-18.5\text{m}$ | Fuel = $0\text{L}$
  - **Option B (Short-Turn BS-VI Bus 365J-04)**: Utility = $72.1/100$ | Wait Cut = $-14.0\text{m}$ | Fuel = $12.5\text{L}$
  - **Option C (No Action)**: Utility = $21.0/100$ | Wait Cut = $0.0\text{m}$ | Policy = `BLOCKED`
- **Operator Decision**: **APPROVED OPTION A**
- **Outcome**: 210 passengers cleared in 12 minutes; zero carbon emissions.

---

#### 3. 09:40 — Heavy Rain Emergency
- **Operational Context**: `Heavy Rain Emergency`, `Peak Rush`, `High Traffic Congestion`
- **Telemetry**: IMD Rain Alert Active (+35 pax impact), Queue = 240 pax, Traffic Delay = +18m
- **Context Weights**: Dynamic adjustment ($\alpha_{\text{wait}} = 0.85$, $\beta_{\text{fuel}} = 0.05$, $\gamma_{\text{risk}} = 0.10$)
- **Action**: **APPROVED OPTION A (EV Dispatch)**
- **Outcome**: Overcrowding prevented despite heavy downpour; priority safety weighting protected commuters.

---

#### 4. 10:30 — Hosur Road Traffic Accident
- **Operational Context**: `High Traffic Congestion`, `Accident Bottleneck`
- **Telemetry**: Corridor traffic delay breaches +25 minutes; full-route dispatch risk elevated.
- **Action**: **APPROVED OPTION B (Short-Turn Bus 365J-04 at Shanthinagar)**
- **Rationale**: Short-turning at Shanthinagar bypasses the Hosur Road bottleneck, recovering schedule frequency downstream.

---

#### 5. 12:00 — Festival Peak Crowd Surge
- **Operational Context**: `Festival Surge`, `Off-Peak Hours`
- **Telemetry**: Queue = 280 pax at Silk Board, CCTV = 250 pax
- **Action**: **APPROVED OPTION A (EV Spare Dispatch)**
- **Outcome**: High utility score ($91.8/100$); queue cleared rapidly.

---

#### 6. 16:45 — CCTV Camera Stream Failure
- **Operational Context**: `Degraded Telemetry`, `Camera Feed Offline`
- **Telemetry**: CCTV camera delay $>300\text{s}$; `DataQualityScore` drops to $80\%$.
- **Fallback Activated**: System automatically switches to **ETM Electronic Ticket Gate Count Scaling** fallback.
- **Action**: Decision generation continues without interruption using ETM scanning telemetry.

---

#### 7. 18:10 — Evening Peak Rush
- **Operational Context**: `Peak Rush`, `Office Exit Surge`
- **Telemetry**: Queue = 225 pax, CCTV = 200 pax
- **Action**: **APPROVED OPTION A (EV Spare Dispatch)**
- **Outcome**: Evening commuters served promptly; on-time performance maintained at $94.2\%$.

---

#### 8. 22:00 — Night Operations Normalization
- **Operational Context**: `Late Night`, `Low Demand`
- **Context Weights**: $\alpha_{\text{wait}} = 0.20$, $\beta_{\text{fuel}} = 0.70$ (Maximize fuel savings)
- **Action**: **Standby (No Action)**

---

## 📊 Auto-Generated 24-Hour Operations Summary Report

```text
================================================================================
SANCHARA VYUHA — 24-HOUR OPERATIONAL PERFORMANCE REPORT
Corridor: BMTC Route 365J (Majestic to Electronic City) | Date: 2026-10-11
================================================================================

MISSION & DECISION SUMMARY
--------------------------------------------------------------------------------
Total Decision Packages Generated : 18
Total Decisions Approved          : 17 (94.4% Acceptance Rate)
Total Decisions Rejected          : 1
Average Decision Latency          : 18.4 ms
Average Utility Score             : 92.4 / 100
Average Decision Confidence       : 96.2%

OPERATIONAL KPI IMPACT
--------------------------------------------------------------------------------
Estimated Passenger Wait Cut      : -18.5 mins / surge
Estimated Daily Diesel Fuel Saved : 3,750 Liters
Estimated Daily CO2 Reduced       : 10,030 kg

POLICY & SAFETY AUDIT
--------------------------------------------------------------------------------
Total Safety Policy Checks        : 90
Total Policy Violations           : 0 (0.0% Violation Rate)
Depot Reserve Violation Count     : 0
Driver Shift Limit Exceeded       : 0

SYSTEM RESILIENCE & FALLBACKS
--------------------------------------------------------------------------------
CCTV Camera Fallback Activations  : 1 (ETM Scaling Active)
Weather API Fallback Activations  : 0 (API Healthy)
GTFS-RT Fallback Activations      : 0 (Feed Fresh)
================================================================================
```
