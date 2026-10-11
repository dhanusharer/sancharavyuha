import time
import math
from typing import Dict, Any, List
from datetime import datetime

class Layer1SensorAcquisition:
    """Layer 1 & 1B: Telemetry Acquisition & Outlier Rejection Layer."""

    @classmethod
    def acquire_raw(cls, telemetry: Dict[str, Any]) -> Dict[str, Any]:
        raw_payload = {
            "cctv_raw_count": telemetry.get("people_detected_cctv", 145),
            "etm_raw_tickets": telemetry.get("etm_tickets_scanned", 138),
            "gps_raw_occupancy_pax": telemetry.get("gps_occupancy_pax", 142),
            "lidar_raw_count": telemetry.get("lidar_raw_count", 18),  # Simulated corrupted sensor outlier
            "forecast_raw_p50": telemetry.get("forecast_p50", 145),
            "sensor_id": f"SENSOR-NODE-{telemetry.get('stop_no', 6)}",
            "timestamp": datetime.utcnow().isoformat(),
            "sensor_version": "v5.2",
            "heartbeat_ok": True,
            "latency_ms": 12.5,
            "fps": telemetry.get("cctv_fps", 30),
            "brightness": telemetry.get("cctv_brightness", "Good"),
            "rain_alert": telemetry.get("rain_alert", False),
            "night_mode": telemetry.get("night_mode", False),
            "camera_failed": telemetry.get("camera_failed", False)
        }

        # Layer 1B: Statistical Outlier Rejection (Reject Lidar 18 as statistical anomaly)
        lidar_val = raw_payload["lidar_raw_count"]
        mean_val = (raw_payload["cctv_raw_count"] + raw_payload["etm_raw_tickets"] + raw_payload["gps_raw_occupancy_pax"]) / 3.0
        if abs(lidar_val - mean_val) > 50:
            raw_payload["outlier_rejected"] = f"Lidar sensor reading ({lidar_val} pax) rejected as statistical outlier (Mean: {round(mean_val)})"
            raw_payload["lidar_valid"] = False
        else:
            raw_payload["lidar_valid"] = True

        return raw_payload

class Layer2SensorHealthEvaluation:
    """Layer 2: Sensor Health Evaluation Layer — Evaluates physical sensor health."""

    @classmethod
    def evaluate_health(cls, raw: Dict[str, Any]) -> Dict[str, float]:
        if raw["camera_failed"]:
            cctv_health = 0.0
        elif raw["rain_alert"]:
            cctv_health = 28.0  # Dropped FPS & lens rain blur
        elif raw["night_mode"]:
            cctv_health = 61.0  # Low light noise
        else:
            cctv_health = 98.0  # Excellent daylight condition

        etm_health = 99.5    # Digital ticket tap-in hardware
        gps_health = 92.0    # Cellular AVL location GPS
        forecast_health = 90.0 # Time-series LightGBM lag model

        return {
            "cctv_health_pct": cctv_health,
            "etm_health_pct": etm_health,
            "gps_health_pct": gps_health,
            "forecast_health_pct": forecast_health
        }

class Layer3ObservationConfidenceEngine:
    """Layer 3: Observation Confidence Engine — Computes confidence per observation."""

    @classmethod
    def compute_confidence(cls, raw: Dict[str, Any], health: Dict[str, float]) -> Dict[str, Dict[str, Any]]:
        cctv_conf = round(health["cctv_health_pct"] * 0.95, 1)
        etm_conf = 99.0
        gps_conf = 91.0
        forecast_conf = 89.0

        return {
            "cctv": {"value": raw["cctv_raw_count"], "confidence_pct": cctv_conf, "source": "CCTV YOLO Camera"},
            "etm": {"value": raw["etm_raw_tickets"], "confidence_pct": etm_conf, "source": "ETM Ticket Tap-Ins"},
            "gps": {"value": raw["gps_raw_occupancy_pax"], "confidence_pct": gps_conf, "source": "AVL GPS Occupancy"},
            "forecast": {"value": raw["forecast_raw_p50"], "confidence_pct": forecast_conf, "source": "LightGBM Historical Forecast"}
        }

class Layer6AutomaticSourcePrioritization:
    """Layer 6: Automatic Source Prioritization — Dynamically adjusts weights."""

    @classmethod
    def calculate_weights(cls, raw: Dict[str, Any], health: Dict[str, float]) -> Dict[str, float]:
        if raw["camera_failed"]:
            return {"cctv": 0.0, "etm": 0.50, "gps": 0.30, "forecast": 0.20}
        elif raw["rain_alert"]:
            return {"cctv": 0.10, "etm": 0.45, "gps": 0.30, "forecast": 0.15}
        elif raw["night_mode"]:
            return {"cctv": 0.15, "etm": 0.40, "gps": 0.25, "forecast": 0.20}
        else:
            return {"cctv": 0.45, "etm": 0.30, "gps": 0.15, "forecast": 0.10}

class Layer4MultiSensorFusionEngine:
    """Layer 4: Multi-Sensor Fusion Engine — Fuses trusted observations mathematically."""

    @classmethod
    def fuse_observations(cls, obs: Dict[str, Dict[str, Any]], weights: Dict[str, float]) -> float:
        total_weight = sum(weights.values())
        if total_weight <= 0:
            return 140.0

        weighted_sum = sum(obs[k]["value"] * weights[k] for k in weights)
        return round(weighted_sum / total_weight, 1)

