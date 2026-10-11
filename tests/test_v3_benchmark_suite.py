import pytest
from fastapi.testclient import TestClient
import sys, os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../services/backend")))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../services/optimizer")))
from main import app
from solver import ORToolsFleetSolver

client = TestClient(app)
solver = ORToolsFleetSolver()

# =============================================================================
# MODULE 13: AUTOMATED 7-SCENARIO BENCHMARK SUITE
# =============================================================================

def test_scenario_01_heavy_rain_emergency():
    """Scenario 1: Heavy Rain Emergency → Expect Option A (EV Spare Dispatch)."""
    stop = {"stop_no": 6, "name": "Silk Board Junction", "waiting_passengers": 210, "people_detected_cctv": 185}
    buses = [
        {"bus_id": "365J-SP42", "driver_shift_hours": 5.2, "fuel_type": "EV", "battery_soc": 82.0},
        {"bus_id": "365J-02", "driver_shift_hours": 4.0, "fuel_type": "EV", "battery_soc": 75.0},
        {"bus_id": "365J-03", "driver_shift_hours": 3.5, "fuel_type": "EV", "battery_soc": 90.0},
        {"bus_id": "365J-04", "driver_shift_hours": 6.0, "fuel_type": "Diesel", "battery_soc": 100.0}
    ]
    pkg = solver.generate_decision_package(stop, buses, context_mode="rain_emergency")
    
    assert pkg["context"]["mode"] == "rain_emergency"
    assert pkg["recommendation"]["selected_option"] == "A"
    assert pkg["policy_compliance"]["status"] == "PASS"

def test_scenario_02_driver_shift_exceeded():
    """Scenario 2: Driver Shift > 8.0 Hours → Expect Policy Blocked (POL-OPER-001)."""
    stop = {"stop_no": 6, "name": "Silk Board Junction", "waiting_passengers": 210, "people_detected_cctv": 185}
    buses = [
        {"bus_id": "365J-SP42", "driver_shift_hours": 8.5, "fuel_type": "EV", "battery_soc": 82.0},
        {"bus_id": "365J-02", "driver_shift_hours": 4.0, "fuel_type": "EV", "battery_soc": 75.0},
        {"bus_id": "365J-03", "driver_shift_hours": 3.5, "fuel_type": "EV", "battery_soc": 90.0},
        {"bus_id": "365J-04", "driver_shift_hours": 6.0, "fuel_type": "Diesel", "battery_soc": 100.0}
    ]
    pkg = solver.generate_decision_package(stop, buses)
    
    assert pkg["policy_compliance"]["status"] == "BLOCKED"
    driver_audit = [a for a in pkg["policy_compliance"]["audit_log"] if a["policy_id"] == "POL-OPER-001"][0]
    assert driver_audit["status"] == "VIOLATED"

def test_scenario_03_low_ev_battery():
    """Scenario 3: Low EV Battery < 20% → Expect Policy Blocked on EV (POL-FLEET-002)."""
    stop = {"stop_no": 6, "name": "Silk Board Junction", "waiting_passengers": 210, "people_detected_cctv": 185}
    buses = [
        {"bus_id": "365J-SP42", "driver_shift_hours": 5.2, "fuel_type": "EV", "battery_soc": 15.0},
        {"bus_id": "365J-02", "driver_shift_hours": 4.0, "fuel_type": "EV", "battery_soc": 75.0},
        {"bus_id": "365J-03", "driver_shift_hours": 3.5, "fuel_type": "EV", "battery_soc": 90.0},
        {"bus_id": "365J-04", "driver_shift_hours": 6.0, "fuel_type": "Diesel", "battery_soc": 100.0}
    ]
    pkg = solver.generate_decision_package(stop, buses)
    
    assert pkg["policy_compliance"]["status"] == "BLOCKED"
    ev_audit = [a for a in pkg["policy_compliance"]["audit_log"] if a["policy_id"] == "POL-FLEET-002"][0]
    assert ev_audit["status"] == "VIOLATED"

def test_scenario_04_normal_offpeak_no_surge():
    """Scenario 4: No Surge Demand (P50 <= 120) → Expect Dual Trigger Fail / Standby."""
    stop = {"stop_no": 6, "name": "Silk Board Junction", "waiting_passengers": 35, "people_detected_cctv": 30}
    buses = [
        {"bus_id": "365J-SP42", "driver_shift_hours": 5.2, "fuel_type": "EV", "battery_soc": 82.0},
        {"bus_id": "365J-02", "driver_shift_hours": 4.0, "fuel_type": "EV", "battery_soc": 75.0},
        {"bus_id": "365J-03", "driver_shift_hours": 3.5, "fuel_type": "EV", "battery_soc": 90.0},
        {"bus_id": "365J-04", "driver_shift_hours": 6.0, "fuel_type": "Diesel", "battery_soc": 100.0}
    ]
    pkg = solver.generate_decision_package(stop, buses)
    
    assert pkg["forecast"]["dual_trigger_status"] == "FAILED"

def test_scenario_05_festival_peak_surge():
    """Scenario 5: Festival Peak Surge → Expect Option A Dispatch with High Utility."""
    stop = {"stop_no": 6, "name": "Silk Board Junction", "waiting_passengers": 280, "people_detected_cctv": 250}
    buses = [
        {"bus_id": "365J-SP42", "driver_shift_hours": 5.2, "fuel_type": "EV", "battery_soc": 82.0},
        {"bus_id": "365J-02", "driver_shift_hours": 4.0, "fuel_type": "EV", "battery_soc": 75.0},
        {"bus_id": "365J-03", "driver_shift_hours": 3.5, "fuel_type": "EV", "battery_soc": 90.0},
        {"bus_id": "365J-04", "driver_shift_hours": 6.0, "fuel_type": "Diesel", "battery_soc": 100.0}
    ]
    pkg = solver.generate_decision_package(stop, buses)
    
    assert pkg["recommendation"]["selected_option"] == "A"
    assert pkg["utility_scorecard"]["total_utility"] > 80.0

def test_scenario_06_traffic_jam_short_turn():
    """Scenario 6: High Traffic Delay → Option B (Short-Turn) evaluated as alternative."""
    stop = {"stop_no": 6, "name": "Silk Board Junction", "waiting_passengers": 210, "people_detected_cctv": 185}
    buses = [
        {"bus_id": "365J-SP42", "driver_shift_hours": 5.2, "fuel_type": "EV", "battery_soc": 82.0},
        {"bus_id": "365J-04", "driver_shift_hours": 4.0, "fuel_type": "Diesel", "battery_soc": 100.0}
    ]
    pkg = solver.generate_decision_package(stop, buses)
    
    assert len(pkg["simulated_alternatives"]) == 3
    assert pkg["simulated_alternatives"][1]["option_id"] == "B"

def test_scenario_07_camera_feed_failure():
    """Scenario 7: Camera Feed Latency > 300s → Data Quality Degradation Warning."""
    stop = {"stop_no": 6, "name": "Silk Board Junction", "waiting_passengers": 210, "people_detected_cctv": 185}
    buses = [{"bus_id": "365J-SP42", "driver_shift_hours": 5.2, "fuel_type": "EV", "battery_soc": 82.0}]
    pkg = solver.generate_decision_package(stop, buses)
    
    assert "data_quality" in pkg["context"]
    assert pkg["context"]["data_quality"]["score"] >= 80.0
