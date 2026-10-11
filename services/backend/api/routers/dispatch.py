import random
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

try:
    from database import get_db
    from models import DispatchDecisionModel, StopModel, BusModel
    from schemas import DispatchCreate, DispatchResponse
except ImportError:
    from services.backend.database import get_db
    from services.backend.models import DispatchDecisionModel, StopModel, BusModel
    from services.backend.schemas import DispatchCreate, DispatchResponse

router = APIRouter(prefix="/api/v1/dispatch", tags=["Bus Dispatch Engine"])

@router.get("", response_model=List[DispatchResponse])
def get_dispatch_history(db: Session = Depends(get_db)):
    return db.query(DispatchDecisionModel).order_by(DispatchDecisionModel.timestamp.desc()).all()

@router.get("/decision-package")
def get_structured_decision_package(stop_no: int = 6, db: Session = Depends(get_db)):
    """AI-TOS v2.0 Decision Intelligence Endpoint: Generates a structured decision package with simulated alternatives A/B/C."""
    stop = db.query(StopModel).filter(StopModel.stop_no == stop_no).first()
    if not stop:
        stop_dict = {"stop_no": 6, "name": "Silk Board Junction", "waiting_passengers": 210, "people_detected_cctv": 185}
    else:
        stop_dict = {
            "stop_no": stop.stop_no,
            "name": stop.name,
            "waiting_passengers": stop.waiting_passengers,
            "people_detected_cctv": stop.people_detected_cctv,
            "last_updated": stop.last_updated.isoformat() if stop.last_updated else None
        }

    buses = db.query(BusModel).all()
    buses_list = [
        {
            "bus_id": b.bus_id,
            "driver": b.driver,
            "fuel_type": b.fuel_type,
            "battery_soc": b.battery_soc,
            "current_stop": b.current_stop
        }
        for b in buses
    ]

    try:
        from solver import ORToolsFleetSolver
    except ImportError:
        from services.optimizer.solver import ORToolsFleetSolver

    solver = ORToolsFleetSolver()
    return solver.generate_decision_package(stop_dict, buses_list, mission_id="MISSION-365J-014")

@router.get("/missions")
def get_active_missions(db: Session = Depends(get_db)):
    """AI-TOS v2.0 Mission Manager Endpoint: Returns active corridor missions."""
    return [
        {
            "mission_id": "MISSION-365J-014",
            "name": "Recover Silk Board Corridor Crowding",
            "priority": "Critical",
            "status": "Active",
            "corridor": "Route 365J (Majestic -> Silk Board)",
            "goals": {
                "target_max_queue": 40,
                "target_avg_wait_mins": 6.0,
                "target_eta_recovery_mins": 10.0
            },
            "operational_memory": {
                "historical_similar_event": "Heavy Rain on Friday 2025-11-07",
                "previous_successful_action": "Dispatched EV Spare Bus + Short-Turned Bus 04",
                "operator_override_history": "Operator preferred EV dispatch over diesel short-turn"
            },
            "active_decision_package": "DISP-2026-069"
        }
    ]

@router.post("", response_model=DispatchResponse, status_code=status.HTTP_201_CREATED)
def trigger_bus_dispatch(dispatch_req: DispatchCreate, db: Session = Depends(get_db)):

    stop = db.query(StopModel).filter(StopModel.stop_no == dispatch_req.stop_no).first()
    if not stop:
        raise HTTPException(status_code=404, detail=f"Target stop #{dispatch_req.stop_no} not found")

    new_bus_id = f"365J-SP{random.randint(10, 99)}"
    dispatch_id = f"DISP-{int(datetime.utcnow().timestamp())}"

    # Create new spare bus record
    spare_bus = BusModel(
        bus_id=new_bus_id,
        driver="Spare Fleet Driver",
        vehicle_no=f"KA-01-SP-{random.randint(1000, 9999)}",
        route_id="365J",
        current_onboard=0,
        max_capacity=60,
        status="dispatched",
        fuel_type="BS-VI Diesel",
        current_stop=1,
        destination_stop=dispatch_req.stop_no,
        lat=12.9716,
        lng=77.5946
    )
    db.add(spare_bus)

    # Create dispatch decision log
    decision = DispatchDecisionModel(
        dispatch_id=dispatch_id,
        bus_id=new_bus_id,
        target_stop_no=dispatch_req.stop_no,
        target_stop_name=stop.name,
        timestamp=datetime.utcnow(),
        status="dispatched",
        reason=dispatch_req.reason or "Automatic high-demand crowding resolution",
        predicted_wait_reduction_mins=round(random.uniform(10.0, 22.0), 1)
    )
    db.add(decision)
    db.commit()
    db.refresh(decision)

    return decision
