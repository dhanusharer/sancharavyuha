import os
from datetime import datetime
from typing import Dict, Any, List

class ModelRegistry:
    """Production Model Registry managing model artifacts, versioning, and status metadata"""
    def __init__(self):
        self.registry = {
            "lightgbm_quantile_v1": {
                "version": "1.2.0",
                "framework": "LightGBM 4.2.0",
                "status": "production",
                "quantiles": [0.10, 0.50, 0.90],
                "last_trained": datetime.utcnow().isoformat()
            },
            "lstm_baseline_v1": {
                "version": "1.0.0",
                "framework": "TensorFlow/Keras",
                "status": "baseline",
                "last_trained": datetime.utcnow().isoformat()
            }
        }

    def get_active_model_info(self) -> Dict[str, Any]:
        return self.registry["lightgbm_quantile_v1"]

    def list_models(self) -> Dict[str, Any]:
        return self.registry
