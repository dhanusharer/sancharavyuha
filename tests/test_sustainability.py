"""
Tests for Sanchara Vyuha Environmental Impact & Carbon Accounting Engine
========================================================================
WeMakeDevs x AWS Environmental Hacks 2026 - Track 03: Waste and Energy
"""

import pytest
from fastapi.testclient import TestClient
from services.backend.main import app
from services.optimizer.carbon_accounting import carbon_engine

client = TestClient(app)


def test_carbon_engine_trip_emissions_diesel():
    """Verify diesel bus calculations using CPCB/ARAI 2.68 kg CO2/L factor."""
    res = carbon_engine.calculate_trip_emissions(distance_km=10.0, fuel_type="BS-VI Diesel", passenger_count=50)
    assert res["distance_km"] == 10.0
    # 10 km * 0.33 L/km = 3.3 L
    assert abs(res["fuel_consumed_liters"] - 3.3) < 0.05
    # 3.3 L * 2.68 kg/L = 8.844 kg
    assert abs(res["co2_emissions_kg"] - 8.84) < 0.1
    assert res["is_ev"] is False


def test_carbon_engine_trip_emissions_ev():
    """Verify EV bus calculations using CEA India 0.72 kg CO2/kWh factor."""
    res = carbon_engine.calculate_trip_emissions(distance_km=10.0, fuel_type="EV", passenger_count=50)
    assert res["distance_km"] == 10.0
    assert res["fuel_consumed_liters"] == 0.0
    # 10 km * 1.15 kWh/km = 11.5 kWh
    assert abs(res["energy_consumed_kwh"] - 11.5) < 0.05
    # 11.5 kWh * 0.72 = 8.28 kg
    assert abs(res["co2_emissions_kg"] - 8.28) < 0.1
    assert res["is_ev"] is True


def test_carbon_engine_fleet_evaluation():
    """Verify corridor fleet operations evaluation and avoided emissions."""
    buses = [
        {"bus_id": "365J-01", "fuel_type": "BS-VI Diesel"},
        {"bus_id": "365J-02", "fuel_type": "EV"}
    ]
    stops = [
        {"stop_no": 1, "waiting_passengers": 120, "people_detected_cctv": 100},
        {"stop_no": 6, "waiting_passengers": 210, "people_detected_cctv": 190}
    ]
    eval_res = carbon_engine.evaluate_fleet_operations(buses, stops)
    assert eval_res["status"] == "success"
    assert "emissions_accounting" in eval_res
    assert eval_res["emissions_accounting"]["baseline_co2_kg"] > eval_res["emissions_accounting"]["optimized_co2_kg"]
    assert eval_res["emissions_accounting"]["avoided_co2_kg"] > 0
    assert eval_res["emissions_accounting"]["eco_score"] >= 50
    assert "methodology" in eval_res


def test_sustainability_api_endpoints():
    """Verify REST API responses for sustainability endpoints."""
    # Main metrics
    resp = client.get("/api/v1/sustainability")
    assert resp.status_code == 200
    data = resp.json()
    assert "emissions_accounting" in data
    assert "carbon_saved_kg" in data
    assert "fuel_saved_liters" in data
    assert "eco_score" in data

    # Route breakdown
    routes_resp = client.get("/api/v1/sustainability/routes")
    assert routes_resp.status_code == 200
    routes_data = routes_resp.json()
    assert len(routes_data) >= 3
    assert any(r["route_id"] == "365J" for r in routes_data)

    # Historical trends
    trends_resp = client.get("/api/v1/sustainability/trends?days=7")
    assert trends_resp.status_code == 200
    trends_data = trends_resp.json()
    assert len(trends_data) == 7

    # Methodology
    meth_resp = client.get("/api/v1/sustainability/methodology")
    assert meth_resp.status_code == 200
    assert "equations" in meth_resp.json()


def test_sustainability_simulation_endpoint():
    """Verify What-If scenario simulation endpoint."""
    sim_payload = {
        "ev_fleet_ratio_pct": 60.0,
        "demand_surge_pct": 25.0,
        "optimized_dispatch_enabled": True
    }
    resp = client.post("/api/v1/sustainability/simulate", json=sim_payload)
    assert resp.status_code == 200
    sim_data = resp.json()
    assert "results" in sim_data
    assert sim_data["results"]["co2_avoided_kg"] > 0
    assert sim_data["results"]["fuel_saved_liters"] > 0
