"""
Sanchara Vyuha Sustainability & Green Mobility Router
=====================================================
Official Track: WeMakeDevs x AWS Environmental Hacks 2026 - Track 03: Waste and Energy
Subtrack: Public Transport

Features:
- Live corridor carbon accounting (trips analyzed, fuel consumed, avoided emissions)
- CPCB/ARAI emission factors & CEA India grid factors
- Route-by-route environmental impact breakdown
- 7-day historical sustainability trends
- Real-time What-If scenario simulation
- Full transparent calculation methodology
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

try:
    from database import get_db
    from models import SustainabilityMetricsModel, BusModel, StopModel
    from services.optimizer.carbon_accounting import carbon_engine
except ImportError:
    from services.backend.database import get_db
    from services.backend.models import SustainabilityMetricsModel, BusModel, StopModel
    from services.optimizer.carbon_accounting import carbon_engine

router = APIRouter(prefix="/api/v1/sustainability", tags=["Sustainability Metrics"])


class SimulationRequest(BaseModel):
    ev_fleet_ratio_pct: float = Field(default=50.0, ge=0.0, le=100.0, description="Target EV fleet percentage")
    demand_surge_pct: float = Field(default=20.0, ge=-50.0, le=200.0, description="Simulated demand increase")
    optimized_dispatch_enabled: bool = Field(default=True, description="Enable OR-Tools optimization")


@router.get("")
def get_comprehensive_sustainability_metrics(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Returns live corridor environmental impact metrics comparing baseline scheduled operations
    vs AI-optimized dynamic dispatch.
    """
    # Fetch real buses and stops from database
    buses = db.query(BusModel).all()
    stops = db.query(StopModel).all()

    buses_list = [
        {"bus_id": b.bus_id, "fuel_type": b.fuel_type, "battery_soc": b.battery_soc, "status": b.status}
        for b in buses
    ]
    stops_list = [
        {"stop_no": s.stop_no, "name": s.name, "waiting_passengers": s.waiting_passengers, "people_detected_cctv": s.people_detected_cctv}
        for s in stops
    ]

    report = carbon_engine.evaluate_fleet_operations(buses_list, stops_list)

    # Persist or update the latest summary metrics record in database
    latest_record = db.query(SustainabilityMetricsModel).order_by(SustainabilityMetricsModel.timestamp.desc()).first()
    avoided_co2 = report["emissions_accounting"]["avoided_co2_kg"]
    fuel_saved = report["fuel_and_energy"]["fuel_saved_liters"]
    eco_score = report["emissions_accounting"]["eco_score"]
    ev_pct = report["operational_metrics"]["ev_penetration_pct"]
    ev_count = report["operational_metrics"]["active_ev_buses"]
    total_buses = report["operational_metrics"]["active_fleet_count"]

    if not latest_record:
        latest_record = SustainabilityMetricsModel(
            timestamp=datetime.utcnow(),
            carbon_saved_kg=avoided_co2,
            fuel_saved_liters=fuel_saved,
            eco_score=eco_score,
            ev_readiness_pct=ev_pct,
            active_ev_buses=ev_count,
            total_buses=total_buses
        )
        db.add(latest_record)
        db.commit()
    else:
        latest_record.carbon_saved_kg = avoided_co2
        latest_record.fuel_saved_liters = fuel_saved
        latest_record.eco_score = eco_score
        latest_record.ev_readiness_pct = ev_pct
        latest_record.active_ev_buses = ev_count
        latest_record.total_buses = total_buses
        db.commit()

    # Enrich response with top-level fields for backwards-compatibility
    report["id"] = latest_record.id
    report["timestamp"] = latest_record.timestamp.isoformat()
    report["carbon_saved_kg"] = latest_record.carbon_saved_kg
    report["fuel_saved_liters"] = latest_record.fuel_saved_liters
    report["eco_score"] = latest_record.eco_score
    report["ev_readiness_pct"] = latest_record.ev_readiness_pct
    report["active_ev_buses"] = latest_record.active_ev_buses
    report["total_buses"] = latest_record.total_buses

    return report


@router.get("/routes")
def get_routes_sustainability_breakdown() -> List[Dict[str, Any]]:
    """
    Returns route-by-route environmental impact and fuel efficiency metrics across major BMTC corridors.
    """
    return carbon_engine.get_route_breakdown()


@router.get("/trends")
def get_sustainability_trends(days: int = Query(default=7, ge=1, le=30)) -> List[Dict[str, Any]]:
    """
    Returns daily historical trends for avoided emissions, fuel saved, EV adoption, and eco-score.
    """
    return carbon_engine.get_historical_trends(days=days)


@router.post("/simulate")
def simulate_sustainability_impact(scenario: SimulationRequest) -> Dict[str, Any]:
    """
    Interactive What-If simulation calculating projected fuel savings and CO2 reductions
    for hypothetical fleet electrification ratios and demand surges.
    """
    return carbon_engine.simulate_what_if_scenario(
        ev_fleet_ratio_pct=scenario.ev_fleet_ratio_pct,
        demand_surge_pct=scenario.demand_surge_pct,
        optimized_dispatch_enabled=scenario.optimized_dispatch_enabled
    )


@router.get("/methodology")
def get_sustainability_methodology() -> Dict[str, Any]:
    """
    Returns explicit documentation of formulas, standards, baseline definitions,
    and citations for hackathon evaluation and auditability.
    """
    return {
        "title": "Sanchara Vyuha Green Mobility Carbon Accounting Methodology",
        "official_event": "WeMakeDevs x AWS Environmental Hacks 2026",
        "track": "Track 03 - Waste and Energy (Public Transport)",
        "equations": {
            "diesel_emissions": "Distance_km * Consumption_L_per_km * 2.68 kg CO2/L",
            "ev_grid_emissions": "Distance_km * Consumption_kWh_per_km * 0.72 kg CO2/kWh",
            "baseline_trip_distance": "Optimized_Distance_km * (1 + 0.148 deadhead_penalty)",
            "avoided_co2": "Baseline_CO2 - Optimized_CO2"
        },
        "standards_and_citations": [
            "Central Pollution Control Board (CPCB) India: Standard BS-VI Diesel Emission Factor (2.68 kg CO2/L)",
            "Central Electricity Authority (CEA) India CO2 Baseline Database v19 (2024-25): National Grid Average (0.72 kg CO2/kWh)",
            "Automotive Research Association of India (ARAI): 12-meter Urban City Bus Duty Cycle Consumption Standards",
            "IPCC Guidelines for National Greenhouse Gas Inventories: Mobile Combustion in Road Transport"
        ],
        "safeguards": {
            "anti_double_counting": "Private vehicle modal shift displacements are documented separately and not lumped into direct depot fleet reductions.",
            "service_guarantee": "Dispatches never cancel service on low-demand corridors below the mandatory 15-minute headway threshold."
        }
    }
