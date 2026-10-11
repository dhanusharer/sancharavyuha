# 📐 Sanchara Vyuha — Architecture Diagram & Presentation Slide (`architecture_diagram.md`)

```
                               ┌─────────────────────────┐
                               │   CCTV Camera Stream    │
                               └────────────┬────────────┘
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │    YOLOv8 Detection     │
                               └────────────┬────────────┘
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │   ByteTrack Tracking    │
                               └────────────┬────────────┘
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │  Virtual Gate Counter   │
                               │  (Boarded / Alighted)   │
                               └────────────┬────────────┘
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │   Feature Engineering   │
                               │ (Time/Weather/Lags/GTFS)│
                               └────────────┬────────────┘
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │ LightGBM Forecasting    │
                               │     (P10 / P50 / P90)   │
                               └────────────┬────────────┘
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │   SHAP Explainability   │
                               └────────────┬────────────┘
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │   OR-Tools Optimizer    │
                               └────────────┬────────────┘
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │   FastAPI + WebSockets  │
                               └────────────┬────────────┘
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │     React Dashboard     │
                               └─────────────────────────┘
```
