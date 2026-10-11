import os

try:
    from pydantic_settings import BaseSettings
    class Settings(BaseSettings):
        PROJECT_NAME: str = "Sanchara Vyuha"
        API_V1_STR: str = "/api/v1"
        DATABASE_URL: str = "sqlite:///./sanchara_vyuha.db"
        YOLO_MODEL: str = "yolov8s.pt"
        CONF_THRESHOLD: float = 0.5
        CARBON_FACTOR_DIESEL: float = 2.68
        GRID_FACTOR_EV: float = 0.72
        OVERCROWDING_THRESHOLD_PCT: float = 95.0
        MAX_WAIT_TIME_THRESHOLD_MINS: float = 15.0

        class Config:
            case_sensitive = True
    settings = Settings()
except Exception:
    class Settings:
        PROJECT_NAME: str = "Sanchara Vyuha"
        API_V1_STR: str = "/api/v1"
        DATABASE_URL: str = "sqlite:///./sanchara_vyuha.db"
        YOLO_MODEL: str = "yolov8s.pt"
        CONF_THRESHOLD: float = 0.5
        CARBON_FACTOR_DIESEL: float = 2.68
        GRID_FACTOR_EV: float = 0.72
        OVERCROWDING_THRESHOLD_PCT: float = 95.0
        MAX_WAIT_TIME_THRESHOLD_MINS: float = 15.0
    settings = Settings()
