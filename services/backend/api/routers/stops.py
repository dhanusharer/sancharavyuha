from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

try:
    from database import get_db
    from models import StopModel, PassengerFlowModel
    from schemas import StopResponse, StopCreate, PassengerFlowCreate, PassengerFlowResponse
except ImportError:
    from services.backend.database import get_db
    from services.backend.models import StopModel, PassengerFlowModel
    from services.backend.schemas import StopResponse, StopCreate, PassengerFlowCreate, PassengerFlowResponse

router = APIRouter(prefix="/api/v1/stops", tags=["Bus Stops"])

@router.get("", response_model=List[StopResponse])
def get_all_stops(db: Session = Depends(get_db)):
    return db.query(StopModel).order_by(StopModel.stop_no).all()

@router.get("/{stop_no}", response_model=StopResponse)
def get_stop_by_no(stop_no: int, db: Session = Depends(get_db)):
    stop = db.query(StopModel).filter(StopModel.stop_no == stop_no).first()
    if not stop:
        raise HTTPException(status_code=404, detail=f"Stop #{stop_no} not found")
    return stop

@router.post("", response_model=StopResponse, status_code=status.HTTP_201_CREATED)
def create_stop(stop_data: StopCreate, db: Session = Depends(get_db)):
    existing = db.query(StopModel).filter(StopModel.stop_no == stop_data.stop_no).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Stop #{stop_data.stop_no} already exists")
    stop = StopModel(**stop_data.model_dump())
    db.add(stop)
    db.commit()
    db.refresh(stop)
    return stop

@router.post("/{stop_no}/passenger-flow", response_model=PassengerFlowResponse)
def record_passenger_flow(stop_no: int, flow_data: PassengerFlowCreate, db: Session = Depends(get_db)):
    stop = db.query(StopModel).filter(StopModel.stop_no == stop_no).first()
    if not stop:
        raise HTTPException(status_code=404, detail=f"Stop #{stop_no} not found")
    
    flow = PassengerFlowModel(
        stop_no=stop_no,
        boarded_count=flow_data.boarded_count,
        alighted_count=flow_data.alighted_count,
        cctv_frame_count=flow_data.cctv_frame_count
    )
    db.add(flow)
    
    # Update stop crowd count
    stop.people_detected_cctv = max(0, stop.people_detected_cctv + flow_data.boarded_count - flow_data.alighted_count)
    db.commit()
    db.refresh(flow)
    return flow
