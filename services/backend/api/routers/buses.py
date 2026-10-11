from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

try:
    from database import get_db
    from models import BusModel
    from schemas import BusResponse, BusCreate
except ImportError:
    from services.backend.database import get_db
    from services.backend.models import BusModel
    from services.backend.schemas import BusResponse, BusCreate

router = APIRouter(prefix="/api/v1/buses", tags=["Buses Fleet"])

@router.get("", response_model=List[BusResponse])
def get_all_buses(db: Session = Depends(get_db)):
    return db.query(BusModel).all()

@router.get("/{bus_id}", response_model=BusResponse)
def get_bus_by_id(bus_id: str, db: Session = Depends(get_db)):
    bus = db.query(BusModel).filter(BusModel.bus_id == bus_id).first()
    if not bus:
        raise HTTPException(status_code=404, detail=f"Bus {bus_id} not found")
    return bus

@router.post("", response_model=BusResponse, status_code=status.HTTP_201_CREATED)
def create_bus(bus_data: BusCreate, db: Session = Depends(get_db)):
    existing = db.query(BusModel).filter(BusModel.bus_id == bus_data.bus_id).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Bus {bus_data.bus_id} already exists")
    bus = BusModel(**bus_data.model_dump())
    db.add(bus)
    db.commit()
    db.refresh(bus)
    return bus
