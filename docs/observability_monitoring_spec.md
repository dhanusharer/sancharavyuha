# 👁️ Sanchara Vyuha — 2-Layer Monitoring & Observability Specification

This document details the enterprise 2-Layer Observability & Monitoring Architecture for Sanchara Vyuha, distinguishing between **Layer 1 Monitoring** (*"Is the system healthy?"*) and **Layer 2 Observability** (*"Why is it wrong?"*).

---

## 🏛️ 2-Layer Architectural Framework

```
                          2-Layer Observability Architecture
                          
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Layer 1 — Monitoring ("Is the system healthy?")                                 │
│  • Infrastructure: CPU (14.5%), RAM (182MB), SQLite (Connected)                  │
│  • External Dependencies: Weather API (220ms), Traffic API (180ms), GTFS (8.2s) │
│  • ML & Solver Health: MAE (29.54), Pinball Loss (14.77), Solver Time (9.8ms)   │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │
┌────────────────────────────────────────▼────────────────────────────────────────┐
│ Layer 2 — Observability ("Why is it wrong?")                                    │
│  • Distributed Trace Breakdown: 31ms Total Pipeline Latency                      │
│  • Structured JSON Logs: decision_id, mission_id, forecast_p50/p90, policy_passed │
│  • Alerting Rules Engine: Warning vs Critical Threshold Evaluation             │
│  • 5-Category Metric Dashboards: Business, ML, Decision, Reliability, Safety     │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Layer 1 — Monitoring ("Is the system healthy?")

Exposed via `/api/v1/health/monitoring`:
- **Infrastructure**: CPU utilization ($14.5\%$), RAM footprint ($182.4\text{ MB}$), SQLite connection status (`Connected`).
- **External Dependency Health**:
  - **IMD Weather API**: Healthy ($220\text{ms}$ latency, Fallback: Cached baseline).
  - **TomTom Traffic Index API**: Healthy ($180\text{ms}$ latency, Fallback: GTFS-RT speed estimation).
  - **GTFS-Realtime Protobuf Feed**: Healthy ($8.2\text{s}$ freshness, Fallback: Scheduled timetable).
  - **CCTV ByteTrack Streams**: Healthy ($12.0\text{ms}$ processing latency, Fallback: ETM Ticket Scaling).

---

## 🔬 Layer 2 — Observability ("Why is it wrong?")

Exposed via `/api/v1/health/observability`:

### 1. Distributed Trace Breakdown ($31\text{ ms}$ Total Latency)
```text
Request Received          [ 4.0 ms ]
Context Builder           [ 2.0 ms ]
Data Quality Engine       [ 1.0 ms ]
LightGBM Forecast         [ 6.0 ms ]
Policy Engine             [ 2.0 ms ]
Risk Engine               [ 1.0 ms ]
Utility Engine            [ 1.0 ms ]
OR-Tools MILP Solver      [ 11.0 ms]
Decision Package          [ 3.0 ms ]
------------------------------------
Total Response Latency    [ 31.0 ms]
```

### 2. Standardized Structured JSON Log Schema
```json
{
  "timestamp": "2026-10-11T11:15:00Z",
  "level": "INFO",
  "logger": "sanchara_vyuha",
  "message": "Decision Package DISP-2026-069 synthesized successfully.",
  "decision_id": "DISP-2026-069",
  "mission_id": "MISSION-365J-014",
  "route": "365J",
  "forecast_p50": 210,
  "forecast_p90": 262,
  "policy_passed": true,
  "solver_latency_ms": 11.0,
  "decision_latency_ms": 18.4,
  "recommended_option": "A"
}
```

### 3. Categorized Metric Dashboards (5 Dimensions)
1. **Business Metrics**: Total missions ($18$), Accepted recommendations ($17$), Wait reduction ($-18.5\text{m}$), Fuel saved ($3,750\text{ L}$), $\text{CO}_2$ cut ($10,030\text{ kg}$).
2. **ML Metrics**: MAE ($29.54$), MAPE ($10.89\%$), Pinball Loss ($14.77$), $P90$ Calibration ($91.2\%$), Drift KS Score ($0.042$).
3. **Decision Metrics**: Decision latency ($18.4\text{ms}$), Forecast latency ($7.2\text{ms}$), Policy latency ($2.0\text{ms}$), Solver latency ($9.8\text{ms}$).
4. **Reliability Metrics**: Camera uptime ($99.8\%$), GTFS freshness ($8.2\text{s}$), Weather freshness ($45\text{s}$), Traffic freshness ($30\text{s}$).
5. **Safety Metrics**: Policy violations ($0$), Constraint violations ($0$), Emergency dispatches ($3$), Manual overrides ($1$).

---

## 🚨 Alerting Rules Engine

Exposed via `/api/v1/health/alerts`:

| Condition | Threshold | Severity | System Action |
| :--- | :--- | :--- | :--- |
| **Decision Latency** | $> 50\text{ ms}$ | **WARNING** | Scale FastAPI worker thread pool |
| **Camera Feed Offline** | $> 300\text{ s}$ ($5\text{ min}$) | **CRITICAL** | Activate ETM Ticket Scanning Fallback |
| **GTFS Feed Stale** | $> 30\text{ s}$ | **WARNING** | Fallback to GTFS static timetable schedule |
| **Forecast Failure Rate** | $> 5.0\%$ | **CRITICAL** | Activate historical profile baseline |
| **Policy Engine Exception**| Exception Thrown | **CRITICAL** | Block auto-dispatch & trigger human supervisor review |
