from typing import Dict, Any, List

class OperationalPlaybooksEngine:
    """
    Pillar 13: Operational Playbooks Engine
    Loads domain-specific playbook rules (Heavy Rain, Festival, Metro Collapse, Traffic Jam)
    and dynamically adjusts decision constraints and priority weights.
    """

    PLAYBOOKS = {
        "heavy_rain": {
            "name": "Heavy Monsoon Rain Emergency Playbook",
            "trigger_condition": "IMD Rain Alert = Active or Precip > 15mm/h",
            "adaptive_dispatch_threshold": 150,  # Lower threshold (150 vs 180 pax)
            "weight_adjustments": {"alpha_wait": 0.75, "beta_fuel": 0.15, "gamma_risk": 0.10},
            "override_rules": [
                "Bypass diesel vehicles in clean air zones if EV battery >= 20%",
                "Enable express deadhead via flyover corridors",
                "Set stop lockout to 450s (tighter headway)"
            ]
        },
        "festival": {
            "name": "Festival Holiday High-Surge Playbook",
            "trigger_condition": "Holiday Calendar = True or Special Event = True",
            "adaptive_dispatch_threshold": 120,  # Lower threshold (120 pax)
            "weight_adjustments": {"alpha_wait": 0.65, "beta_fuel": 0.25, "gamma_risk": 0.10},
            "override_rules": [
                "Activate multi-route borrowing from underloaded suburban routes",
                "Pre-position 2 spare buses at Satellite Holding Bays 30 mins before peak"
            ]
        },
        "metro_collapse": {
            "name": "Namma Metro Breakdown Recovery Playbook",
            "trigger_condition": "Metro Line Status = Failure or Delay > 20m",
            "adaptive_dispatch_threshold": 100,  # Emergency threshold (100 pax)
            "weight_adjustments": {"alpha_wait": 0.85, "beta_fuel": 0.10, "gamma_risk": 0.05},
            "override_rules": [
                "Activate immediate Level 4 Vehicle Swap from Metro feeder lines",
                "Set max driver shift ceiling to 8.5h under emergency declaration"
            ]
        },
        "traffic_jam": {
            "name": "Severe Traffic Bottleneck Bypass Playbook",
            "trigger_condition": "TomTom Delay > 15 mins",
            "adaptive_dispatch_threshold": 160,
            "weight_adjustments": {"alpha_wait": 0.70, "beta_fuel": 0.20, "gamma_risk": 0.10},
            "override_rules": [
                "Activate Level 5 Traffic-Aware Deadhead bypassing jammed stops",
                "Execute Level 6 Short-Turn loop prior to bottleneck junction"
            ]
        }
    }

    @classmethod
    def get_active_playbook(cls, context: Dict[str, Any]) -> Dict[str, Any]:
        """Identifies and activates the best operational playbook for current context."""
        rain = context.get("rain_alert", False)
        traffic_delay = context.get("traffic_delay_mins", 0) > 15
        is_festival = context.get("is_festival", False)
        metro_down = context.get("metro_breakdown", False)

        if metro_down:
            playbook_key = "metro_collapse"
        elif rain:
            playbook_key = "heavy_rain"
        elif is_festival:
            playbook_key = "festival"
        elif traffic_delay:
            playbook_key = "traffic_jam"
        else:
            return {
                "active_playbook": "Standard Timetable Playbook",
                "adaptive_dispatch_threshold": 180,
                "weight_adjustments": {"alpha_wait": 0.60, "beta_fuel": 0.30, "gamma_risk": 0.10},
                "override_rules": ["Maintain standard fixed timetable headways"]
            }

        selected = cls.PLAYBOOKS[playbook_key]
        return {
            "active_playbook_key": playbook_key,
            "active_playbook": selected["name"],
            "trigger_condition": selected["trigger_condition"],
            "adaptive_dispatch_threshold": selected["adaptive_dispatch_threshold"],
            "weight_adjustments": selected["weight_adjustments"],
            "override_rules": selected["override_rules"]
        }
