import csv
import io
import zipfile
from datetime import datetime
from typing import List, Dict, Any
from sqlalchemy.orm import Session

try:
    from models import StopModel, BusModel
except ImportError:
    from services.backend.models import StopModel, BusModel

def generate_gtfs_static_zip(db: Session) -> bytes:
    """Generates a GTFS static compliant ZIP archive containing stops.txt, routes.txt, trips.txt, and stop_times.txt"""
    stops = db.query(StopModel).order_by(StopModel.stop_no).all()
    buses = db.query(BusModel).all()

    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, 'w', zipfile.ZIP_DEFLATED) as zf:
        # 1. agency.txt
        agency_io = io.StringIO()
        agency_writer = csv.writer(agency_io)
        agency_writer.writerow(["agency_id", "agency_name", "agency_url", "agency_timezone", "agency_lang", "agency_phone"])
        agency_writer.writerow(["BMTC", "Bengaluru Metropolitan Transport Corporation", "https://mybmtc.karnataka.gov.in", "Asia/Kolkata", "en", "18004251663"])
        zf.writestr("agency.txt", agency_io.getvalue())

        # 2. stops.txt
        stops_io = io.StringIO()
        stops_writer = csv.writer(stops_io)
        stops_writer.writerow(["stop_id", "stop_name", "stop_lat", "stop_lon", "location_type"])
        for stop in stops:
            stops_writer.writerow([f"STOP_{stop.stop_no}", stop.name, stop.lat, stop.lng, 0])
        zf.writestr("stops.txt", stops_io.getvalue())

        # 3. routes.txt
        routes_io = io.StringIO()
        routes_writer = csv.writer(routes_io)
        routes_writer.writerow(["route_id", "agency_id", "route_short_name", "route_long_name", "route_type", "route_color"])
        routes_writer.writerow(["365J", "BMTC", "365J", "Majestic to Silk Board Via Bannerghatta", 3, "008000"])
        zf.writestr("routes.txt", routes_io.getvalue())

        # 4. trips.txt
        trips_io = io.StringIO()
        trips_writer = csv.writer(trips_io)
        trips_writer.writerow(["route_id", "service_id", "trip_id", "trip_headsign", "direction_id"])
        for bus in buses:
            trips_writer.writerow(["365J", "DAILY", f"TRIP_{bus.bus_id}", f"Silk Board Express", 0])
        zf.writestr("trips.txt", trips_io.getvalue())

        # 5. stop_times.txt
        st_io = io.StringIO()
        st_writer = csv.writer(st_io)
        st_writer.writerow(["trip_id", "arrival_time", "departure_time", "stop_id", "stop_sequence"])
        for bus in buses:
            for idx, stop in enumerate(stops):
                hour = 7 + (idx // 2)
                minute = (idx * 10) % 60
                arr_time = f"{hour:02d}:{minute:02d}:00"
                st_writer.writerow([f"TRIP_{bus.bus_id}", arr_time, arr_time, f"STOP_{stop.stop_no}", idx + 1])
        zf.writestr("stop_times.txt", st_io.getvalue())

    return buffer.getvalue()

def generate_gtfs_rt_vehicle_positions(db: Session) -> Dict[str, Any]:
    """Generates GTFS-Realtime compliant JSON structures for VehiclePositions & Occupancy Status"""
    buses = db.query(BusModel).all()
    entities = []

    for bus in buses:
        occupancy = "FEW_SEATS_AVAILABLE"
        pct = (bus.current_onboard / bus.max_capacity) if bus.max_capacity > 0 else 0
        if pct >= 0.9:
            occupancy = "FULL"
        elif pct >= 0.7:
            occupancy = "STANDING_ROOM_ONLY"
        elif pct <= 0.3:
            occupancy = "MANY_SEATS_AVAILABLE"

        entity = {
            "id": f"VP_{bus.bus_id}",
            "vehicle": {
                "trip": {
                    "trip_id": f"TRIP_{bus.bus_id}",
                    "route_id": bus.route_id
                },
                "position": {
                    "latitude": bus.lat or 12.9716,
                    "longitude": bus.lng or 77.5946,
                    "speed": bus.speed_kmh
                },
                "occupancy_status": occupancy,
                "vehicle": {
                    "id": bus.bus_id,
                    "label": bus.vehicle_no
                },
                "timestamp": int(datetime.utcnow().timestamp())
            }
        }
        entities.append(entity)

    return {
        "header": {
            "gtfs_realtime_version": "2.0",
            "incrementality": "FULL_DATASET",
            "timestamp": int(datetime.utcnow().timestamp())
        },
        "entity": entities
    }
