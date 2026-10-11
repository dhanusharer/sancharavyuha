from typing import Dict, Any, List
from datetime import datetime

class EnterpriseDecisionStore:
    """
    Enterprise Decision Store Service:
    Persists decision contexts for auditability, replay analysis, and continuous learning queues.
    """

    _store: List[Dict[str, Any]] = []

    @classmethod
    def save_decision_context(cls, decision_context_dict: Dict[str, Any]):
        cls._store.append(decision_context_dict)
        return {"status": "SAVED", "trace_id": decision_context_dict["trace_id"]}

    @classmethod
    def get_recent_decisions(cls, limit: int = 10) -> List[Dict[str, Any]]:
        return cls._store[-limit:]
