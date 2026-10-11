# Sanchara Vyuha AI-TOS v6.0 FastAPI Backend Core Service
import os
import sys

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "../.."))

if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from fastapi import FastAPI
from sqlalchemy.orm import Session

try:
    from database import engine, Base, SessionLocal
    from core.config import settings
    from core.logger import logger
    from core.security import configure_security
    import models
    from api.routers import stops, buses, dispatch, sustainability, websocket, health, alerts, gtfs, forecasting, standards, aws_router
except ImportError:
    from services.backend.database import engine, Base, SessionLocal
    from services.backend.core.config import settings
    from services.backend.core.logger import logger
    from services.backend.core.security import configure_security
    from services.backend import models
    from services.backend.api.routers import stops, buses, dispatch, sustainability, websocket, health, alerts, gtfs, forecasting, standards, aws_router

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise-grade REST & WebSocket API for BMTC bus depot management, GTFS/GTFS-RT feeds, LightGBM quantile forecasting (P10/P50/P90), SHAP drivers, Anomaly Alerts, OR-Tools optimization, and AWS Cloud Integration (S3 & CloudWatch).",
    version="1.0.0"
)

# Configure Security & CORS
configure_security(app)

# Register Routers
app.include_router(health.router)
app.include_router(stops.router)
app.include_router(buses.router)
app.include_router(dispatch.router)
app.include_router(forecasting.router)
app.include_router(alerts.router)
app.include_router(sustainability.router)
app.include_router(aws_router.router)
app.include_router(gtfs.router)
app.include_router(standards.router)
app.include_router(websocket.router)

# Seed initial BMTC stops & buses if DB is empty
def seed_initial_data():
    db = SessionLocal()
    try:
        if db.query(models.StopModel).count() == 0:
            logger.info("Seeding initial BMTC stops data...")
            initial_stops = [
                models.StopModel(stop_no=1, name="Kempegowda Bus Station (Majestic)", lat=12.9779, lng=77.5724, people_detected_cctv=145, waiting_passengers=160, congestion_level="High", action_required="Dispatch Spare Bus"),
                models.StopModel(stop_no=2, name="Corporation", lat=12.9654, lng=77.5891, people_detected_cctv=78, waiting_passengers=85, congestion_level="Moderate", action_required="Normal Monitoring"),
                models.StopModel(stop_no=3, name="Shanthinagar Bus Station", lat=12.9554, lng=77.5932, people_detected_cctv=110, waiting_passengers=120, congestion_level="High", action_required="Monitor Closely"),
                models.StopModel(stop_no=4, name="Dairy Circle", lat=12.9388, lng=77.5994, people_detected_cctv=45, waiting_passengers=50, congestion_level="Low", action_required="Normal Monitoring"),
                models.StopModel(stop_no=5, name="Jayanagar 4th Block", lat=12.9298, lng=77.5828, people_detected_cctv=92, waiting_passengers=98, congestion_level="Moderate", action_required="Normal Monitoring"),
                models.StopModel(stop_no=6, name="Silk Board Junction", lat=12.9172, lng=77.6228, people_detected_cctv=185, waiting_passengers=210, congestion_level="Severe", action_required="Immediate Dispatch")
            ]
            db.add_all(initial_stops)
            db.commit()

        if db.query(models.BusModel).count() == 0:
            logger.info("Seeding initial BMTC buses data...")
            initial_buses = [
                models.BusModel(bus_id="365J-01", driver="Ramesh Kumar", vehicle_no="KA-01-F-1234", route_id="365J", current_onboard=48, max_capacity=60, status="in_transit", fuel_type="BS-VI Diesel", current_stop=1, destination_stop=6, lat=12.9779, lng=77.5724),
                models.BusModel(bus_id="365J-02", driver="Suresh Gowda", vehicle_no="KA-01-F-5678", route_id="365J", current_onboard=55, max_capacity=60, status="in_transit", fuel_type="EV", battery_soc=82.0, current_stop=2, destination_stop=6, lat=12.9654, lng=77.5891),
                models.BusModel(bus_id="365J-03", driver="Manjunath V", vehicle_no="KA-01-F-9101", route_id="365J", current_onboard=32, max_capacity=60, status="in_transit", fuel_type="EV", battery_soc=94.0, current_stop=3, destination_stop=6, lat=12.9554, lng=77.5932),
                models.BusModel(bus_id="365J-04", driver="Venkatesh P", vehicle_no="KA-01-F-1121", route_id="365J", current_onboard=60, max_capacity=60, status="in_transit", fuel_type="BS-VI Diesel", current_stop=6, destination_stop=1, lat=12.9172, lng=77.6228)
            ]
            db.add_all(initial_buses)
            db.commit()
    finally:
        db.close()

seed_initial_data()

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Sanchara Vyuha Enterprise AI Platform",
        "version": "1.0.0",
        "docs_url": "/docs",
        "healthcheck": "/health"
    }
