import random
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

try:
    from ..database import get_db
    from ..models import DispatchDecisionModel, StopModel, BusModel
    from ..schemas import DispatchCreate, DispatchResponse
except ImportError:
    from database import get_db
    from models import DispatchDecisionModel, StopModel, BusModel
    from schemas import DispatchCreate, DispatchResponse

router = APIRouter(prefix="/api/v1/dispatch", tags=["Bus Dispatch Engine"])

@router.get("", response_model=List[DispatchResponse])
def get_dispatch_history(db: Session = Depends(get_db)):
    return db.query(DispatchDecisionModel).order_by(DispatchDecisionModel.timestamp.desc()).all()

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
