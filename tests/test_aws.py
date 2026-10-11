"""
Tests for Sanchara Vyuha AWS Cloud Integration
==============================================
WeMakeDevs x AWS Environmental Hacks 2026 - Track 03: Waste and Energy
"""

import pytest
from fastapi.testclient import TestClient
from services.backend.main import app
from services.backend.core.aws_service import aws_manager

client = TestClient(app)


def test_aws_manager_status():
    """Verify AWS manager returns valid status and connection state."""
    status = aws_manager.get_service_status()
    assert status["status"] == "operational"
    assert status["region"] == "ap-south-1"
    assert "s3" in status
    assert "cloudwatch" in status
    assert status["provider_mode"] in ["live_aws", "local_mock_adapter"]


def test_aws_s3_upload_and_list():
    """Verify S3 report upload and retrieval."""
    test_report = {
        "title": "Unit Test Sustainability Audit",
        "avoided_co2_kg": 250.0,
        "fuel_saved_liters": 85.0
    }
    upload_result = aws_manager.upload_audit_report(test_report, filename_prefix="unit_test_audit")
    assert upload_result["status"] == "success"
    assert "S3Uri" in upload_result
    assert "audit-reports/" in upload_result["Key"]

    # Verify listing includes the uploaded file
    archived = aws_manager.list_archived_reports()
    assert len(archived) > 0
    assert any("unit_test_audit" in item["Key"] for item in archived)


def test_aws_cloudwatch_publish():
    """Verify CloudWatch metrics publishing."""
    cw_res = aws_manager.publish_environmental_metrics(
        avoided_co2_kg=310.5,
        fuel_saved_liters=105.2,
        eco_score=89,
        ev_utilization_pct=45.0,
        active_buses=42
    )
    assert cw_res["status"] == "success"
    assert cw_res["Namespace"] == "SancharaVyuha/PublicTransport"


def test_aws_api_endpoints():
    """Verify FastAPI endpoints for AWS status, S3 export, and CloudWatch sync."""
    # GET /api/v1/aws/status
    status_resp = client.get("/api/v1/aws/status")
    assert status_resp.status_code == 200
    status_json = status_resp.json()
    assert status_json["status"] == "operational"

    # POST /api/v1/aws/export-s3
    export_resp = client.post("/api/v1/aws/export-s3", json={
        "report_title": "End-to-End Test Audit",
        "notes": "Automated verification test"
    })
    assert export_resp.status_code == 200
    export_json = export_resp.json()
    assert "archive_details" in export_json
    assert export_json["archive_details"]["status"] == "success"

    # POST /api/v1/aws/sync-cloudwatch
    sync_resp = client.post("/api/v1/aws/sync-cloudwatch", json={
        "avoided_co2_kg": 400.0,
        "fuel_saved_liters": 150.0,
        "eco_score": 92
    })
    assert sync_resp.status_code == 200
    sync_json = sync_resp.json()
    assert sync_json["telemetry_details"]["status"] == "success"

    # GET /api/v1/aws/archive
    archive_resp = client.get("/api/v1/aws/archive")
    assert archive_resp.status_code == 200
    assert isinstance(archive_resp.json(), list)
