# 🔌 Sanchara Vyuha — API Contracts & Payload Mapping (`api-map.md`)

## 1. Quantile Forecasting & Decision Intelligence

### Endpoint: `GET /api/v1/forecasting/predict?stop_no=1`

#### Response Payload (`200 OK`):
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

## 2. Anomaly Intelligence Alerts

### Endpoint: `GET /api/v1/alerts`

#### Response Payload (`200 OK`):
```json
[
  {
    "id": "ALT-6-1",
    "type": "Overcrowding",
    "stop": "Silk Board Junction",
    "severity": "Critical",
    "message": "Occupancy exceeded 95% at Silk Board Junction. Waiting passengers: 210.",
    "timestamp": "2026-10-11T09:30:00Z"
  },
  {
    "id": "ALT-BUS-365J-02",
    "type": "EV Low Battery",
    "stop": "Bus 365J-02",
    "severity": "Warning",
    "message": "Electric Bus 365J-02 battery level critical (18.5% SoC). Depot charging required.",
    "timestamp": "2026-10-11T09:30:00Z"
  }
]
```

---

## 3. GTFS-Realtime Vehicle Positions Feed

### Endpoint: `GET /gtfs/realtime/vehicle`

#### Response Payload (`200 OK`):
```json
{
  "header": {
    "gtfs_realtime_version": "2.0",
    "incrementality": "FULL_DATASET",
    "timestamp": 1785440000
  },
  "entity": [
    {
      "id": "VP_365J-01",
      "vehicle": {
        "trip": {
          "trip_id": "TRIP_365J-01",
          "route_id": "365J"
        },
        "position": {
          "latitude": 12.9779,
          "longitude": 77.5724,
          "speed": 25.0
        },
        "occupancy_status": "STANDING_ROOM_ONLY",
        "vehicle": {
          "id": "365J-01",
          "label": "KA-01-F-1234"
        },
        "timestamp": 1785440000
      }
    }
  ]
}
```

---

## 4. Spare Bus Dispatch Trigger

### Endpoint: `POST /api/v1/dispatch`

#### Request Payload:
```json
{
  "stop_no": 6,
  "reason": "Automatic high-demand crowding resolution at Silk Board"
}
```

#### Response Payload (`201 Created`):
```json
{
  "id": 1,
  "dispatch_id": "DISP-1785440000",
  "bus_id": "365J-SP42",
  "target_stop_no": 6,
  "target_stop_name": "Silk Board Junction",
  "timestamp": "2026-10-11T09:30:00Z",
  "status": "dispatched",
  "reason": "Automatic high-demand crowding resolution at Silk Board",
  "predicted_wait_reduction_mins": 18.5
}
```

---

## 5. Structured Decision Package (AI-TOS v2.1)

### Endpoint: `GET /api/v1/dispatch/decision-package?stop_no=6`

#### Response Payload (`200 OK`):
```json
{
  "decision_id": "DISP-2026-069",
  "mission_id": "MISSION-365J-014",
  "timestamp": "2026-10-11T11:15:00Z",
  "problem": {
    "title": "Severe Passenger Overcrowding at Silk Board Junction",
    "severity": "Critical",
    "location": "Stop 6 - Silk Board Junction"
  },
  "evidence": {
    "people_detected_cctv": 185,
    "waiting_queue": 210,
    "weather_alert": "Heavy Rain (+35 pax impact)",
    "traffic_congestion": "Severe (+15 min delay)",
    "gtfs_headway_delay": "12.5 minutes",
    "context_weights": { "alpha_wait": 0.70, "beta_fuel": 0.20, "gamma_risk": 0.10 }
  },
  "forecast": {
    "p10_conservative": 157,
    "p50_median": 210,
    "p90_surge_peak": 262,
    "dual_trigger_status": "PASSED"
  },
  "policy_compliance": {
    "status": "PASS",
    "driver_duty_hours": "5.2h / 8.0h (Valid)",
    "ev_battery_soc": "82.0% (Valid >= 20%)",
    "depot_reserve": "4 buses remaining (Valid >= 3)",
    "details": "All policy safety constraints satisfied and dual-trigger condition met."
  },
  "simulated_alternatives": [
    {
      "option_id": "A",
      "action": "Dispatch Spare EV Bus 365J-02",
      "wait_reduction_mins": 18.5,
      "diesel_fuel_liters": 0.0,
      "co2_emissions_kg": 0.0,
      "risk_level": "Low",
      "policy_compliant": true
    },
    {
      "option_id": "B",
      "action": "Short-Turn BS-VI Bus 365J-04 at Shanthinagar",
      "wait_reduction_mins": 14.0,
      "diesel_fuel_liters": 12.5,
      "co2_emissions_kg": 33.5,
      "risk_level": "Medium",
      "policy_compliant": true
    },
    {
      "option_id": "C",
      "action": "No Dispatch Action (Fixed Schedule)",
      "wait_reduction_mins": 0.0,
      "diesel_fuel_liters": 0.0,
      "co2_emissions_kg": 0.0,
      "risk_level": "Critical",
      "policy_compliant": false
    }
  ],
  "recommendation": {
    "selected_option": "A",
    "confidence_score": 96.2,
    "decision_score": 94,
    "rationale": "Option A delivers maximum wait reduction (-18.5 min) under context weights [wait=0.7, fuel=0.2] with full policy compliance."
  }
}
```

---

## 6. Mission Manager Endpoint (AI-TOS v2.1)

### Endpoint: `GET /api/v1/dispatch/missions`

#### Response Payload (`200 OK`):
```json
[
  {
    "mission_id": "MISSION-365J-014",
    "name": "Recover Silk Board Corridor Crowding",
    "priority": "Critical",
    "status": "Active",
    "corridor": "Route 365J (Majestic -> Silk Board)",
    "goals": {
      "target_max_queue": 40,
      "target_avg_wait_mins": 6.0,
      "target_eta_recovery_mins": 10.0
    },
    "operational_memory": {
      "historical_similar_event": "Heavy Rain on Friday 2025-11-07",
      "previous_successful_action": "Dispatched EV Spare Bus + Short-Turned Bus 04",
      "operator_override_history": "Operator preferred EV dispatch over diesel short-turn"
    },
    "active_decision_package": "DISP-2026-069"
  }
]
```
