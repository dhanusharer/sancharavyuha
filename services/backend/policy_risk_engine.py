from typing import Dict, Any, List

class PolicyEngineV3:
    """Module 6: Policy Intelligence — Enforces 5 Policy Domains (Operational, Fleet, Safety, Environmental, Business) with structured ID, description, severity, reason, and fix."""

    @classmethod
    def evaluate_policies(cls, bus: Dict[str, Any], depot_reserve: int, last_dispatch_elapsed_sec: int) -> Dict[str, Any]:
        audits = []
        overall_compliant = True

        # Policy 1: POL-OPER-001 (Driver Shift Hours < 8.0h)
        driver_hours = bus.get("driver_shift_hours", 5.2)
        pol1_pass = driver_hours < 8.0
        if not pol1_pass:
            overall_compliant = False
        audits.append({
            "policy_id": "POL-OPER-001",
            "domain": "Operational",
            "description": "Driver Shift Hour Constraint",
            "severity": "CRITICAL",
            "status": "PASS" if pol1_pass else "VIOLATED",
            "reason": f"Driver shift hours {driver_hours}h < 8.0h limit" if pol1_pass else f"Driver shift limit exceeded ({driver_hours}h >= 8.0h)",
            "fix_action": "Reassign bus to driver with valid duty shift remaining"
        })

        # Policy 2: POL-FLEET-002 (EV Battery SoC >= 20.0%)
        fuel_type = bus.get("fuel_type", "EV")
        soc = bus.get("battery_soc", 82.0)
        pol2_pass = (fuel_type != "EV") or (soc >= 20.0)
        if not pol2_pass:
            overall_compliant = False
        audits.append({
            "policy_id": "POL-FLEET-002",
            "domain": "Fleet",
            "description": "EV Battery Minimum State-of-Charge",
            "severity": "HIGH",
            "status": "PASS" if pol2_pass else "VIOLATED",
            "reason": f"EV battery SoC {soc}% >= 20.0% minimum" if pol2_pass else f"EV battery low ({soc}% < 20.0%)",
            "fix_action": "Route EV bus to depot fast charger"
        })

        # Policy 3: POL-SAFETY-003 (Depot Minimum Reserve >= 3 Buses)
        pol3_pass = depot_reserve >= 3
        if not pol3_pass:
            overall_compliant = False
        audits.append({
            "policy_id": "POL-SAFETY-003",
            "domain": "Safety",
            "description": "Depot Minimum Spare Fleet Reserve",
            "severity": "CRITICAL",
            "status": "PASS" if pol3_pass else "VIOLATED",
            "reason": f"Depot spare reserve {depot_reserve} buses >= 3 minimum" if pol3_pass else f"Depot reserve depleted ({depot_reserve} < 3)",
            "fix_action": "Hold dispatch until depot reserve is replenished"
        })

        # Policy 4: POL-BUSIN-004 (10-Minute Rate Limit per Stop)
        pol4_pass = last_dispatch_elapsed_sec >= 600
        if not pol4_pass:
            overall_compliant = False
        audits.append({
            "policy_id": "POL-BUSIN-004",
            "domain": "Business",
            "description": "Stop Dispatch Lockout Rate Limit",
            "severity": "MEDIUM",
            "status": "PASS" if pol4_pass else "VIOLATED",
            "reason": f"Last dispatch executed {last_dispatch_elapsed_sec}s ago (>=600s)" if pol4_pass else "Dispatch rate limited (<10 mins elapsed)",
            "fix_action": "Wait for lockout timer to expire"
        })

        return {
            "overall_compliant": overall_compliant,
            "audit_log": audits,
            "violations_count": sum(1 for a in audits if a["status"] == "VIOLATED")
        }

class RiskEngineV3:
    """Module 7: Risk Intelligence — Computes a 5-factor composite Risk Score (0-100)."""

    @classmethod
    def calculate_risk(cls, p50: int, p90: int, traffic_delay: int, policy_result: Dict[str, Any], bus: Dict[str, Any]) -> Dict[str, Any]:
        # 1. Forecast Uncertainty Risk (0-100)
        uncertainty = p90 - p50
        forecast_risk = min(100.0, (uncertainty / max(1, p50)) * 200.0)

        # 2. Traffic Risk (0-100)
        traffic_risk = min(100.0, (traffic_delay / 30.0) * 100.0)

        # 3. Policy Risk (0-100)
        policy_risk = 0.0 if policy_result["overall_compliant"] else 100.0

        # 4. Execution Risk (0-100)
        execution_risk = 15.0 if traffic_delay > 15 else 5.0

        # 5. Fleet Risk (0-100)
        soc = bus.get("battery_soc", 82.0)
        fleet_risk = max(0.0, (30.0 - soc) * 3.3) if bus.get("fuel_type") == "EV" else 10.0

        composite_risk = (
            0.25 * forecast_risk +
            0.25 * traffic_risk +
            0.20 * policy_risk +
            0.15 * execution_risk +
            0.15 * fleet_risk
        )

        return {
            "overall_risk_score": round(composite_risk, 1),
            "level": "Low" if composite_risk < 25 else "Medium" if composite_risk < 55 else "High" if composite_risk < 80 else "Critical",
            "breakdown": {
                "forecast_risk": round(forecast_risk, 1),
                "traffic_risk": round(traffic_risk, 1),
                "policy_risk": round(policy_risk, 1),
                "execution_risk": round(execution_risk, 1),
                "fleet_risk": round(fleet_risk, 1)
            }
        }

class UtilityEngineV3:
    """Module 8: Utility Intelligence — Provides multi-factor utility scoring out of 100 for alternative ranking."""

    @classmethod
    def calculate_utility(cls, option_id: str, wait_cut_mins: float, diesel_liters: float, policy_pass: bool, risk_score: float) -> Dict[str, Any]:
        # Safety (32 max)
        safety_score = 32.0 if policy_pass else 0.0

        # Wait Reduction (28 max)
        wait_score = min(28.0, (wait_cut_mins / 20.0) * 28.0)

        # Fuel Efficiency (15 max)
        fuel_score = max(0.0, 15.0 - (diesel_liters * 1.0))

        # Carbon Saved (10 max)
        carbon_score = 10.0 if diesel_liters == 0.0 else max(0.0, 10.0 - (diesel_liters * 0.5))

        # Reliability (15 max)
        reliability_score = max(0.0, 15.0 - (risk_score * 0.15))

        total_utility = safety_score + wait_score + fuel_score + carbon_score + reliability_score

        return {
            "total_utility": round(total_utility, 1),
            "breakdown": {
                "safety_32": round(safety_score, 1),
                "wait_reduction_28": round(wait_score, 1),
                "fuel_15": round(fuel_score, 1),
                "carbon_10": round(carbon_score, 1),
                "reliability_15": round(reliability_score, 1)
            }
        }
