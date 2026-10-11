# 🔗 Sanchara Vyuha — Dependency Graph & Critical Files (`dependency-graph.md`)

## 1. Core System Files (DO NOT MODIFY LIGHTLY)

The following files form the architectural backbone of the platform. Modifying them requires extreme care:

| File Path | Role & Importance | Risk Level |
| :--- | :--- | :--- |
| [services/backend/main.py](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/services/backend/main.py) | Application entrypoint, CORS configuration, database auto-seeding, and router mounts. | 🔴 CRITICAL |
| [services/backend/database.py](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/services/backend/database.py) | SQLAlchemy engine, session maker, and DB transaction dependency provider (`get_db`). | 🔴 CRITICAL |
| [services/backend/models.py](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/services/backend/models.py) | Database ORM entities and foreign key schema definitions. | 🔴 CRITICAL |
| [services/backend/core/config.py](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/services/backend/core/config.py) | Pydantic configuration settings loading system variables and thresholds. | 🟡 HIGH |
| [src/App.tsx](file:///c:/Users/DHANUSH%20A%20G/Desktop/Sanchara-Vyuha-depo-main/Sanchara-Vyuha-depo-main/src/App.tsx) | React root orchestrator component managing active tabs, filters, and notifications state. | 🟡 HIGH |

---

## 2. Service Import Dependency Mapping

```
services/backend/main.py
  ├── services/backend/database.py
  ├── services/backend/core/config.py
  ├── services/backend/core/logger.py
  ├── services/backend/core/security.py
  ├── services/backend/models.py
  ├── services/backend/gtfs_exporter.py
  │     └── services/backend/models.py
  └── services/backend/api/routers/
        ├── stops.py ──────► services/backend/database.py, models.py, schemas.py
        ├── buses.py ──────► services/backend/database.py, models.py, schemas.py
        ├── dispatch.py ───► services/backend/database.py, models.py, schemas.py
        ├── alerts.py ─────► services/anomaly/detector.py ──► services/anomaly/rules.py
        ├── forecasting.py ► services/forecasting/lightgbm_quantile.py
        │                      ├── services/forecasting/feature_engineering.py
        │                      └── services/forecasting/shap_explainer.py
        └── gtfs.py ───────► services/backend/gtfs_exporter.py

services/optimizer/solver.py
  ├── services/optimizer/constraints.py
  └── services/optimizer/objective.py

src/App.tsx
  ├── src/services/api.ts
  ├── src/services/busSimulation.ts
  ├── src/components/SustainabilityDashboard.tsx
  ├── src/components/StopCard.tsx
  ├── src/components/BusMonitoring.tsx
  ├── src/components/PeakHours.tsx
  └── src/components/Analytics.tsx
```
