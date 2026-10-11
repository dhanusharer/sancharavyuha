from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

try:
    from ..database import get_db
    from ..models import SustainabilityMetricsModel
    from ..schemas import SustainabilityMetricsResponse
except ImportError:
    from database import get_db
    from models import SustainabilityMetricsModel
    from schemas import SustainabilityMetricsResponse

router = APIRouter(prefix="/api/v1/sustainability", tags=["Sustainability Metrics"])

@router.get("", response_model=SustainabilityMetricsResponse)
def get_sustainability_metrics(db: Session = Depends(get_db)):
    metrics = db.query(SustainabilityMetricsModel).order_by(SustainabilityMetricsModel.timestamp.desc()).first()
    if not metrics:
        metrics = SustainabilityMetricsModel(
            timestamp=datetime.utcnow(),
            carbon_saved_kg=1240.5,
            fuel_saved_liters=450.0,
            eco_score=88,
            ev_readiness_pct=65.0,
            active_ev_buses=14,
            total_buses=42
        )
        db.add(metrics)
        db.commit()
        db.refresh(metrics)
    return metrics
