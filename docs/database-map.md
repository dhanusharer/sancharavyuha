# 🗄️ Sanchara Vyuha — Database Schema & Entity Relationships (`database-map.md`)

## 1. Database Architecture & ORM Setup

- **Database Engine**: SQLite (Development default: `./sanchara_vyuha.db`) / PostgreSQL (Production ready).
- **ORM Framework**: SQLAlchemy 2.0 (`services/backend/database.py`, `services/backend/models.py`).
- **Connection Pooling**: `check_same_thread=False` for SQLite async request handling.

---

## 2. Table Schemas & Fields

### Table 1: `stops`
Stores bus stop master data and live passenger waiting metrics.

| Field Name | Data Type | Key / Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key, Index | Internal database ID |
| `stop_no` | Integer | Unique, Index | Public bus stop number (e.g. 1 = Majestic) |
| `name` | String | Index | Stop name (e.g. Silk Board Junction) |
| `lat` | Float | Not Null | Latitude coordinate |
| `lng` | Float | Not Null | Longitude coordinate |
| `people_detected_cctv` | Integer | Default: 0 | Live count of people detected via YOLOv8 |
| `waiting_passengers` | Integer | Default: 0 | Estimated waiting passenger queue size |
| `congestion_level` | String | Default: "Moderate" | Low, Moderate, High, Severe |
| `action_required` | String | Default: "Normal" | Action recommendation |
| `incident` | Boolean | Default: False | Incident flag |
| `incident_description`| String | Nullable | Details if incident present |
| `last_updated` | DateTime | Default: UTC | Timestamp of last telemetry update |

---

### Table 2: `buses`
Stores live bus fleet location, capacity, fuel type, and battery State-of-Charge (SoC).

| Field Name | Data Type | Key / Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key, Index | Internal database ID |
| `bus_id` | String | Unique, Index | Bus fleet ID (e.g. 365J-01) |
| `driver` | String | Not Null | Driver name |
| `vehicle_no` | String | Not Null | Registration number (e.g. KA-01-F-1234) |
| `route_id` | String | Default: "365J" | BMTC route code |
| `current_onboard` | Integer | Default: 0 | Current passenger count on bus |
| `max_capacity` | Integer | Default: 60 | Maximum rated passenger capacity |
| `status` | String | Default: "in_transit"| in_transit, dispatched, maintenance, charging |
| `fuel_type` | String | Default: "BS-VI Diesel"| BS-VI Diesel, EV, CNG |
| `battery_soc` | Float | Default: 100.0 | Battery State-of-Charge (%) |
| `current_stop` | Integer | Foreign Key (`stops.stop_no`)| Current or last stop |
| `destination_stop` | Integer | Nullable | Target destination stop |
| `lat` | Float | Nullable | Current latitude |
| `lng` | Float | Nullable | Current longitude |
| `speed_kmh` | Float | Default: 25.0 | Current speed in km/h |
| `last_updated` | DateTime | Default: UTC | Last GPS ping timestamp |

---

### Table 3: `dispatch_decisions`
Audit log of spare bus dispatches triggered by operators or OR-Tools optimization algorithms.

| Field Name | Data Type | Key / Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key, Index | Internal record ID |
| `dispatch_id` | String | Unique, Index | Unique dispatch reference (e.g. DISP-178544) |
| `bus_id` | String | Index | Assigned bus ID |
| `target_stop_no` | Integer | Foreign Key (`stops.stop_no`)| Targeted bus stop |
| `target_stop_name` | String | Not Null | Name of targeted stop |
| `timestamp` | DateTime | Default: UTC | Timestamp of dispatch |
| `status` | String | Default: "dispatched"| dispatched, en_route, arrived, completed |
| `reason` | Text | Not Null | Explanation / trigger reason |
| `predicted_wait_reduction_mins`| Float | Default: 15.0 | Predicted wait time reduction |

---

### Table 4: `sustainability_metrics`
Stores aggregated environmental impact and ISO 14064 Well-to-Wheel carbon accounting.

| Field Name | Data Type | Key / Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key, Index | Record ID |
| `timestamp` | DateTime | Index | Measurement timestamp |
| `carbon_saved_kg` | Float | Default: 1240.0 | Cumulative CO2 emissions saved (kg) |
| `fuel_saved_liters` | Float | Default: 450.0 | Equivalent diesel fuel saved (liters) |
| `eco_score` | Integer | Default: 88 | Fleet eco efficiency score (0-100) |
| `ev_readiness_pct` | Float | Default: 65.0 | EV fleet route readiness % |
| `active_ev_buses` | Integer | Default: 14 | Number of active electric buses |
| `total_buses` | Integer | Default: 42 | Total fleet size |

---

### Table 5: `passenger_flow`
Stores raw CV line-crossing gate events (boarded vs. alighted).

| Field Name | Data Type | Key / Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key, Index | Record ID |
| `stop_no` | Integer | Foreign Key (`stops.stop_no`), Index | Bus stop number |
| `timestamp` | DateTime | Index | Event timestamp |
| `boarded_count` | Integer | Default: 0 | Boarding passengers count |
| `alighted_count` | Integer | Default: 0 | Alighting passengers count |
| `cctv_frame_count` | Integer | Default: 0 | Raw frame crowd count |

---

## 3. Entity Relationships Diagram (Text Format)

```
┌─────────────┐             1 : N             ┌─────────────┐
│  StopModel  │───────────────────────────────<  BusModel   │
└──────┬──────┘                               └─────────────┘
       │
       │ 1 : N
       ├──────────────────────────────────────< DispatchDecisionModel
       │
       │ 1 : N
       └──────────────────────────────────────< PassengerFlowModel
```
