# Sanchara Vyuha — Advanced Production Roadmap

## Executive assessment

This is a strong and socially meaningful idea: a smart, sustainability-focused public transport operations platform for cities like Bengaluru. The project already shows a good direction through its combination of monitoring, forecasting, dispatch recommendations, and sustainability reporting. In its current form, it is impressive as a demo and hackathon project, but it is not yet a production-grade system.

The biggest gap is not the idea. The biggest gap is execution maturity. Right now, the project is still largely mock-driven and presentation-oriented. To create real impact for society, the platform needs to evolve from a dashboard prototype into a reliable, real-time operational system with live data, robust engineering, trustworthy AI, and measurable public benefit.

## What is already strong

- The project has a clear social purpose: reduce congestion, fuel waste, emissions, and commuter discomfort.
- The product vision is coherent: CCTV-based occupancy, AI forecasting, dispatch recommendations, sustainability insights, and public transport adoption.
- The UI is polished and visually compelling, which matters for adoption by operators and decision-makers.
- The repository already contains useful modular components such as [src/App.tsx](src/App.tsx), [src/components](src/components), [src/services](src/services), and [src/data](src/data).
- The multi-domain scope is ambitious in a good way: operations, AI, sustainability, and commuter experience all connect to one core problem.

## What is holding it back

### 1. It is still too mock-driven

The current experience in [src/App.tsx](src/App.tsx) depends heavily on simulated values and random updates. That is acceptable for a prototype, but it weakens the credibility of the system for real-world deployment.

Why this matters:
- Operators will not trust recommendations if the system cannot show real evidence from live data.
- The sustainability claims will feel less convincing without grounded operational data.
- The platform cannot become a true city-scale decision tool if it is not connected to real telemetry.

### 2. The architecture is not yet production-ready

The app is currently a single large UI surface with stateful orchestration in [src/App.tsx](src/App.tsx). That makes it harder to scale, test, and evolve.

A production system should be split into:
- frontend dashboard UI
- API/backend service layer
- real-time data ingestion pipeline
- model inference service
- storage and analytics layer
- authentication and role-based access
- monitoring and alerting

### 3. The AI is not yet operationalized

The repository contains AI-related assets in folders like [peak-hours-bmtc](peak-hours-bmtc) and [Bmtc-Busstand-cctv](Bmtc-Busstand-cctv), which is good. But the current product experience does not yet show a clear path from model training to live deployment.

The project needs:
- model versioning
- experiment tracking
- evaluation metrics
- retraining pipelines
- inference APIs
- fallback behavior when models are unavailable

### 4. Security and governance are missing

The current project does not yet appear to include meaningful access control, audit trails, or data governance. For a public transport system, that is a serious issue.

A production platform should include:
- authentication for operators and admins
- role-based access control
- audit logs for dispatch decisions and edits
- encrypted secrets and safe handling of API keys
- data privacy controls for CCTV-derived metrics

### 5. The system is not yet measurable in terms of real social impact

The README describes impressive potential impact, but the project needs an operational framework to measure it. Without measurement, the system will be hard to justify for real deployment.

The platform should track:
- fuel savings per bus trip
- carbon savings by route and depot
- reduction in empty miles
- increase in bus occupancy
- commuter wait time reduction
- modal shift from private vehicle to public transport

---

## Best improvements to make

### A. Move from demo to data-driven operations platform

This is the most important transformation.

Recommended architecture:
- Frontend: React + TypeScript + Vite
- Backend API: FastAPI or NestJS
- Database: PostgreSQL with TimescaleDB for time-series data
- Cache/streaming: Redis + Kafka or RabbitMQ
- Object storage: S3-compatible storage for model artifacts and CCTV snapshots
- Infra: Docker + CI/CD + Kubernetes or managed cloud deployment

Why this matters:
- The platform will stop being an animated dashboard and become a real operations tool.
- It will be possible to support multiple depots, multiple routes, and later city-wide rollout.

### B. Replace random simulations with real ingestion pipelines

The project should connect to real sources such as:
- CCTV or vision inference feeds
- ETM (Electronic Ticketing Machine) data
- GPS vehicle tracking
- AVL (Automatic Vehicle Location) data
- traffic congestion feeds
- weather data
- schedule and route data

Recommended data model:
- bus_events
- stop_observations
- route_performance
- passenger_flow
- dispatch_decisions
- sustainability_metrics
- anomaly_events

This will make predictions much more trustworthy and operationally useful.

### C. Upgrade the forecasting engine from prototype to production ML

The current forecasting theme is promising, but it should become a serious ML pipeline.

Suggested model choices:
- short-term demand prediction: LightGBM or XGBoost
- sequence forecasting: Temporal Fusion Transformer or LSTM with richer exogenous features
- anomaly detection: Isolation Forest or autoencoders for irregular operation patterns

Input features should include:
- time of day
- day of week
- holidays
- weather
- traffic conditions
- school/work schedule patterns
- route-specific history
- event-based disruptions

Deployment model:
- train offline in a reproducible pipeline
- version every model artifact
- store inference metadata
- track drift and retraining triggers

### D. Add real optimization algorithms for dispatch and resource use

A major opportunity lies in moving beyond “suggestions” into optimization.

Suggested algorithms:
- OR-Tools / MILP for bus dispatch allocation
- graph-based routing optimization for spare buses
- reinforcement learning for policy learning in controlled environments
- constraint-based scheduling for peak-hour balancing

Use cases:
- decide which spare bus to dispatch to which stop
- decide when to hold a bus versus send it to another route
- minimize empty miles and passenger waiting time
- optimize EV bus deployment for sustainable routes

This would turn the product from a dashboard into an intelligent decision engine.

### E. Introduce an anomaly and incident intelligence layer

Since transport operations are sensitive to disruptions, the platform should not only forecast but also detect problems early.

Suggested capabilities:
- detect unusual congestion spikes
- detect abnormal dwell times
- detect bus bunching
- detect suspicious or degraded sensor data
- detect maintenance risk before failure

This is a very high-value feature for real operations teams.

### F. Build a true sustainability engine, not just a display

The sustainability dashboard is a great concept, but it should become a rigorous decision layer.

Add:
- carbon accounting from trip-level data
- route-level fuel efficiency scoring
- EV suitability scoring by route segment
- impact simulation for policy changes
- “what-if” analysis: what happens if we add one extra bus, or change frequency, or shift to EVs?

This will make your project more credible for government agencies, transport departments, and sustainability initiatives.

### G. Separate the UI from business logic

The current code structure in [src/App.tsx](src/App.tsx) is doing too much. The UI should be thin and declarative.

Suggested refactor:
- move route state into a proper store such as Zustand or Redux Toolkit
- use React Query / TanStack Query for server state
- split panels into feature modules
- create dedicated hooks for simulation, forecasting, and notifications

This will make the app much easier to maintain and extend.
