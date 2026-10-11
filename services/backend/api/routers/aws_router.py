"""
Sanchara Vyuha AWS Cloud API Router
====================================
Official Track: WeMakeDevs x AWS Environmental Hacks 2026 - Track 03: Waste and Energy
Provides endpoints for:
- AWS Connectivity & Regional Status
- Amazon S3 Environmental Audit Report Archival
- Amazon CloudWatch Environmental KPIs Telemetry Push
- Archived Reports Inspection
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

try:
    from core.aws_service import aws_manager
    from services.optimizer.carbon_accounting import carbon_engine
except ImportError:
    from services.backend.core.aws_service import aws_manager
    from services.optimizer.carbon_accounting import carbon_engine

router = APIRouter(prefix="/api/v1/aws", tags=["AWS Cloud Integration"])


class MetricSyncRequest(BaseModel):
    avoided_co2_kg: Optional[float] = Field(default=None, description="Avoided CO2 in kg")
    fuel_saved_liters: Optional[float] = Field(default=None, description="Fuel saved in liters")
    eco_score: Optional[int] = Field(default=None, description="Eco score 0-100")
    ev_utilization_pct: Optional[float] = Field(default=None, description="EV fleet utilization percentage")
    active_buses: Optional[int] = Field(default=42, description="Active fleet count")


class S3ExportRequest(BaseModel):
    report_title: str = Field(default="BMTC Corridor 365J Sustainability Audit", description="Report title")
    include_methodology: bool = Field(default=True, description="Whether to include full methodology")
    notes: Optional[str] = Field(default="Automated environmental audit export for WeMakeDevs x AWS Hackathon", description="Audit notes")


@router.get("/status")
def get_aws_status() -> Dict[str, Any]:
    """
    Returns AWS Cloud connectivity, active region, S3 bucket status,
    and CloudWatch telemetry status with transparent live vs mock provider indication.
    """
    return aws_manager.get_service_status()


@router.post("/export-s3")
def export_environmental_audit_to_s3(request: S3ExportRequest) -> Dict[str, Any]:
    """
    Generates a full environmental sustainability audit package and archives it to Amazon S3
    (or local resilient mock adapter if AWS credentials are not configured).
    """
    # Generate live operational sustainability report
    eval_data = carbon_engine.evaluate_fleet_operations([], [])
    
    report_payload = {
        "title": request.report_title,
        "exported_at": eval_data.get("calculation_timestamp"),
        "notes": request.notes,
        "event": "WeMakeDevs x AWS Environmental Hacks 2026",
        "track": "Track 03 - Waste and Energy (Public Transport)",
        "environmental_metrics": eval_data,
        "routes_breakdown": carbon_engine.get_route_breakdown(),
        "aws_metadata": {
            "s3_bucket": aws_manager.bucket_name,
            "region": aws_manager.region,
            "cloudwatch_namespace": aws_manager.cw_namespace
        }
    }

    result = aws_manager.upload_audit_report(report_payload, filename_prefix="environmental_audit")
    return {
        "message": "Environmental Audit Report successfully exported to Amazon S3",
        "archive_details": result
    }


@router.post("/sync-cloudwatch")
def sync_metrics_to_cloudwatch(request: MetricSyncRequest) -> Dict[str, Any]:
    """
    Publishes live corridor environmental KPIs (CO2 Avoided, Fuel Saved, Eco Score)
    directly to Amazon CloudWatch under the SancharaVyuha/PublicTransport namespace.
    """
    # If values not explicitly provided, calculate from carbon engine
    if request.avoided_co2_kg is None or request.fuel_saved_liters is None:
        eval_data = carbon_engine.evaluate_fleet_operations([], [])
        avoided_co2 = eval_data["emissions_accounting"]["avoided_co2_kg"]
        fuel_saved = eval_data["fuel_and_energy"]["fuel_saved_liters"]
        eco_score = eval_data["emissions_accounting"]["eco_score"]
        ev_pct = eval_data["operational_metrics"]["ev_penetration_pct"]
        active_buses = eval_data["operational_metrics"]["active_fleet_count"]
    else:
        avoided_co2 = request.avoided_co2_kg
        fuel_saved = request.fuel_saved_liters
        eco_score = request.eco_score or 85
        ev_pct = request.ev_utilization_pct or 35.0
        active_buses = request.active_buses or 42

    result = aws_manager.publish_environmental_metrics(
        avoided_co2_kg=avoided_co2,
        fuel_saved_liters=fuel_saved,
        eco_score=eco_score,
        ev_utilization_pct=ev_pct,
        active_buses=active_buses
    )

    return {
        "message": "Environmental metrics published to Amazon CloudWatch",
        "telemetry_details": result
    }


@router.get("/archive")
def get_s3_archive_list() -> List[Dict[str, Any]]:
    """
    Returns list of archived environmental audit reports in Amazon S3 or local adapter.
    """
    return aws_manager.list_archived_reports()
