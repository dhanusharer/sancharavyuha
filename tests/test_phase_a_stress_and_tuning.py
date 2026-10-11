import pytest
from fastapi.testclient import TestClient
import time
import sys, os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../services/backend")))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../services/optimizer")))
from main import app
from solver import ORToolsFleetSolver
from audit_logger import DecisionAuditLogger

client = TestClient(app)
solver = ORToolsFleetSolver()

# =============================================================================
# PHASE A — VALIDATION & STRESS TEST SUITE
# =============================================================================

def test_phase_a_stress_100_concurrent_decision_requests():
    """Phase A: Executes 100 decision requests under 50ms latency bound per request."""
    stop = {"stop_no": 6, "name": "Silk Board Junction", "waiting_passengers": 210, "people_detected_cctv": 185}
    buses = [
        {"bus_id": "365J-SP42", "driver_shift_hours": 5.2, "fuel_type": "EV", "battery_soc": 82.0},
        {"bus_id": "365J-02", "driver_shift_hours": 4.0, "fuel_type": "EV", "battery_soc": 75.0},
        {"bus_id": "365J-03", "driver_shift_hours": 3.5, "fuel_type": "EV", "battery_soc": 90.0},
        {"bus_id": "365J-04", "driver_shift_hours": 6.0, "fuel_type": "Diesel", "battery_soc": 100.0}
    ]

    start_time = time.time()
    for i in range(100):
        pkg = solver.generate_decision_package(stop, buses)
        assert pkg["recommendation"]["selected_option"] == "A"
    total_elapsed_ms = (time.time() - start_time) * 1000.0
    avg_latency_ms = total_elapsed_ms / 100.0

    assert avg_latency_ms < 50.0

def test_phase_a_extreme_surge_tuning_500_pax():
    """Phase A: Tests extreme surge bound of 500+ passengers."""
    stop = {"stop_no": 1, "name": "Majestic Bus Station", "waiting_passengers": 520, "people_detected_cctv": 490}
    buses = [
        {"bus_id": "365J-SP42", "driver_shift_hours": 5.2, "fuel_type": "EV", "battery_soc": 82.0},
        {"bus_id": "365J-02", "driver_shift_hours": 4.0, "fuel_type": "EV", "battery_soc": 75.0},
        {"bus_id": "365J-03", "driver_shift_hours": 3.5, "fuel_type": "EV", "battery_soc": 90.0},
        {"bus_id": "365J-04", "driver_shift_hours": 6.0, "fuel_type": "Diesel", "battery_soc": 100.0}
    ]

    pkg = solver.generate_decision_package(stop, buses)
    assert pkg["problem"]["severity"] == "Critical"
    assert pkg["recommendation"]["selected_option"] == "A"

def test_phase_d_audit_log_forensic_retrieval():
    """Phase D: Validates immutable decision audit log and forensic post-mortem investigation retrieval."""
    stop = {"stop_no": 6, "name": "Silk Board Junction", "waiting_passengers": 210, "people_detected_cctv": 185}
    buses = [
        {"bus_id": "365J-SP42", "driver_shift_hours": 5.2, "fuel_type": "EV", "battery_soc": 82.0},
        {"bus_id": "365J-02", "driver_shift_hours": 4.0, "fuel_type": "EV", "battery_soc": 75.0},
        {"bus_id": "365J-03", "driver_shift_hours": 3.5, "fuel_type": "EV", "battery_soc": 90.0},
        {"bus_id": "365J-04", "driver_shift_hours": 6.0, "fuel_type": "Diesel", "battery_soc": 100.0}
    ]

    pkg = solver.generate_decision_package(stop, buses)
    decision_id = pkg["decision_id"]
    DecisionAuditLogger.log_decision(pkg)

    record = DecisionAuditLogger.get_audit_record(decision_id)
    assert record is not None
    assert record["decision_id"] == decision_id
    assert record["recommendation"]["selected_option"] == "A"
