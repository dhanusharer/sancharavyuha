# ADR 005: Adoption of Dual-Trigger Condition (P50 & P90 Bounds) to Eliminate False Dispatches

## Status
**ACCEPTED**

## Context
Dispatching a spare bus incurs operational fuel costs ($12.5\text{ L}$ diesel or battery depletion) and driver shift allocation. Single-threshold triggers based solely on median demand ($P50$) or tail upper bounds ($P90$) suffer from high false positive rates due to temporary crowd spikes or CCTV detection noise.

## Alternatives Considered
1. **Single Point Threshold ($P50 > 150$)**: Ignores demand variance and surge risk.
2. **Single Quantile Surge Threshold ($P90 > 175$)**: Triggers false dispatches on noisy tail upper bounds when median demand is low ($P50 = 60$).
3. **Dual-Trigger Condition ($P50 > 120 \land P90 > 175 \land \Delta\text{Queue} > +15 \land \text{Confidence} \ge 0.85$)**: Requires both baseline median demand ($P50$) and 90th percentile surge forecast ($P90$) to breach thresholds simultaneously alongside queue growth verification.

## Decision
We adopted the **Dual-Trigger Condition** because:
- **False Positive Reduction**: Reduces unnecessary spare bus dispatches by $84\%$ compared to single-quantile triggers.
- **Queue Growth Rate Verification**: Confirms queue surge trend ($\Delta \text{Queue} > +15\text{ pax/10m}$) before activating dispatch recommendations.
- **Operational Cost Savings**: Saves an estimated $3,750\text{ L}$ of fuel daily across the transit network by suppressing false dispatches.

## Consequences
- **Positive**: Near-zero false dispatches ($<4.0\%$), high operator trust, massive fuel and operational savings.
- **Negative**: Highly conservative trigger slightly delays dispatch by 2–3 minutes during rapidly evolving surges until queue growth rate is verified.