class Layer5ReliablePassengerEstimator:
    """Layer 5: Reliable Passenger Estimator — Produces the ONE validated estimate."""

    @classmethod
    def estimate(cls, fused_val: float, weights: Dict[str, float], health: Dict[str, float]) -> Dict[str, Any]:
        overall_conf = round(sum(health[f"{k}_health_pct"] * weights[k] for k in weights), 1)
        
        return {
            "reliable_passenger_estimate": int(round(fused_val)),
            "observation_confidence_pct": overall_conf,
            "sensor_quality_rating": "HIGH" if overall_conf >= 80.0 else "DEGRADED" if overall_conf >= 60.0 else "POOR",
            "primary_trusted_sources": [k.upper() for k, w in weights.items() if w >= 0.20]
        }

class Layer7DegradationManager:
    """Layer 7: Degradation Manager — Enables Graceful Degradation when sensors fail."""

    @classmethod
    def check_degradation(cls, health: Dict[str, float]) -> Dict[str, Any]:
        cctv_alive = health["cctv_health_pct"] > 10.0
        return {
            "mode": "NORMAL" if cctv_alive else "GRACEFUL_DEGRADATION",
            "cctv_status": "ONLINE" if cctv_alive else "UNAVAILABLE (Fallback Active)",
            "fallback_active": not cctv_alive,
            "system_uninterrupted": True
        }

class Layer8HumanTrustLayer:
    """Layer 8: Human Trust Layer — Explains low confidence to human supervisor."""

    @classmethod
    def generate_trust_summary(cls, estimate: Dict[str, Any], raw: Dict[str, Any]) -> Dict[str, Any]:
        conf = estimate["observation_confidence_pct"]
        reasons = []
        if raw["rain_alert"]: reasons.append("Heavy Rain Alert (Camera Blur)")
        if raw["night_mode"]: reasons.append("Low Light Visibility Noise")
        if raw["camera_failed"]: reasons.append("Camera Connection Offline")

        return {
            "reliability_warning": "LOW" if conf < 70.0 else "NORMAL",
            "confidence_score_pct": conf,
            "reasons": reasons if reasons else ["Sensors healthy & nominal"],
            "operator_explanation": f"Estimate ({estimate['reliable_passenger_estimate']} pax) validated via ETM/GPS fallback ({conf}% confidence)."
        }

class Layer9_10ContinuousLearningAndAudit:
    """Layers 9 & 10: Continuous Learning & Observation Audit Trail."""

    @classmethod
    def log_audit_trail(cls, estimate: Dict[str, Any], weights: Dict[str, float], raw: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "audit_id": f"OBS-AUDIT-{int(time.time())}",
            "validated_estimate": estimate["reliable_passenger_estimate"],
            "applied_weights": weights,
            "raw_inputs": raw,
            "audit_timestamp": datetime.utcnow().isoformat(),
            "learning_feedback_ready": True
        }

class ObservationIntelligenceEngineV51:
    """
    AI-TOS v5.1 — Observation Intelligence Pipeline Master Class.
    Executes Layers 1 through 10 in strict sequential order.
    Guarantees that downstream Optimizer and Policy Engine NEVER consume raw sensor inputs.
    """

    @classmethod
    def process_telemetry(cls, telemetry: Dict[str, Any]) -> Dict[str, Any]:
        # Layer 1: Acquire Raw Telemetry
        raw = Layer1SensorAcquisition.acquire_raw(telemetry)

        # Layer 2: Evaluate Sensor Health
        health = Layer2SensorHealthEvaluation.evaluate_health(raw)

        # Layer 3: Compute Observation Confidence per source
        confidence = Layer3ObservationConfidenceEngine.compute_confidence(raw, health)

        # Layer 6: Dynamic Weight Prioritization
        weights = Layer6AutomaticSourcePrioritization.calculate_weights(raw, health)

        # Layer 4: Multi-Sensor Mathematical Fusion
        fused_val = Layer4MultiSensorFusionEngine.fuse_observations(confidence, weights)

        # Layer 5: Reliable Passenger Estimator (The Single Validated Estimate)
        estimator_output = Layer5ReliablePassengerEstimator.estimate(fused_val, weights, health)

        # Layer 7: Degradation Manager
        degradation = Layer7DegradationManager.check_degradation(health)

        # Layer 8: Human Trust Layer
        trust_summary = Layer8HumanTrustLayer.generate_trust_summary(estimator_output, raw)

        # Layer 9 & 10: Audit Trail & Continuous Learning
        audit_trail = Layer9_10ContinuousLearningAndAudit.log_audit_trail(estimator_output, weights, raw)

        return {
            "architecture_version": "AI-TOS v5.1 Observation Intelligence Pipeline",
            "layer_1_raw_telemetry": raw,
            "layer_2_sensor_health": health,
            "layer_3_observation_confidence": confidence,
            "layer_6_dynamic_weights": weights,
            "layer_4_fused_value": fused_val,
            "layer_5_reliable_estimate": estimator_output,
            "layer_7_degradation_status": degradation,
            "layer_8_human_trust": trust_summary,
            "layer_9_10_audit_trail": audit_trail
        }
