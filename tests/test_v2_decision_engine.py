import pytest
from fastapi.testclient import TestClient
import sys, os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../services/backend")))
from main import app

client = TestClient(app)

def test_decision_package_endpoint():
    response = client.get("/api/v1/dispatch/decision-package?stop_no=6")
    assert response.status_code == 200
    data = response.json()
    assert "decision_id" in data
    assert "mission_id" in data
    assert "policy_compliance" in data
    assert data["policy_compliance"]["status"] == "PASS"
    assert "context_weights" in data["evidence"]
    assert data["forecast"]["dual_trigger_status"] == "PASSED"
    assert len(data["simulated_alternatives"]) == 3
    assert data["simulated_alternatives"][0]["option_id"] == "A"

def test_active_missions_endpoint():
    response = client.get("/api/v1/dispatch/missions")
    assert response.status_code == 200
    missions = response.json()
    assert len(missions) > 0
    assert missions[0]["mission_id"] == "MISSION-365J-014"
    assert "goals" in missions[0]
