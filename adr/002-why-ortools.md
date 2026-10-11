# ADR 002: Selection of Google OR-Tools for Constrained Fleet Optimization over Deep Reinforcement Learning

## Status
**ACCEPTED**

## Context
Transit dispatching requires matching spare buses to overcrowded corridor stops while respecting strict physical, driver, and battery safety constraints. The optimization solver must guarantee $0.0\%$ constraint violations under all operational edge cases.

## Alternatives Considered
1. **Deep Reinforcement Learning (PPO / SAC)**: High sample inefficiency, risk of policy collapse during unobserved edge cases (e.g. extreme rain emergencies), zero mathematical guarantee of policy compliance, and black-box action selection.
2. **Heuristic Greedy Dispatch**: Fast execution but gets trapped in local optima and fails multi-objective trade-offs (balancing passenger wait cut vs diesel fuel burn).
3. **Google OR-Tools (Mixed Integer Linear Programming & Constraint Programming)**: Industry-grade mathematical optimization solver enforcing hard linear and non-linear bounds with deterministic global optimality.

## Decision
We chose **Google OR-Tools** because:
- **Zero Policy Violations**: Hard constraints (Driver shift $<8\text{h}$, EV battery $\ge 20\%$, Depot reserve $\ge 3$) are mathematically enforced; invalid actions are pruned before execution.
- **Dynamic Multi-Objective Cost Function**: Dynamic weighting $\alpha(t) \cdot \text{Wait} + \beta(t) \cdot \text{Fuel} + \gamma(t) \cdot \text{Risk}$ adapts to operational context (Peak Rush vs Rain Emergency vs Late Night).
- **Sub-15ms Latency**: Computes optimal fleet assignments across the entire corridor in under $12.0\text{ms}$.

## Consequences
- **Positive**: Guaranteed safety policy compliance, transparent objective function, sub-15ms solution speed.
- **Negative**: Requires explicit mathematical formulation of objective weights and constraints rather than implicit reward discovery.
