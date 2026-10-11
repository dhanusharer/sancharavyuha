# Sanchara Vyuha — Environmental Impact & Carbon Accounting Methodology
**Event:** WeMakeDevs × AWS Environmental Hacks 2026  
**Track:** Track 03 — Waste and Energy  
**Subtrack:** Public Transport & Green Mobility  
**Corridor:** Bengaluru Metropolitan Transport Corporation (BMTC) Route 365J (Majestic ↔ Silk Board Junction)  

---

## 1. Executive Summary

Urban bus transit operations often suffer from fixed-timetable inefficiencies. During peak surges, severe corridor crowding occurs (e.g. Silk Board Junction), leading to passenger delays and frustration. Conversely, during lull periods, standard operations run empty buses along full routes, generating excessive **deadhead mileage** and unnecessary diesel combustion.

**Sanchara Vyuha** implements an intelligent Operations Research (OR-Tools) dynamic dispatch solver that:
1. Detects corridor crowd surges using edge telemetry and LightGBM quantile demand forecasts.
2. Short-turns spare buses right at congestion pinch points instead of running full round-trip dead mileage from distant terminal holding bays.
3. Prioritizes zero-emission electric buses (EVs) for high-frequency city runs with battery State-of-Charge (SoC) management.
4. Preserves mandatory transit service guarantees (never dropping below a 15-minute headway).

---

## 2. Emission Factors & Physical Constants

Calculations adhere strictly to authoritative standards from the **Central Pollution Control Board (CPCB)**, the **Automotive Research Association of India (ARAI)**, and the **Central Electricity Authority (CEA) India**:

| Parameter | Standard Value | Unit | Source / Authority |
| :--- | :--- | :--- | :--- |
| **BS-VI Diesel Combustion Factor** | `2.68` | kg CO₂ / Liter | CPCB & IPCC Mobile Combustion Guidelines |
| **National Grid Emission Factor** | `0.72` | kg CO₂ / kWh | CEA India CO₂ Baseline Database v19 (2024–25) |
| **12m Urban Diesel Bus Consumption** | `0.33` (3.03 km/L) | Liters / km | ARAI Standard Urban Transit Duty Cycle |
| **12m Electric Bus (EV) Consumption** | `1.15` | kWh / km | BMTC Electric Bus Fleet Telemetry Benchmark |
| **Unoptimized Deadhead Penalty** | `14.8%` | of total trip distance | Historical transit depot terminal dead-running |
| **Service Headway Guarantee** | `≤ 15.0` | Minutes | Minimum regulatory transit service frequency |

---

## 3. Mathematical Formulation

### 3.1 Trip Level Carbon Accounting

For any bus trip of distance $D$ (in kilometers):

#### Diesel Bus (BS-VI Standard):
$$\text{Fuel Consumed (Liters)} = D \times 0.33$$
$$\text{Direct Tailpipe } \text{CO}_2 \text{ (kg)} = \text{Fuel Consumed} \times 2.68$$

#### Electric Bus (EV):
$$\text{Electricity Consumed (kWh)} = D \times 1.15$$
$$\text{Indirect Grid } \text{CO}_2 \text{ (kg)} = \text{Electricity Consumed} \times 0.72$$
$$\text{Direct Tailpipe } \text{CO}_2 = 0.0\text{ kg}$$

---

### 3.2 Baseline vs. Optimized Operations

#### Baseline Scenario (Static Schedule):
In static scheduled operations, fixed timetable dispatches run regardless of actual passenger queues. Returning buses to distant holding bays generates unoptimized deadhead mileage:

$$D_{\text{baseline}} = D_{\text{optimized}} \times (1 + \delta_{\text{deadhead}})$$

Where $\delta_{\text{deadhead}} = 0.148$ (14.8% dead mileage). In the baseline scenario, fleet electrification is unmanaged (assumed 90% diesel, 10% EV).

$$\text{Fuel}_{\text{baseline}} = (D_{\text{baseline}} \times 0.90) \times 0.33\text{ L/km}$$
$$\text{Energy}_{\text{baseline}} = (D_{\text{baseline}} \times 0.10) \times 1.15\text{ kWh/km}$$
$$\text{CO}_{2,\text{baseline}} = (\text{Fuel}_{\text{baseline}} \times 2.68) + (\text{Energy}_{\text{baseline}} \times 0.72)$$

#### Optimized Scenario (Sanchara Vyuha AI Dynamic Dispatch):
Sanchara Vyuha eliminates deadhead detours by short-turning buses dynamically and allocating available EV buses to high-congestion corridors:

$$D_{\text{optimized}} = N_{\text{trips}} \times L_{\text{corridor}}$$
$$\text{CO}_{2,\text{optimized}} = (\text{Fuel}_{\text{optimized}} \times 2.68) + (\text{Energy}_{\text{optimized}} \times 0.72)$$

#### Net Avoided Emissions:
$$\Delta \text{CO}_2 \text{ (Avoided)} = \text{CO}_{2,\text{baseline}} - \text{CO}_{2,\text{optimized}}$$
$$\Delta \text{Fuel (Saved Liters)} = \text{Fuel}_{\text{baseline}} - \text{Fuel}_{\text{optimized}}$$

---

## 4. Anti-Double-Counting Safeguards

1. **Direct Operational vs Modal Shift**:
   - Displaced private vehicle emissions (from passengers shifting from private two-wheelers/cars to public transit) are computed as a separate informational benchmark ($0.082\text{ kg CO}_2/\text{passenger-km}$) and **never combined** with direct fleet operational fuel savings.
2. **Headway Constraints**:
   - Trips are never cancelled indiscriminately to artificially deflate carbon scores. A minimum 15-minute headway is strictly enforced by the OR-Tools optimization constraint matrix.

---

## 5. Amazon S3 & CloudWatch Audit Trail

Every environmental calculation is audited:
- **Amazon S3**: Exported JSON packages containing full input parameters, passenger counts, fuel liters saved, and avoided carbon are stored under `s3://sanchara-vyuha-audit-archive-2026/audit-reports/`.
- **Amazon CloudWatch**: Real-time metrics are published to the custom namespace `SancharaVyuha/PublicTransport` under metric names `EmissionsAvoidedKg`, `FuelSavedLiters`, and `EcoScore`.
