# 📘 Sanchara Vyuha — Operations & Incident Response Runbook

This runbook outlines standard operating procedures (SOPs), failure diagnosis, and fallback execution protocols for production transit depot operations.

---

## 🛠️ Incident Response Operating Procedures

### 1. CCTV Camera Feed Offline / High Latency (>300s)
- **Symptom**: `DataQualityScore` drops below $80\%$; warning flag `Camera feed delayed`.
- **Root Cause**: Edge camera hardware network drop or RTSP stream disconnect.
- **Fallback Procedure**:
  1. System automatically switches to **ETM Electronic Ticket Gate Count Scaling** fallback.
  2. Gate count inferred via: $\text{Estimated Queue} = \text{ETM Hourly Scan Rate} \times \text{Historical Wait Multiplier}$.
  3. `DataQualityEngine` logs degraded telemetry status without halting decision generation.

---

### 2. External Weather API Unavailable
- **Symptom**: IMD Weather API connection timeout ($>220\text{ms}$).
- **Root Cause**: Third-party API rate limit or network outage.
- **Fallback Procedure**:
  1. Circuit breaker opens; system activates **Seasonal Historical Weather Profile** cache.
  2. Context Engine retains last known rain alert status for 15 minutes before degrading to historical profile baseline.

---

### 3. GTFS-Realtime Feed Delayed
- **Symptom**: GTFS freshness age $> 180\text{ seconds}$.
- **Root Cause**: Transit authority GPS gateway delay.
- **Fallback Procedure**:
  1. System interpolates bus positions using **GTFS Static Scheduled Timetables**.
  2. Flag `GPS feed stale` logged to audit DB.

---

### 4. OR-Tools Solver Timeout (>50ms)
- **Symptom**: Fleet solver calculation time exceeds $50\text{ms}$.
- **Root Cause**: Excessive constraint graph complexity during multi-depot swaps.
- **Fallback Procedure**:
  1. Solver aborts complex branch-and-bound search and returns the **Best Feasible Greedy Heuristic Assignment**.
  2. Decision payload flags `solver_mode: "heuristic_fallback"`.

---

### 5. Model Feature or Calibration Drift Detected
- **Symptom**: `DriftDetector` flags Kolmogorov-Smirnov test statistic $> 0.10$.
- **Root Cause**: Structural shift in commuter patterns (e.g. new metro line opening).
- **Fallback Procedure**:
  1. `ShadowDeploymentManager` activates parallel monitoring.
  2. System triggers background automated model retraining pipeline (`train_and_tune.py`).

---

### 6. High Decision Latency (>100ms)
- **Symptom**: End-to-end Decision Package generation time breaches $100\text{ms}$.
- **Root Cause**: CPU throttling or high concurrent request volume.
- **Fallback Procedure**:
  1. FastAPI worker scales thread pool.
  2. Telemetry ingestion buffers non-critical SHAP calculations to asynchronous background task.
