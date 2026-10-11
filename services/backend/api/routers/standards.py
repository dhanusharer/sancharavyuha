from fastapi import APIRouter
from typing import Dict, Any
from datetime import datetime

router = APIRouter(prefix="/api/v1/standards", tags=["Open Transit Standards (GTFS-RT, SIRI, NeTEx)"])

@router.get("/gtfs-rt", response_model=Dict[str, Any])
def get_gtfs_realtime_feed():
    """Pillar 10: GTFS-Realtime Protocol Buffer Feed Standard Output."""
    return {
        "header": {
            "gtfs_realtime_version": "2.0",
            "incrementality": "FULL_DATASET",
            "timestamp": int(datetime.utcnow().timestamp())
        },
        "entity": [
            {
                "id": "ENTITY-BUS-365J-SP42",
                "is_deleted": False,
                "vehicle": {
                    "trip": {
                        "trip_id": "TRIP-365J-014",
                        "route_id": "ROUTE-365J",
                        "start_time": "17:30:00",
                        "schedule_relationship": "ADDED"
                    },
                    "position": {
                        "latitude": 12.9172,
                        "longitude": 77.6228,
                        "bearing": 180.0,
                        "speed": 22.5
                    },
                    "occupancy_status": "STANDING_ROOM_ONLY",
                    "vehicle": {
                        "id": "365J-SP42",
                        "label": "KA-01-F-4298 (Spare EV Bus)"
                    }
                }
            }
        ]
    }

@router.get("/siri", response_model=Dict[str, Any])
def get_siri_realtime_feed():
    """Pillar 10: SIRI (Service Interface for Realtime Information) Feed Standard Output."""
    return {
        "Siri": {
            "ServiceDelivery": {
                "ResponseTimestamp": datetime.utcnow().isoformat(),
                "VehicleMonitoringDelivery": {
                    "VehicleActivity": [
                        {
                            "RecordedAtTime": datetime.utcnow().isoformat(),
                            "ItemIdentifier": "SIRI-VMD-365J-042",
                            "MonitoredVehicleJourney": {
                                "LineRef": "365J",
                                "DirectionRef": "OUTBOUND",
                                "FramedVehicleJourneyRef": {
                                    "DataFrameRef": datetime.utcnow().strftime("%Y-%m-%d"),
                                    "DatedVehicleJourneyRef": "VJ-365J-42"
                                },
                                "PublishedLineName": "Majestic to Silk Board / Electronic City",
                                "OperatorRef": "BMTC",
                                "OriginRef": "STOP-1-MAJESTIC",
                                "DestinationRef": "STOP-6-SILKBOARD",
                                "Monitored": True,
                                "Bearing": 180.0,
                                "Delay": "P0Y0M0DT0H12M30S"
                            }
                        }
                    ]
                }
            }
        }
    }

@router.get("/netex", response_model=Dict[str, Any])
def get_netex_timetable_exchange():
    """Pillar 10: NeTEx (Network & Timetable Exchange) Standard Output."""
    return {
        "PublicationDelivery": {
            "PublicationTimestamp": datetime.utcnow().isoformat(),
            "ParticipantRef": "BMTC_SANCHARA_VYUHA",
            "dataObjects": {
                "CompositeFrame": {
                    "id": "NETEX_FRAME_365J",
                    "TypeOfFrameRef": "TIMETABLE_EXCHANGE",
                    "frames": {
                        "ServiceFrame": {
                            "routes": [
                                {
                                    "id": "NETEX_ROUTE_365J",
                                    "Name": "Route 365J High Density Corridor",
                                    "ShortName": "365J"
                                }
                            ]
                        }
                    }
                }
            }
        }
    }
