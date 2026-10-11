import numpy as np
from typing import Dict, List, Any

class ModelEvaluator:
    """Computes MAE, RMSE, MAPE, and Pinball Loss for model evaluation and benchmarking"""

    @staticmethod
    def calculate_mae(y_true: List[float], y_pred: List[float]) -> float:
        return float(np.mean(np.abs(np.array(y_true) - np.array(y_pred))))

    @staticmethod
    def calculate_rmse(y_true: List[float], y_pred: List[float]) -> float:
        return float(np.sqrt(np.mean((np.array(y_true) - np.array(y_pred)) ** 2)))

    @staticmethod
    def calculate_mape(y_true: List[float], y_pred: List[float]) -> float:
        y_t, y_p = np.array(y_true), np.array(y_pred)
        return float(np.mean(np.abs((y_t - y_p) / np.maximum(y_t, 1.0))) * 100)

    @staticmethod
    def calculate_pinball_loss(y_true: List[float], y_pred: List[float], alpha: float) -> float:
        """Calculates Quantile Pinball Loss: L_alpha = max(alpha * e, (alpha - 1) * e)"""
        err = np.array(y_true) - np.array(y_pred)
        loss = np.maximum(alpha * err, (alpha - 1) * err)
        return float(np.mean(loss))

    @classmethod
    def evaluate_benchmark(cls, y_true: List[float], lightgbm_p50: List[float], lstm_baseline: List[float]) -> Dict[str, Any]:
        return {
            "lightgbm_quantile": {
                "mae": round(cls.calculate_mae(y_true, lightgbm_p50), 2),
                "rmse": round(cls.calculate_rmse(y_true, lightgbm_p50), 2),
                "mape": round(cls.calculate_mape(y_true, lightgbm_p50), 2),
                "pinball_loss_p50": round(cls.calculate_pinball_loss(y_true, lightgbm_p50, 0.50), 2)
            },
            "lstm_baseline": {
                "mae": round(cls.calculate_mae(y_true, lstm_baseline), 2),
                "rmse": round(cls.calculate_rmse(y_true, lstm_baseline), 2),
                "mape": round(cls.calculate_mape(y_true, lstm_baseline), 2),
                "pinball_loss_p50": round(cls.calculate_pinball_loss(y_true, lstm_baseline, 0.50), 2)
            }
        }
