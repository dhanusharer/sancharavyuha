# 📄 ADR-008: Why Embedded Decision Workspace over Generic Grafana & Prometheus

- **Status**: Accepted
- **Date**: 2026-10-11
- **Deciders**: AI-TOS Engineering Team
- **Technical Area**: Observability, Monitoring & User Experience Architecture

---

## Context & Problem Statement

In standard web applications, Prometheus is typically used for time-series metric collection and Grafana for dashboard visualizations. However, Sanchara Vyuha is an **AI-Native Transit Decision Operating System (AI-TOS)** for high-stakes urban transit dispatching. We needed to evaluate whether to delegate operational monitoring to external Grafana dashboards or build an embedded, unified Operational Decision Workspace.

---

## Decision Drivers

1. **Read-Only Visualization vs. Actionable Decision Control**: Grafana is fundamentally a read-only metric visualization tool. Transit dispatchers require interactive **Observe $\rightarrow$ Understand $\rightarrow$ Decide $\rightarrow$ Act $\rightarrow$ Verify** loops with Human-in-the-Loop (HITL) approval buttons.
2. **Domain-Specific UI Context**: Transit operators need integrated SVG corridor radar maps, CCTV line-crossing streams, and 100-point utility scorecards right next to decision packages—layouts that standard Grafana widgets cannot render.
3. **Sub-50ms Latency Bounds**: Direct WebSocket and REST state streaming in the unified viewport avoids context-switching across external browser tabs during emergency peak surges.
4. **Prometheus Compatibility**: While our primary operator interface is embedded, our backend **still exposes standard OpenTelemetry / Prometheus metric endpoints** (`/metrics` and `/api/v1/health/observability`) so enterprise DevOps teams can ingest time-series data into Prometheus when desired.

---

## Decision

We decided to build an **Embedded Operational Decision Workspace** as the primary interface for operators, while maintaining full **Prometheus metrics exporter compatibility** on the backend.

### Architectural Blueprint

```
                      Unified Observability Architecture
                      
  ┌────────────────────────────────────────────────────────────────────────┐
  │ Primary Interface: Sanchara Vyuha Unified Decision Workspace (React)   │
  │   • Live Corridor SVG Radar Map & CCTV Telemetry                       │
  │   • Multi-Option Trade-off Matrix (Options A/B/C)                      │
  │   • 100-Point Utility Scorecard & HITL Approval Control                │
  │   • Distributed 31ms Latency Breakdown Trace                           │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
  ┌───────────────────────────────────▼────────────────────────────────────┐
  │ Backend API Gateway (FastAPI)                                          │
  │   • /api/v1/health/monitoring      <-- Layer 1 Health Endpoint           │
  │   • /api/v1/health/observability   <-- Layer 2 Distributed Trace        │
  │   • /metrics                       <-- Prometheus Scrape Endpoint       │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │ (Optional External Scrape)
                                      ▼
                      ┌───────────────────────────────┐
                      │ Prometheus Time-Series Server │
                      └───────────────┬───────────────┘
                                      │
                                      ▼
                      ┌───────────────────────────────┐
                      │ Grafana Executive Dashboards  │
                      └───────────────────────────────┘
```

---

## Consequences

### Positive Impacts
- **Zero Context Switching**: Operators view live telemetry, AI quantile forecasts, policy checks, and click "Approve" in a single viewport.
- **Superior Operator UX**: Tailored clinical design system optimized for low cognitive load during emergency rain/surge conditions.
- **Enterprise Interoperability**: Backend remains 100% compliant with standard Prometheus scrapers (`/metrics`).

### Mitigated Trade-offs
- Custom UI components require initial frontend build effort, which we solved via reusable component design tokens.
