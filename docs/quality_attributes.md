# 🏛️ Sanchara Vyuha — System Quality Attributes Specification

This document maps non-functional engineering requirements directly to system architectural choices and quantitative metrics.

---

## 📊 Master System Quality Attributes Matrix

| Attribute | Quantitative Target | Architectural Implementation | Verification Method |
| :--- | :--- | :--- | :--- |
| **Availability** | **99.99% Uptime** | Multi-process FastAPI gateway, SQLite WAL mode, cached fallback layers | `/api/v1/health` monitoring & system health endpoints |
| **Reliability** | **Zero Safety Policy Violations (0.0%)** | Hard Policy Governance Engine (`PolicyEngineV3`) in decision loop | Automated Scenario SC-02 & SC-03 tests |
| **Latency** | **Decision Package Generation < 50 ms** | Fast CPU LightGBM quantile inference ($8.5\text{ms}$) & OR-Tools MILP solver ($12.0\text{ms}$) | Phase A Stress Test (100 concurrent requests) |
| **Scalability** | **100 Concurrent Corridor Requests** | Asynchronous FastAPI endpoints with sub-50ms execution bound | `test_phase_a_stress_and_tuning.py` load test |
| **Maintainability** | **ADR-Based Modular Architecture** | 7 Architecture Decision Records (ADRs) & 13 modular intelligence pipelines | Modular code structure in `services/backend` & `services/optimizer` |
| **Security** | **JWT Authentication & RBAC** | Role-Based Access Control distinguishing Operator vs Supervisor actions | API security middleware validation |
| **Explainability** | **Counterfactual Decision Support** | Natural language answers (*"Why A?"*, *"Why not B?"*, *"Why not C?"*) & 100-point Utility Scorecard | `AIOperations.tsx` SHAP trace & counterfactual UI |
| **Auditability** | **Immutable Decision Audit Trail** | SQLite `decision_audit_log` storing full input telemetry & decision payloads | `DecisionAuditLogger` forensic API |
| **Interoperability** | **GTFS / GTFS-Realtime Standard Compliant** | Standard GTFS CSV ingestion & GTFS-RT Protobuf binary feed publisher | Protobuf feed validator |
| **Observability** | **4-Category Real-Time Metrics** | Business, ML, System, and Data metrics exposed via `/api/v1/health/observability` | Phase C Observability API endpoint |
