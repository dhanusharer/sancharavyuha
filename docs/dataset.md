# 📊 Sanchara Vyuha — Dataset Specification & Feature Engineering (`dataset.md`)

## 1. Overview & Data Sources

The **Sanchara Vyuha** platform utilizes a multi-source data model combining:
1. **Real-time Computer Vision Telemetry**: ByteTrack line-crossing passenger door counts (`boarded_count`, `alighted_count`, `net_occupancy_change`).
2. **ETM (Electronic Ticketing Machine) Transactions**: Ticket sales, student passes, UPI cashless payments.
3. **GTFS & GTFS-RT Telemetry**: Vehicle GPS positions, headways, delays, and stop sequence schedules.
4. **IMD Weather & Traffic Index**: Real-time rain alerts, temperature, and corridor congestion levels.

---

## 2. Feature Schema & Engineering Matrix

| Feature Name | Category | Data Type | Formula / Origin | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `gtfs_stop_no` | GTFS Identifier | Integer | `STOP_1` to `STOP_6` | Identifies bus stop corridor |
| `boarded_count` | CV Telemetry | Integer | ByteTrack Gate Crossing | Boarded passenger count |
| `alighted_count` | CV Telemetry | Integer | ByteTrack Gate Crossing | Alighted passenger count |
| `net_occupancy_change`| Derived CV | Integer | $\text{Boarded} - \text{Alighted}$ | Instantaneous queue change |
| `waiting_passengers` | CCTV Queue | Integer | YOLOv8 Box Queue Count | Total queue waiting at stop |
| `demand_t_1h` | Lag Feature | Float | Passenger count at $T-1\text{h}$ | Short-term momentum |
| `demand_t_2h` | Lag Feature | Float | Passenger count at $T-2\text{h}$ | 2-hour trend tracking |
| `demand_t_24h` | Lag Feature | Float | Passenger count at $T-24\text{h}$ | Daily seasonality |
| `demand_t_7d` | Lag Feature | Float | Passenger count at $T-7\text{d}$ | Weekly seasonality |
| `rolling_mean_3h` | Rolling Stat | Float | $\text{Mean}(\text{Demand}_{T-2\text{h}:T})$ | Smooth short-term baseline |
| `rolling_mean_24h`| Rolling Stat | Float | $\text{Mean}(\text{Demand}_{T-24\text{h}:T})$| Daily average baseline |
| `rolling_std` | Rolling Stat | Float | $\text{Std}(\text{Demand}_{T-3\text{h}:T})$ | Volatility measure |
| `weather_rain` | External Signal| Binary | $1 = \text{Rain}, 0 = \text{Clear}$ | Weather demand surge flag |
| `temperature_c` | External Signal| Float | Celsius reading | Weather comfort factor |
| `special_event` | Calendar Flag | Binary | $1 = \text{Match/Holiday}, 0 = \text{Normal}$| Sudden surge indicator |
| `is_peak_hour` | Temporal Flag | Binary | $1 = (7-9\text{AM} \cup 5-8\text{PM})$| Rush hour flag |
| `is_weekend` | Temporal Flag | Binary | $1 = \text{Sat/Sun}, 0 = \text{Weekday}$ | Weekend schedule adjustment |

---

## 3. Ground Truth Labels & Quantile Targets

- **Target Variable ($Y$)**: Passenger demand queue at time $T + 1\text{ hour}$.
- **Quantile Targets**:
  - $\alpha = 0.10 \rightarrow P10$ (Conservative 10th Percentile Bound)
  - $\alpha = 0.50 \rightarrow P50$ (Median Expected Demand)
  - $\alpha = 0.90 \rightarrow P90$ (Surge 90th Percentile Upper Bound)
