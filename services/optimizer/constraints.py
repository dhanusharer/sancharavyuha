from typing import Dict, Any

class FleetOptimizationConstraints:
    MIN_EV_BATTERY_SOC_PCT = 20.0       # Minimum battery required to dispatch
    MAX_CONTINUOUS_DRIVER_HOURS = 8.0   # Driver shift limit
    MAX_DEPOT_BAY_CAPACITY = 25          # Maximum buses per depot bay

    @classmethod
    def is_bus_eligible(cls, bus: Dict[str, Any]) -> bool:
        fuel_type = bus.get("fuel_type", "Diesel").upper()
        soc = bus.get("battery_soc", 100.0)

        # EV Battery Constraint
        if fuel_type in ["EV", "ELECTRIC"] and soc < cls.MIN_EV_BATTERY_SOC_PCT:
            return False

        # Status constraint
        status = bus.get("status", "in_transit")
        if status in ["maintenance", "charging"]:
            return False

        return True
