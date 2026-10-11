# ADR 004: Implementation of Deterministic Hard Policy Governance in the Decision Loop

## Status
**ACCEPTED**

## Context
AI-native decision systems deployed in public infrastructure must guarantee absolute safety and regulatory compliance. Delegating critical safety decisions (such as driver shift limits or EV battery minimums) to AI probability scores creates unacceptable risk of illegal dispatches or vehicle stranding.

## Alternatives Considered
1. **Soft Penalty in Objective Function**: Adding negative penalty weights for policy violations in ML or solver objective functions. Risk: High demand utility can overpower penalty weights, allowing illegal dispatches to execute.
2. **LLM Supervisory Agent**: Asking an LLM to review decision proposals. Risk: Non-deterministic hallucination, high latency ($>1\text{s}$), and zero audit guarantee.
3. **Deterministic Hard Policy Governance Engine**: An independent, rule-based Policy Engine that evaluates every proposed action against 5 policy domains (Operational, Fleet, Safety, Environmental, Business) and enforces a hard `PASS` vs `BLOCKED` gate.

## Decision
We implemented a **Deterministic Hard Policy Governance Engine** because:
- **Zero Policy Violations**: Guarantees $100\%$ compliance with driver shift laws ($<8.0\text{h}$), EV battery bounds ($\ge 20\%$), depot reserves ($\ge 3$ spare buses), and stop lockout rate limits ($10\text{m}$).
- **Structured Audit Trace**: Every audit check generates a structured policy log containing Policy ID, Severity, Status, Reason, and Fix Action.
- **Operator Confidence**: Public transit supervisors can verify exact legal compliance before approving dispatches.

## Consequences
- **Positive**: Absolute safety guarantee, zero legal or physical stranding risk, complete policy audit trail.
- **Negative**: Hard policy blocks prevent dispatch even in extreme emergencies unless overridden by authorized human supervisors.
