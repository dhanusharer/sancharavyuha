# 🗺️ Sanchara Vyuha — Requirement & Architecture Traceability Matrix

This matrix maps functional and non-functional transit requirements directly to architectural decisions (ADRs), codebase modules, and automated test cases.

---

## 🔍 Master Traceability Matrix

| Operational Requirement | Architecture Decision | Code Module | Automated Test Case |
| :--- | :--- | :--- | :--- |
| **Accurate Risk-Aware Demand Prediction** | [ADR-001](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/adr/001-why-lightgbm.md) (LightGBM Quantile) | `services/forecasting/train_and_tune.py` | `test_scenario_01_heavy_rain_emergency` |
| **100% Policy-Compliant Safe Dispatch** | [ADR-004](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/adr/004-why-policy-engine.md) (Policy Engine) | `services/backend/policy_risk_engine.py` | `test_scenario_02_driver_shift_exceeded` & `SC-03` |
| **Constrained Fleet Optimization** | [ADR-002](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/adr/002-why-ortools.md) (OR-Tools Solver) | `services/optimizer/solver.py` | `test_scenario_06_traffic_jam_short_turn` |
| **False Positive Suppression** | [ADR-005](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/adr/005-why-dual-trigger.md) (Dual Trigger) | `services/optimizer/solver.py` | `test_scenario_04_normal_offpeak_no_surge` |
| **Transparent Option Ranking** | [ADR-006](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/adr/006-why-utility-score.md) (Utility Scorecard) | `services/backend/policy_risk_engine.py` | `test_scenario_05_festival_peak_surge` |
| **Stochastic Trade-off Simulation** | [ADR-007](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/adr/007-why-monte-carlo.md) (Monte Carlo Simulation) | `services/optimizer/solver.py` | `test_phase_a_stress_100_concurrent_decision_requests` |
| **Open Transit Interoperability** | [ADR-003](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/adr/003-why-gtfs.md) (GTFS / GTFS-RT) | `services/backend/api/routers/gtfs.py` | `test_api.py` |
| **Telemetry Resiliency & Data Health** | [Phase B Hardening](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/services/backend/dependency_health.py) | `services/backend/context_engine.py` | `test_scenario_07_camera_feed_failure` |
| **Immutable Decision Auditability** | [Phase D Audit Trail](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/services/backend/audit_logger.py) | `services/backend/audit_logger.py` | `test_phase_d_audit_log_forensic_retrieval` |
