import logging
import json
import time
from typing import Dict, Any

class StructuredJsonFormatter(logging.Formatter):
    """Formats log entries as structured JSON with ISO timestamps and performance metrics for Phase B Production Hardening."""

    def format(self, record: logging.LogRecord) -> str:
        log_data: Dict[str, Any] = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }

        # Structured Decision Fields
        for attr in ["decision_id", "mission_id", "route", "forecast_p50", "forecast_p90", "policy_passed", "solver_latency_ms", "decision_latency_ms", "recommended_option"]:
            if hasattr(record, attr):
                log_data[attr] = getattr(record, attr)

        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)

        return json.dumps(log_data)

def setup_structured_logging():
    """Initializes production structured logging for Sanchara Vyuha backend."""
    logger = logging.getLogger("sanchara_vyuha")
    logger.setLevel(logging.INFO)

    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(StructuredJsonFormatter())
        logger.addHandler(handler)

    return logger

logger = setup_structured_logging()
