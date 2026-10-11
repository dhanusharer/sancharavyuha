# 🗺️ Sanchara Vyuha — Comprehensive Routes Specification (`routes.md`)

## 1. Backend REST & WebSocket API Routes Inventory

| HTTP Method | Route Endpoint | Purpose / Functionality | Auth / Scope | Service Module |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | Root API Metadata & Health Status | Public | `main.py` |
| `GET` | `/health` | System Health Check (`healthy`/`degraded`) | Public | `api/routers/health.py` |
| `GET` | `/metrics` | Telemetry Metrics (FPS, Latency, Active Buses) | Public | `api/routers/health.py` |
| `GET` | `/api/v1/stops` | Retrieve all BMTC bus stops with crowd metrics | Public | `api/routers/stops.py` |
| `GET` | `/api/v1/stops/{stop_no}` | Retrieve specific bus stop details | Public | `api/routers/stops.py` |
| `POST` | `/api/v1/stops` | Create a new bus stop record | Operator | `api/routers/stops.py` |
| `POST` | `/api/v1/stops/{stop_no}/passenger-flow` | Record CV door line-crossing passenger counts | Public / Edge | `api/routers/stops.py` |
| `GET` | `/api/v1/buses` | Retrieve live bus fleet status & coordinates | Public | `api/routers/buses.py` |
| `GET` | `/api/v1/buses/{bus_id}` | Retrieve specific bus vehicle details | Public | `api/routers/buses.py` |
| `POST` | `/api/v1/buses` | Register a new bus to fleet | Operator | `api/routers/buses.py` |
| `GET` | `/api/v1/dispatch` | Retrieve historical spare bus dispatch decisions | Public | `api/routers/dispatch.py` |
| `POST` | `/api/v1/dispatch` | Trigger spare bus dispatch (OR-Tools solver) | Operator | `api/routers/dispatch.py` |
| `GET` | `/api/v1/dispatch/decision-package` | Decision Package generator (Options A/B/C + Policy) | Public | `api/routers/dispatch.py` |
| `GET` | `/api/v1/dispatch/missions` | Active corridor missions & operational memory | Public | `api/routers/dispatch.py` |
| `GET` | `/api/v1/forecasting/predict` | Quantile Demand Forecast (P10/P50/P90) & SHAP | Public | `api/routers/forecasting.py` |
| `GET` | `/api/v1/alerts` | Anomaly Intelligence Scanner Alerts | Public | `api/routers/alerts.py` |
| `GET` | `/api/v1/sustainability` | ISO 14064 Well-to-Wheel Carbon Metrics | Public | `api/routers/sustainability.py` |
| `GET` | `/gtfs/static` | Download GTFS Static ZIP Archive | Public | `api/routers/gtfs.py` |
| `GET` | `/gtfs/realtime/vehicle` | GTFS-RT VehiclePositions Protobuf Feed | Public | `api/routers/gtfs.py` |
| `GET` | `/gtfs/realtime/trip` | GTFS-RT TripUpdates Protobuf Feed | Public | `api/routers/gtfs.py` |
| `GET` | `/gtfs/realtime/alerts` | GTFS-RT ServiceAlerts Protobuf Feed | Public | `api/routers/gtfs.py` |
| `WS` | `/ws/live-feed` | Real-time WebSocket Telemetry Channel | Public | `api/routers/websocket.py` |

---

## 2. Frontend React Dashboard Tabs & Navigation

| Tab ID | UI View Component | Primary Features & Purpose |
| :--- | :--- | :--- |
| `overview` | `StatsOverview.tsx` & `StopCard.tsx` | Real-time bus stop crowd status, CCTV count vs waiting count, dispatch buttons |
| `sustainability` | `SustainabilityDashboard.tsx` | Carbon emissions saved, fuel efficiency, Eco Score, EV readiness, weather impact, leaderboard |
| `analytics` | `Analytics.tsx` | Hourly congestion charts, passenger flow heatmaps, performance metrics |
| `monitoring` | `BusMonitoring.tsx` | Live bus vehicle tracking, driver assignments, route capacity meters |
| `peak-hours` | `PeakHours.tsx` | LightGBM P10/P50/P90 quantile forecasts, SHAP feature drivers |
| `integration` | `IntegrationPanel.tsx` | ETM smart ticketing, CCTV API streams, and IoT sensor connection panel |
