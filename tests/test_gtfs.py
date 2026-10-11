import pytest
from fastapi.testclient import TestClient
import sys, os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../services/backend")))
from main import app

client = TestClient(app)

def test_gtfs_static_download():
    response = client.get("/gtfs/static")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/zip"

def test_gtfs_realtime_vehicle():
    response = client.get("/gtfs/realtime/vehicle")
    assert response.status_code == 200
    assert "entity" in response.json()

def test_gtfs_realtime_trip():
    response = client.get("/gtfs/realtime/trip")
    assert response.status_code == 200
    assert "entity" in response.json()

def test_gtfs_realtime_alerts():
    response = client.get("/gtfs/realtime/alerts")
    assert response.status_code == 200
    assert "entity" in response.json()
