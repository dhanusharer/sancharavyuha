from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime

class BusBase(BaseModel):
    bus_id: str
    driver: str
    vehicle_no: str
    route_id: str = "365J"
    current_onboard: int
    max_capacity: int = 60
    status: str = "in_transit"
    fuel_type: str = "BS-VI Diesel"
    battery_soc: float = 100.0
    current_stop: Optional[int] = None
    destination_stop: Optional[int] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    speed_kmh: float = 25.0

class BusCreate(BusBase):
    pass

class BusResponse(BusBase):
    id: int
    last_updated: datetime

    model_config = ConfigDict(from_attributes=True)

class StopBase(BaseModel):
    stop_no: int
    name: str
    lat: float
    lng: float
    people_detected_cctv: int = 0
    waiting_passengers: int = 0
    congestion_level: str = "Moderate"
    action_required: str = "Normal Monitoring"
    incident: bool = False
    incident_description: Optional[str] = None

class StopCreate(StopBase):
    pass

class StopResponse(StopBase):
    id: int
    last_updated: datetime
    buses: List[BusResponse] = []

    model_config = ConfigDict(from_attributes=True)

class DispatchCreate(BaseModel):
    stop_no: int
    reason: Optional[str] = "Manual operator dispatch or AI high-demand trigger"

class DispatchResponse(BaseModel):
    id: int
    dispatch_id: str
    bus_id: str
    target_stop_no: int
    target_stop_name: str
    timestamp: datetime
    status: str
    reason: str
    predicted_wait_reduction_mins: float

    model_config = ConfigDict(from_attributes=True)

class SustainabilityMetricsResponse(BaseModel):
    id: int
    timestamp: datetime
    carbon_saved_kg: float
    fuel_saved_liters: float
    eco_score: int
    ev_readiness_pct: float
    active_ev_buses: int
    total_buses: int

    model_config = ConfigDict(from_attributes=True)

class PassengerFlowCreate(BaseModel):
    stop_no: int
    boarded_count: int
    alighted_count: int
    cctv_frame_count: int = 0

class PassengerFlowResponse(BaseModel):
    id: int
    stop_no: int
    timestamp: datetime
    boarded_count: int
    alighted_count: int
    cctv_frame_count: int

    model_config = ConfigDict(from_attributes=True)

class AnomalyAlertResponse(BaseModel):
    id: int
    alert_id: str
    stop_no: Optional[int] = None
    title: str
    severity: str
    description: str
    timestamp: datetime
    resolved: bool

    model_config = ConfigDict(from_attributes=True)

# --- AI-TOS v2.0 DECISION INTELLIGENCE SCHEMAS ---

class PolicyComplianceSchema(BaseModel):
    status: str = "PASS"  # PASS or BLOCKED
    driver_duty_hours: str = "5.2h / 8.0h (Valid)"
    ev_battery_soc: str = "82.0% (Valid >= 20%)"
    depot_reserve: str = "3 buses remaining (Valid)"
    details: Optional[str] = "All policy safety constraints satisfied."

class OptionTradeoffSchema(BaseModel):
    option_id: str  # A, B, C
    action: str
    wait_reduction_mins: float
    diesel_fuel_liters: float
    co2_emissions_kg: float
    risk_level: str  # Low, Medium, Critical
    policy_compliant: bool = True

class DecisionPackageResponse(BaseModel):
    decision_id: str
    mission_id: str
    timestamp: datetime
    problem: dict
    evidence: dict
    forecast: dict
    policy_compliance: PolicyComplianceSchema
    simulated_alternatives: List[OptionTradeoffSchema]
    recommendation: dict

class MissionResponse(BaseModel):
    mission_id: str
    name: str
    priority: str
    status: str
    corridor: str
    goals: dict
    operational_memory: dict
    active_decision_package: Optional[str] = None

