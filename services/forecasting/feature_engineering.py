import pandas as pd  # type: ignore
import numpy as np  # type: ignore
from datetime import datetime
from typing import Dict, Any

class FeatureEngineeringPipeline:
    """Builds lag features, rolling statistics, weather flags, and GTFS attributes for LightGBM Quantile Forecasting"""

    @classmethod
    def transform_input_features(cls, raw_input: Dict[str, Any]) -> Dict[str, Any]:
        """
        Transforms raw live observation into feature-engineered vector for model inference
        """
        current_time = datetime.utcnow()
        hour = current_time.hour
        day_of_week = current_time.weekday()
        month = current_time.month
        is_weekend = 1 if day_of_week in [5, 6] else 0
        is_peak_hour = 1 if (7 <= hour <= 9 or 17 <= hour <= 20) else 0

        # Raw counts
        boarded = raw_input.get("boarded_count", 35)
        alighted = raw_input.get("alighted_count", 12)
        net_occupancy_change = boarded - alighted
        current_waiting = raw_input.get("waiting_passengers", 95)

        # Lag features (simulated / historical window)
        demand_lag_1h = current_waiting * 0.92
        demand_lag_2h = current_waiting * 0.85
        demand_lag_24h = current_waiting * 0.98
        demand_lag_7d = current_waiting * 1.05

        # Rolling statistics
        rolling_mean_3h = (demand_lag_1h + demand_lag_2h + current_waiting) / 3.0
        rolling_mean_24h = (demand_lag_24h + current_waiting) / 2.0
        rolling_std = abs(demand_lag_1h - current_waiting) * 0.5

        # Weather & Events
        weather_rain = raw_input.get("rain_flag", 0)
        temp_c = raw_input.get("temperature_c", 27.5)
        special_event = raw_input.get("special_event_flag", 0)

        return {
            "hour": hour,
            "day_of_week": day_of_week,
            "month": month,
            "is_weekend": is_weekend,
            "is_peak_hour": is_peak_hour,
            "boarded_count": boarded,
            "alighted_count": alighted,
            "net_occupancy_change": net_occupancy_change,
            "current_waiting": current_waiting,
            "demand_lag_1h": demand_lag_1h,
            "demand_lag_2h": demand_lag_2h,
            "demand_lag_24h": demand_lag_24h,
            "demand_lag_7d": demand_lag_7d,
            "rolling_mean_3h": rolling_mean_3h,
            "rolling_mean_24h": rolling_mean_24h,
            "rolling_std": rolling_std,
            "weather_rain": weather_rain,
            "temperature_c": temp_c,
            "special_event": special_event,
            "gtfs_stop_no": raw_input.get("stop_no", 1)
        }
