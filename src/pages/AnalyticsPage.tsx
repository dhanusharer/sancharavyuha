import React from 'react';
import { BarChart3, TrendingUp, Zap, Fuel, Leaf, Users, MapPin, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const hourlyDemandData = [
    { time: '06:00', P10: 45, P50: 80, P90: 110, Actual: 85 },
    { time: '07:00', P10: 90, P50: 140, P90: 185, Actual: 142 },
    { time: '08:00', P10: 160, P50: 210, P90: 280, Actual: 210 },
    { time: '09:00', P10: 180, P50: 245, P90: 310, Actual: 250 },
    { time: '10:00', P10: 130, P50: 175, P90: 220, Actual: 170 },
    { time: '11:00', P10: 85, P50: 120, P90: 160, Actual: 115 },
    { time: '12:00', P10: 90, P50: 130, P90: 170, Actual: 125 },
    { time: '17:00', P10: 140, P50: 195, P90: 260, Actual: 200 },
    { time: '18:00', P10: 190, P50: 270, P90: 340, Actual: 275 },
    { time: '19:00', P10: 170, P50: 230, P90: 290, Actual: 235 }
  ];

  const fuelSavedData = [
    { day: 'Mon', EV_KWh: 420, Diesel_Saved_L: 380, CO2_Saved_Kg: 1020 },
    { day: 'Tue', EV_KWh: 480, Diesel_Saved_L: 410, CO2_Saved_Kg: 1100 },
    { day: 'Wed', EV_KWh: 510, Diesel_Saved_L: 450, CO2_Saved_Kg: 1210 },
    { day: 'Thu', EV_KWh: 490, Diesel_Saved_L: 430, CO2_Saved_Kg: 1150 },
    { day: 'Fri', EV_KWh: 560, Diesel_Saved_L: 520, CO2_Saved_Kg: 1400 },
    { day: 'Sat', EV_KWh: 380, Diesel_Saved_L: 310, CO2_Saved_Kg: 830 },
    { day: 'Sun', EV_KWh: 320, Diesel_Saved_L: 280, CO2_Saved_Kg: 750 }
  ];

  const topStops = [
    { name: "Silk Board Junction", pax: 2480, congestion: "High (88%)", waitCut: "-18.5 min" },
    { name: "Majestic Bus Station", pax: 2150, congestion: "High (82%)", waitCut: "-15.2 min" },
    { name: "Electronic City Phase 1", pax: 1890, congestion: "Moderate (65%)", waitCut: "-12.0 min" },
    { name: "Shanthinagar TTMC", pax: 1420, congestion: "Moderate (54%)", waitCut: "-9.4 min" }
  ];

  return (
    <div className="p-6 space-y-6 font-mono bg-[#0B0F17] text-white min-h-screen">
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
        <div>
          <span className="badge-solid bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
            NETWORK ANALYTICS (WS-05)
          </span>
          <h1 className="text-xl font-bold text-white tracking-tight mt-1">Corridor Demand Curves & Quantile Forecasting Analytics</h1>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold">
          <Leaf className="h-4 w-4 text-emerald-400" />
          <span>ISO 14064 WTW CERTIFIED</span>
        </div>
      </div>

      {/* RECHARTS DEMAND CURVE GRAPH 1 */}
      <div className="bg-[#121824] border border-[#1E293B] rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b border-[#1E293B] pb-3">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              Corridor Commuter Queue Quantile Bounds (P10 vs P50 vs P90)
            </h2>
            <p className="text-[10px] text-neutral-400">LightGBM v3.1 Champion Quantile Model vs Live Sensors</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-emerald-400 font-bold">● P10 (Conservative)</span>
            <span className="text-cyan-400 font-bold">● P50 (Median)</span>
            <span className="text-rose-400 font-bold">● P90 (Surge Peak)</span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyDemandData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#1E293B', color: '#FFF' }} />
              <Area type="monotone" dataKey="P90" stroke="#EF4444" fill="#EF4444" fillOpacity={0.15} />
              <Area type="monotone" dataKey="P50" stroke="#00F0FF" fill="#00F0FF" fillOpacity={0.25} />
              <Area type="monotone" dataKey="P10" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECHARTS FUEL & CARBON GRAPH 2 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#121824] border border-[#1E293B] rounded-2xl p-5 space-y-3 shadow-xl">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#1E293B] pb-2">
            <Fuel className="h-4 w-4 text-emerald-400" />
            Weekly Diesel Saved (L) vs CO2 Carbon Cut (kg)
          </h2>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fuelSavedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#1E293B', color: '#FFF' }} />
                <Bar dataKey="Diesel_Saved_L" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="CO2_Saved_Kg" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TOP CONGESTED STOPS LIST */}
        <div className="bg-[#121824] border border-[#1E293B] rounded-2xl p-5 space-y-3 shadow-xl">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#1E293B] pb-2">
            <MapPin className="h-4 w-4 text-cyan-400" />
            Top Corridor Congestion & Intervention Ranking
          </h2>
          <div className="space-y-2">
            {topStops.map((stop, idx) => (
              <div key={idx} className="p-3 bg-[#161F30] border border-[#1E293B] rounded-xl flex justify-between items-center text-xs">
                <div>
                  <strong className="text-white block font-bold">{stop.name}</strong>
                  <span className="text-neutral-400 text-[10px]">Peak Congestion: {stop.congestion}</span>
                </div>
                <div className="text-right">
                  <strong className="text-emerald-400 block font-bold">{stop.waitCut} Cut</strong>
                  <span className="text-neutral-400 text-[10px]">{stop.pax} pax served</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
