class AnomalyRules:
    OVERCROWDING_THRESHOLD_PCT = 95.0        # Occupancy > 95%
    OVERCROWDING_DURATION_MINS = 10.0       # Duration >= 10 mins
    CAMERA_OFFLINE_HEARTBEAT_SECS = 30       # Camera heartbeat missing >= 30 secs
    PASSENGER_SPIKE_SIGMA_THRESHOLD = 3.0    # 3-sigma statistical surge
    BUS_DELAY_THRESHOLD_MINS = 15.0         # Delay > 15 mins
    FORECAST_ERROR_SPIKE_PCT = 40.0          # Actual vs P90 error > 40%
