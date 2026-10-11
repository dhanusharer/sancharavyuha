# Sanchara Vyuha AI-TOS v6.0 API Test Suite
import pytest
from fastapi.testclient import TestClient
import sys, os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../services/backend")))
from main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_metrics_endpoint():
    response = client.get("/metrics")
    assert response.status_code == 200
    assert "connected_cameras" in response.json()

def test_get_stops():
    response = client.get("/api/v1/stops")
    assert response.status_code == 200
    assert len(response.json()) > 0

def test_get_alerts():
    response = client.get("/api/v1/alerts")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_quantile_forecast():
    response = client.get("/api/v1/forecasting/predict?stop_no=1")
    assert response.status_code == 200
    data = response.json()
    assert "p10" in data["prediction"]
    assert "p50" in data["prediction"]
    assert "p90" in data["prediction"]
    assert len(data["top_factors"]) > 0
