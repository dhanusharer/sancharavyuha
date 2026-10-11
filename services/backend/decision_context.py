import time
import uuid
from typing import Dict, Any, List
from datetime import datetime

class DecisionContext:
    """
    AI-TOS v5.2 Enterprise Single Pipeline Accumulator.
    Initializes with raw telemetry and evolves sequentially through every pipeline stage.
    """

    def __init__(self, stop_no: int, telemetry: Dict[str, Any], mission_id: str = None):
        self.trace_id = f"TRACE-{uuid.uuid4().hex[:8].upper()}"
        self.created_at = datetime.utcnow().isoformat()
        self.stop_no = stop_no
        self.mission_id = mission_id or f"MISSION-365J-{uuid.uuid4().hex[:4].upper()}"
        
        # Evolving Pipeline State Payloads
        self.raw_telemetry: Dict[str, Any] = {}
        self.reliable_observation: Dict[str, Any] = {}
        self.operational_context: Dict[str, Any] = {}
        self.demand_forecast: Dict[str, Any] = {}
        self.policy_audit: Dict[str, Any] = {}
        self.consensus_proposals: Dict[str, Any] = {}
        self.optimized_gate_action: Dict[str, Any] = {}
        self.simulated_decision: Dict[str, Any] = {}
        self.approved_mission: Dict[str, Any] = {}
        self.execution_result: Dict[str, Any] = {}
        self.learning_record: Dict[str, Any] = {}

        # Pipeline Observability Timings (Latency in ms)
        self.stage_latencies_ms: Dict[str, float] = {}

    def record_stage_latency(self, stage_name: str, latency_ms: float):
        self.stage_latencies_ms[stage_name] = round(latency_ms, 2)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "trace_id": self.trace_id,
            "mission_id": self.mission_id,
            "created_at": self.created_at,
            "stop_no": self.stop_no,
            "pipeline_stage_latencies_ms": self.stage_latencies_ms,
            "total_latency_ms": round(sum(self.stage_latencies_ms.values()), 2),
            "state_evolution": {
                "1_raw_telemetry": self.raw_telemetry,
                "2_reliable_observation": self.reliable_observation,
                "3_operational_context": self.operational_context,
                "4_demand_forecast": self.demand_forecast,
                "5_policy_audit": self.policy_audit,
                "6_consensus_proposals": self.consensus_proposals,
                "7_optimized_gate_action": self.optimized_gate_action,
                "8_simulated_decision": self.simulated_decision,
                "9_approved_mission": self.approved_mission,
                "10_learning_record": self.learning_record
            }
        }
