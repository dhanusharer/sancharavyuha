import requests
import json

class MetricPublisher:
    """Publishes CV line-crossing and crowd metrics to FastAPI REST & WebSocket server"""

    def __init__(self, backend_url: str = "http://localhost:8000/api/v1"):
        self.backend_url = backend_url

    def publish_passenger_flow(self, stop_no: int, boarded: int, alighted: int, cctv_count: int):
        endpoint = f"{self.backend_url}/stops/{stop_no}/passenger-flow"
        payload = {
            "stop_no": stop_no,
            "boarded_count": boarded,
            "alighted_count": alighted,
            "cctv_frame_count": cctv_count
        }

        try:
            res = requests.post(endpoint, json=payload, timeout=2.0)
            return res.status_code == 200
        except Exception:
            return False
