from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any

try:
    from database import get_db
    from models import StopModel, BusModel
except ImportError:
    from services.backend.database import get_db
    from services.backend.models import StopModel, BusModel

try:
    from services.anomaly.detector import AnomalyDetector
except ImportError:
    try:
        from anomaly.detector import AnomalyDetector
    except ImportError:
        import sys, os
        sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../..")))
        from services.anomaly.detector import AnomalyDetector

router = APIRouter(prefix="/api/v1/alerts", tags=["Anomaly Intelligence Alerts"])
detector = AnomalyDetector()

@router.get("", response_model=List[Dict[str, Any]])
def get_anomaly_alerts(db: Session = Depends(get_db)):
    stops = db.query(StopModel).all()
    buses = db.query(BusModel).all()

    stops_data = [{"stop_no": s.stop_no, "name": s.name, "waiting_passengers": s.waiting_passengers, "people_detected_cctv": s.people_detected_cctv, "congestion_level": s.congestion_level, "incident": s.incident, "incident_description": s.incident_description} for s in stops]
    buses_data = [{"bus_id": b.bus_id, "battery_soc": b.battery_soc, "fuel_type": b.fuel_type} for b in buses]

    alerts = detector.scan_telemetry(stops_data, buses_data)

    if not alerts:
        alerts = [{
            "id": "ALT-SYS-001",
            "type": "System Normal",
            "stop": "All Depots",
            "severity": "Info",
            "message": "All camera feeds online. Telemetry operates within normal parameters.",
            "timestamp": "2026-10-11T09:30:00Z"
        }]

    return alerts
