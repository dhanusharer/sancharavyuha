from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from typing import Dict, Any
from datetime import datetime

try:
    from database import get_db
    from gtfs_exporter import generate_gtfs_static_zip, generate_gtfs_rt_vehicle_positions
except ImportError:
    from services.backend.database import get_db
    from services.backend.gtfs_exporter import generate_gtfs_static_zip, generate_gtfs_rt_vehicle_positions

router = APIRouter(prefix="/gtfs", tags=["GTFS & GTFS-RT Standards"])

@router.get("/static")
def download_gtfs_static_archive(db: Session = Depends(get_db)):
    zip_bytes = generate_gtfs_static_zip(db)
    return Response(
        content=zip_bytes,
        media_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=gtfs_bmtc_sanchara_vyuha.zip"}
    )

@router.get("/realtime/vehicle", response_model=Dict[str, Any])
def get_gtfs_realtime_vehicle_positions(db: Session = Depends(get_db)):
    return generate_gtfs_rt_vehicle_positions(db)

@router.get("/realtime/trip", response_model=Dict[str, Any])
def get_gtfs_realtime_trip_updates(db: Session = Depends(get_db)):
    return {
        "header": {
            "gtfs_realtime_version": "2.0",
            "timestamp": int(datetime.utcnow().timestamp())
        },
        "entity": [
            {
                "id": "TRIP_UPDATE_365J_01",
                "trip_update": {
                    "trip": {"trip_id": "TRIP_365J-01", "route_id": "365J"},
                    "stop_time_update": [
                        {"stop_sequence": 1, "stop_id": "STOP_1", "arrival": {"delay": 120}},
                        {"stop_sequence": 6, "stop_id": "STOP_6", "arrival": {"delay": 300}}
                    ]
                }
            }
        ]
    }

@router.get("/realtime/alerts", response_model=Dict[str, Any])
def get_gtfs_realtime_alerts(db: Session = Depends(get_db)):
    return {
        "header": {
            "gtfs_realtime_version": "2.0",
            "timestamp": int(datetime.utcnow().timestamp())
        },
        "entity": [
            {
                "id": "ALERT_SILK_BOARD",
                "alert": {
                    "cause": "HEAVY_TRAFFIC",
                    "effect": "SIGNIFICANT_DELAYS",
                    "header_text": {"translation": [{"text": "Heavy congestion at Silk Board Junction"}]}
                }
            }
        ]
    }
