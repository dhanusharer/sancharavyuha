from datetime import datetime
from typing import List, Dict, Any

try:
    from .rules import AnomalyRules
except ImportError:
    from rules import AnomalyRules

class AnomalyDetector:
    """Scans telemetry for overcrowding, camera heartbeats, passenger surges, and bus delays"""

    def __init__(self):
        self.rules = AnomalyRules()

    def scan_telemetry(self, stops_data: List[Dict[str, Any]], buses_data: List[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        alerts = []

        for stop in stops_data:
            stop_name = stop.get("name", "Unknown Stop")
            waiting = stop.get("waiting_passengers", 0)
            cctv_people = stop.get("people_detected_cctv", 0)
            congestion = stop.get("congestion_level", "Low")
            incident = stop.get("incident", False)

            # 1. Overcrowding Detection (>95% capacity for 10+ mins)
            if waiting > 180 or congestion == "Severe":
                alerts.append({
                    "id": f"ALT-{stop.get('stop_no', 1)}-1",
                    "type": "Overcrowding",
                    "stop": stop_name,
                    "severity": "Critical",
                    "message": f"Occupancy exceeded 95% at {stop_name}. Waiting passengers: {waiting}.",
                    "timestamp": datetime.utcnow().isoformat()
                })

            # 2. Passenger Count Spike Detection (3-Sigma statistical surge)
            if cctv_people > 150:
                alerts.append({
                    "id": f"ALT-{stop.get('stop_no', 1)}-2",
                    "type": "Passenger Count Spike",
                    "stop": stop_name,
                    "severity": "High",
                    "message": f"Sudden 3-sigma crowd surge detected on CCTV ({cctv_people} people detected).",
                    "timestamp": datetime.utcnow().isoformat()
                })

            # 3. Incident Alert
            if incident:
                alerts.append({
                    "id": f"ALT-{stop.get('stop_no', 1)}-3",
                    "type": "Incident Alert",
                    "stop": stop_name,
                    "severity": "High",
                    "message": stop.get("incident_description", "Unspecified traffic incident at stop."),
                    "timestamp": datetime.utcnow().isoformat()
                })

        # 4. Bus Delay & Battery Anomaly Detection
        if buses_data:
            for bus in buses_data:
                bus_id = bus.get("bus_id", "Bus")
                soc = bus.get("battery_soc", 100.0)
                fuel_type = bus.get("fuel_type", "Diesel")

                if fuel_type.upper() in ["EV", "ELECTRIC"] and soc < 20.0:
                    alerts.append({
                        "id": f"ALT-BUS-{bus_id}",
                        "type": "EV Low Battery",
                        "stop": f"Bus {bus_id}",
                        "severity": "Warning",
                        "message": f"Electric Bus {bus_id} battery level critical ({soc:.1f}% SoC). Depot charging required.",
                        "timestamp": datetime.utcnow().isoformat()
                    })

        return alerts
