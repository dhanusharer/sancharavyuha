import asyncio
from typing import Dict, Any, List, Callable
from datetime import datetime

class EventBusManager:
    """
    Pillar 7: Event-Driven Architecture Engine
    Publishes and dispatches operational events (PASSENGER_SURGE, BUS_BREAKDOWN, WEATHER_ALERT, TRAFFIC_INCIDENT)
    to trigger real-time re-optimization.
    """

    _listeners: Dict[str, List[Callable]] = {}
    _event_history: List[Dict[str, Any]] = []

    @classmethod
    def subscribe(cls, event_type: str, callback: Callable):
        if event_type not in cls._listeners:
            cls._listeners[event_type] = []
        cls._listeners[event_type].append(callback)

    @classmethod
    def publish(cls, event_type: str, payload: Dict[str, Any]):
        event_entry = {
            "event_type": event_type,
            "timestamp": datetime.utcnow().isoformat(),
            "payload": payload
        }
        cls._event_history.append(event_entry)

        # Notify active subscribers
        if event_type in cls._listeners:
            for callback in cls._listeners[event_type]:
                try:
                    callback(payload)
                except Exception as e:
                    print(f"EventBus error publishing {event_type}: {e}")

        return event_entry

    @classmethod
    def get_event_history(cls, limit: int = 10) -> List[Dict[str, Any]]:
        return cls._event_history[-limit:]
