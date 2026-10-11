# 📖 Sanchara Vyuha — API Reference & Contract Specification (`api.md`)

## 1. System Health & Performance Metrics

### `GET /health`
Returns system component operational status.

```json
{
  "status": "healthy",
  "database": "connected",
  "camera_feed": "online",
  "forecasting_engine": "active",
  "timestamp": "2026-10-11T09:35:00Z"
}
```

### `GET /metrics`
Returns operating metrics including camera FPS, API latency, and active vehicle counts.

```json
{
  "api_latency_ms": 14.2,
  "inference_time_ms": 8.5,
  "fps_camera_feed": 29.8,
  "connected_cameras": 9,
  "active_buses": 42,
  "total_dispatches_today": 18,
  "carbon_saved_today_kg": 1240.5
}
```

---

## 2. Quantile Forecasting & SHAP Decision API

### `GET /api/v1/forecasting/predict?stop_no=1`

#### Parameters:
- `stop_no` (integer, query, required): BMTC Stop ID (e.g. 1 = Majestic, 6 = Silk Board).

#### Response (`200 OK`):
```json
{
  "stop_no": 1,
  "stop_name": "Kempegowda Bus Station (Majestic)",
  "prediction": {
    "p10": 142,
    "p50": 185,
    "p90": 228
  },
  "recommended_action": "Dispatch Spare Bus",
  "confidence": 0.94,
  "top_factors": [
    {
      "factor": "Heavy Rain Alert",
      "impact": "+35 passengers",
      "influence": "high_positive"
    },
    {
      "factor": "Peak Evening Rush (5PM - 8PM)",
      "impact": "+28 passengers",
      "influence": "high_positive"
    }
  ]
}
```

---

## 3. Anomaly Intelligence Alerts

### `GET /api/v1/alerts`

```json
[
  {
    "id": "ALT-6-1",
    "type": "Overcrowding",
    "stop": "Silk Board Junction",
    "severity": "Critical",
    "message": "Occupancy exceeded 95% at Silk Board Junction. Waiting passengers: 210.",
    "timestamp": "2026-10-11T09:35:00Z"
  }
]
```

---

## 4. GTFS-Realtime Endpoints

- `GET /gtfs/static`: Downloads `gtfs_bmtc_sanchara_vyuha.zip` archive containing standard transit CSVs.
- `GET /gtfs/realtime/vehicle`: VehiclePositions Protobuf JSON stream.
- `GET /gtfs/realtime/trip`: TripUpdates delay estimation stream.
- `GET /gtfs/realtime/alerts`: ServiceAlerts disruption feed.
