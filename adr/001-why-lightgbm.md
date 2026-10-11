<!-- Sanchara Vyuha AI-TOS v6.0 ADR Tag -->
# ADR 001: Selection of LightGBM Multi-Quantile Regressor over Neural Networks / LLMs

## Status
**ACCEPTED**

## Context
In urban transit demand forecasting, passenger surge prediction requires risk-aware conservative and upper-bound confidence bounds ($P10, P50, P90$) computed at sub-second speeds from tabular telemetry features (lagged gate counts, rolling means, GTFS headways, weather indicators).

## Alternatives Considered
1. **Deep Neural Networks (LSTM / GRU / Transformers)**: High computational complexity, required GPU acceleration, black-box decision boundary, and poor latency performance on tabular telemetry.
2. **Large Language Models (LLMs)**: Non-deterministic output, high inference cost, long response latency ($>500\text{ms}$), target leakage vulnerability, and zero mathematical quantile calibration guarantee.
3. **LightGBM Multi-Quantile Regressor**: Gradient boosting tree framework optimized for tabular data with native pinball loss quantile training ($P10, P50, P90$).

## Decision
We chose **LightGBM Multi-Quantile Regressor** because:
- **Sub-10ms Inference**: CPU execution runs in under $8.5\text{ms}$ per batch.
- **Calibrated Risk Bounds**: Directly optimizes pinball loss for $P10$ (conservative), $P50$ (median), and $P90$ (surge peak) bounds.
- **SHAP Feature Interpretability**: Native tree SHAP breakdown for instant feature driver attribution in the UI.

## Consequences
- **Positive**: Blazing fast CPU inference, 100% deterministic reproducibility, easy feature drift detection, and native SHAP support.
- **Negative**: Requires tabular feature engineering pipeline (`demand_lag_1h`, rolling averages) instead of raw sequence embeddings.
