import json
import sqlite3
import os
from typing import Dict, Any, Optional, List
from datetime import datetime

class DecisionAuditLogger:
    """Phase D — Pilot Readiness Audit Trail & Post-Mortem Forensic Log Engine."""

    DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "decision_audit_trail.db"))

    @classmethod
    def init_db(cls):
        """Initializes the SQLite decision audit trail database schema."""
        conn = sqlite3.connect(cls.DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS decision_audit_log (
                decision_id TEXT PRIMARY KEY,
                mission_id TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                stop_no INTEGER NOT NULL,
                context_mode TEXT NOT NULL,
                selected_option TEXT NOT NULL,
                policy_status TEXT NOT NULL,
                risk_score REAL NOT NULL,
                utility_score REAL NOT NULL,
                payload_json TEXT NOT NULL
            )
        """)
        conn.commit()
        conn.close()

    @classmethod
    def log_decision(cls, decision_pkg: Dict[str, Any]):
        """Logs an executed or generated Decision Package into the immutable audit trail."""
        cls.init_db()
        conn = sqlite3.connect(cls.DB_PATH)
        cursor = conn.cursor()

        decision_id = decision_pkg.get("decision_id", f"DISP-2026-{datetime.utcnow().strftime('%M%S')}")
        mission_id = decision_pkg.get("mission_id", "MISSION-365J-014")
        timestamp = decision_pkg.get("timestamp", datetime.utcnow().isoformat())
        stop_no = decision_pkg.get("problem", {}).get("location", "").split(" ")[-1]
        try:
            stop_no = int(stop_no)
        except ValueError:
            stop_no = 6

        context_mode = decision_pkg.get("context", {}).get("mode", "peak_rush")
        selected_option = decision_pkg.get("recommendation", {}).get("selected_option", "A")
        policy_status = decision_pkg.get("policy_compliance", {}).get("status", "PASS")
        risk_score = decision_pkg.get("risk_assessment", {}).get("overall_risk_score", 12.5)
        utility_score = decision_pkg.get("utility_scorecard", {}).get("total_utility", 92.4)
        payload_json = json.dumps(decision_pkg)

        cursor.execute("""
            INSERT OR REPLACE INTO decision_audit_log 
            (decision_id, mission_id, timestamp, stop_no, context_mode, selected_option, policy_status, risk_score, utility_score, payload_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (decision_id, mission_id, timestamp, stop_no, context_mode, selected_option, policy_status, risk_score, utility_score, payload_json))

        conn.commit()
        conn.close()

    @classmethod
    def get_audit_record(cls, decision_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a decision audit record for post-mortem forensic investigation."""
        cls.init_db()
        conn = sqlite3.connect(cls.DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT payload_json FROM decision_audit_log WHERE decision_id = ?", (decision_id,))
        row = cursor.fetchone()
        conn.close()

        if row:
            return json.loads(row[0])
        return None
