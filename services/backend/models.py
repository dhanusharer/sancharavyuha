from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime

try:
    from .database import Base
except ImportError:
    from database import Base

class StopModel(Base):
    __tablename__ = "stops"

    id = Column(Integer, primary_key=True, index=True)
    stop_no = Column(Integer, unique=True, index=True)
    name = Column(String, index=True)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    people_detected_cctv = Column(Integer, default=0)
    waiting_passengers = Column(Integer, default=0)
    congestion_level = Column(String, default="Moderate")  # Low, Moderate, High, Severe
    action_required = Column(String, default="Normal Monitoring")
    incident = Column(Boolean, default=False)
    incident_description = Column(String, nullable=True)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    buses = relationship("BusModel", back_populates="current_stop_rel")

class BusModel(Base):
    __tablename__ = "buses"

    id = Column(Integer, primary_key=True, index=True)
    bus_id = Column(String, unique=True, index=True)
    driver = Column(String, nullable=False)
    vehicle_no = Column(String, nullable=False)
    route_id = Column(String, default="365J")
    current_onboard = Column(Integer, default=0)
    max_capacity = Column(Integer, default=60)
    status = Column(String, default="in_transit") # in_transit, dispatched, maintenance, charging
    fuel_type = Column(String, default="BS-VI Diesel") # BS-VI Diesel, EV, CNG
    battery_soc = Column(Float, default=100.0) # State of Charge %
    current_stop = Column(Integer, ForeignKey("stops.stop_no"), nullable=True)
    destination_stop = Column(Integer, nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    speed_kmh = Column(Float, default=25.0)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    current_stop_rel = relationship("StopModel", back_populates="buses")

class DispatchDecisionModel(Base):
    __tablename__ = "dispatch_decisions"

    id = Column(Integer, primary_key=True, index=True)
    dispatch_id = Column(String, unique=True, index=True)
    bus_id = Column(String, index=True)
    target_stop_no = Column(Integer, ForeignKey("stops.stop_no"))
    target_stop_name = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="dispatched") # dispatched, en_route, arrived, completed
    reason = Column(Text, nullable=False)
    predicted_wait_reduction_mins = Column(Float, default=15.0)

class SustainabilityMetricsModel(Base):
    __tablename__ = "sustainability_metrics"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    carbon_saved_kg = Column(Float, default=1240.0)
    fuel_saved_liters = Column(Float, default=450.0)
    eco_score = Column(Integer, default=88)
    ev_readiness_pct = Column(Float, default=65.0)
    active_ev_buses = Column(Integer, default=14)
    total_buses = Column(Integer, default=42)

class PassengerFlowModel(Base):
    __tablename__ = "passenger_flow"

    id = Column(Integer, primary_key=True, index=True)
    stop_no = Column(Integer, ForeignKey("stops.stop_no"), index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    boarded_count = Column(Integer, default=0)
    alighted_count = Column(Integer, default=0)
    cctv_frame_count = Column(Integer, default=0)

class AnomalyAlertModel(Base):
    __tablename__ = "anomaly_alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(String, unique=True, index=True)
    stop_no = Column(Integer, ForeignKey("stops.stop_no"), nullable=True)
    title = Column(String, nullable=False)
    severity = Column(String, default="warning") # warning, critical, info
    description = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    resolved = Column(Boolean, default=False)
