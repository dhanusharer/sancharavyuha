import React, { useState } from 'react';
import { Activity, TrendingUp, ShieldCheck, Zap, DollarSign, CloudRain, Flame, Layers, Clock, Award, Compass, Eye, ShieldAlert, Cpu, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { RealGISMap } from '../components/RealGISMap';

interface ExecutiveCommandCenterPageProps {
  dispatchTriggerCount?: number;
  onDispatchBus?: (busId?: string, stopName?: string) => void;
  onNavigateToSustainability?: () => void;
}

export const ExecutiveCommandCenterPage: React.FC<ExecutiveCommandCenterPageProps> = ({
  dispatchTriggerCount = 0,
  onDispatchBus,
  onNavigateToSustainability
}) => {
  const [mapMode, setMapMode] = useState<'normal' | 'depot_dispatch' | 'layered_allocation'>('normal');

  return (
    <div className="p-4 space-y-4 font-mono bg-[#0B0F17] text-white min-h-screen overflow-x-hidden">
      {/* HERO METRICS STRIP - PALANTIR GOTHAM TACTICAL DATA BAR */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#121824] border border-[#1E293B] hover:border-emerald-500/50 rounded-xl p-3 shadow-md relative overflow-hidden group transition">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
          <span className="text-[9px] text-neutral-400 block uppercase font-bold tracking-widest">NETWORK STATUS</span>
          <strong className="text-2xl text-emerald-400 font-black block tracking-tight my-0.5">98.7%</strong>
          <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.5 rounded inline-block">100% SLA COMPLIANT</span>
        </div>

        <div className="bg-[#121824] border border-[#1E293B] hover:border-cyan-500/50 rounded-xl p-3 shadow-md relative overflow-hidden group transition">
          <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-full blur-xl pointer-events-none"></div>
          <span className="text-[9px] text-neutral-400 block uppercase font-bold tracking-widest">ACTIVE MISSIONS</span>
          <strong className="text-2xl text-cyan-400 font-black block tracking-tight my-0.5">14</strong>
          <span className="text-[8px] font-bold text-cyan-400 bg-cyan-500/20 border border-cyan-500/30 px-1.5 py-0.5 rounded inline-block">1 ACTIVE SURGE</span>
        </div>

        <div className="bg-[#121824] border border-[#1E293B] hover:border-emerald-500/50 rounded-xl p-3 shadow-md relative overflow-hidden group transition">
          <span className="text-[9px] text-neutral-400 block uppercase font-bold tracking-widest">PASSENGER WAIT CUT</span>
          <strong className="text-2xl text-emerald-400 font-black block tracking-tight my-0.5">-18.5 min</strong>
          <span className="text-[8px] text-neutral-400 block">Corridor Average</span>
        </div>

        <button 
          onClick={onNavigateToSustainability}
          className="text-left bg-[#121824] border border-emerald-500/30 hover:border-emerald-500 rounded-xl p-3 shadow-md relative overflow-hidden group transition cursor-pointer"
          title="Click to view Environmental Impact & AWS Hub"
        >
          <span className="text-[9px] text-emerald-400 block uppercase font-bold tracking-widest flex items-center justify-between">
            <span>CARBON OFFSET</span>
            <span className="text-[10px]">➔</span>
          </span>
          <strong className="text-2xl text-emerald-400 font-black block tracking-tight my-0.5">10,030 kg</strong>
          <span className="text-[8px] text-emerald-400 bg-emerald-500/20 px-1 rounded block w-fit">CPCB / AWS Verified</span>
        </button>

        <button 
          onClick={onNavigateToSustainability}
          className="text-left bg-[#121824] border border-amber-500/30 hover:border-amber-500 rounded-xl p-3 shadow-md relative overflow-hidden group transition cursor-pointer"
          title="Click to view Fuel Optimization Hub"
        >
          <span className="text-[9px] text-amber-400 block uppercase font-bold tracking-widest flex items-center justify-between">
            <span>DIESEL FUEL SAVED</span>
            <span className="text-[10px]">➔</span>
          </span>
          <strong className="text-2xl text-amber-400 font-black block tracking-tight my-0.5">3,750 L</strong>
          <span className="text-[8px] text-amber-400 bg-amber-500/20 px-1 rounded block w-fit">-14.8% Deadhead</span>
        </button>

        <div className="bg-[#161F30] border border-emerald-500/40 rounded-xl p-3 shadow-[0_0_15px_rgba(16,185,129,0.15)] relative overflow-hidden group">
          <span className="text-[9px] text-emerald-400 block uppercase font-bold tracking-widest">ECONOMIC BENEFIT</span>
          <strong className="text-2xl text-emerald-400 font-black block tracking-tight my-0.5 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">₹12.58 Cr</strong>
          <span className="text-[8px] font-bold text-black bg-emerald-400 px-1.5 py-0.5 rounded inline-block">ANNUALIZED ROI</span>
        </div>
      </div>

      {/* HACKATHON TRACK 03 QUICK ACCESS BANNER */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-[#101F2C] to-[#121D28] border border-emerald-500/30 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-emerald-300 font-bold">WEMAKEDEVS × AWS ENVIRONMENTAL HACKS 2026:</span>
          <span className="text-neutral-300">Track 03 — Waste and Energy (Public Transport). Amazon S3 & CloudWatch Active.</span>
        </div>
        <button
          onClick={onNavigateToSustainability}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-[11px] transition shadow-[0_0_10px_rgba(16,185,129,0.4)]"
        >
          <span>Open Green Mobility & AWS Impact Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* AI DISPATCH RECOMMENDATION WITH REASON CARD (INTERACTIVE DECISION BOARD) */}
      <div className="bg-[#121824] border border-cyan-500/40 rounded-2xl p-4 space-y-3 shadow-xl">
        <div className="flex justify-between items-center border-b border-[#1E293B] pb-2.5">
          <div className="flex items-center gap-2">
            <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[9px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
              <Zap className="h-3 w-3 text-cyan-400 animate-pulse" /> LIVE AI DISPATCH RECOMMENDATION & SHAP ATTRIBUTION
            </span>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
              CONFIDENCE: 96.2%
            </span>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">LIGHTGBM P90: 262 PAX</span>
        </div>

        {/* RECOMMENDATION STATEMENT & SHAP REASON GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
          <div className="lg:col-span-2 space-y-2">
            <div className="flex items-center gap-2">
              <strong className="text-white text-sm font-bold">
                RECOMMENDATION: Deploy Spare EV Bus <span className="text-emerald-400 font-mono">365J-SP42</span> from Shanthinagar Depot to Silk Board Junction (Stop #6)
              </strong>
            </div>

            {/* REASON ATTRIBUTION PILLS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-[#161F30] border border-[#1E293B] p-2 rounded-xl space-y-0.5">
                <span className="text-[9px] text-rose-400 font-bold block flex items-center gap-1">
                  🚨 SURGE QUEUE
                </span>
                <strong className="text-xs text-white">210 Pax Waiting</strong>
                <span className="text-[8px] text-neutral-400 block">&gt; 180 pax threshold</span>
              </div>

              <div className="bg-[#161F30] border border-[#1E293B] p-2 rounded-xl space-y-0.5">
                <span className="text-[9px] text-cyan-400 font-bold block flex items-center gap-1">
                  🌧️ IMD RAIN ALERT
                </span>
                <strong className="text-xs text-white">+35 Pax Impact</strong>
                <span className="text-[8px] text-neutral-400 block">Heavy Rain forecast</span>
              </div>

              <div className="bg-[#161F30] border border-[#1E293B] p-2 rounded-xl space-y-0.5">
                <span className="text-[9px] text-amber-400 font-bold block flex items-center gap-1">
                  🚗 JAM FACTOR
                </span>
                <strong className="text-xs text-white">8.2 Hosur Road</strong>
                <span className="text-[8px] text-neutral-400 block">Speed: 18 km/h</span>
              </div>

              <div className="bg-[#161F30] border border-[#1E293B] p-2 rounded-xl space-y-0.5">
                <span className="text-[9px] text-emerald-400 font-bold block flex items-center gap-1">
                  💰 NET RUPEE ROI
                </span>
                <strong className="text-xs text-emerald-400">₹2,315 Saved</strong>
                <span className="text-[8px] text-neutral-400 block">0L Diesel fuel used</span>
              </div>
            </div>
          </div>

          {/* DUAL INTERACTIVE BUTTONS */}
          <div className="space-y-2">
            <button
              onClick={() => {
                setMapMode('depot_dispatch');
                if (onDispatchBus) onDispatchBus('⚡ EV-SP42', 'Silk Board Junction');
              }}
              className="w-full bg-[#FFC107] hover:bg-yellow-300 text-black font-black text-xs py-2.5 px-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer active:scale-95"
            >
              <Play className="h-4 w-4 fill-black" />
              1. EXECUTE DISPATCH FROM DEPOT
            </button>

            <button
              onClick={() => {
                setMapMode('layered_allocation');
                if (onDispatchBus) onDispatchBus('⚡ EV-SP88', 'Electronic City Phase 1');
              }}
              className="w-full bg-[#00F0FF] hover:bg-cyan-300 text-black font-black text-xs py-2.5 px-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer active:scale-95"
            >
              <Layers className="h-4 w-4" />
              2. DYNAMIC LAYERED ALLOCATION (FARAWAY STOPS)
            </button>
          </div>
        </div>
      </div>

      {/* CENTER: LARGE MAPBOX-STYLE DARK VECTOR TACTICAL TRANSIT MAP */}
      <div className="bg-[#121824] border border-[#1E293B] rounded-2xl p-4 space-y-3 shadow-xl">
        <div className="flex justify-between items-center border-b border-[#1E293B] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                EXECUTIVE COMMAND CENTER (DASHBOARD 1)
              </span>
              <span className="text-xs text-neutral-400">BENGALURU METROPOLITAN TRANSIT VECTOR RADAR</span>
            </div>
            <h2 className="text-sm font-bold text-white mt-1 flex items-center gap-2">
              <Compass className="h-4 w-4 text-cyan-400" />
              Live Tactical Corridor Map & Dynamic Holding Bay Allocation Radar
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span> Live Fleet (42)</span>
            <span className="flex items-center gap-1.5 text-amber-400 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Holding Bays (4)</span>
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Depots (8)</span>
          </div>
        </div>

        {/* REAL LEAFLET GIS MAP OF BENGALURU */}
        <RealGISMap 
          height="460px" 
          activeMode={mapMode} 
          onModeChange={setMapMode} 
          dispatchTriggerCount={dispatchTriggerCount}
          onDispatchTriggered={() => onDispatchBus && onDispatchBus('⚡ EV-SP42', 'Silk Board Junction')}
        />
      </div>

      {/* BOTTOM TACTICAL TRENDS GRID */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#121824] border border-[#1E293B] rounded-xl p-3 space-y-1">
          <span className="text-[9px] text-neutral-400 uppercase font-bold">Passenger Growth</span>
          <strong className="text-base text-white font-bold block">+14.2% YoY</strong>
          <p className="text-[9px] text-neutral-500">Daily Commuters: 124,500</p>
        </div>

        <div className="bg-[#121824] border border-[#1E293B] rounded-xl p-3 space-y-1">
          <span className="text-[9px] text-neutral-400 uppercase font-bold">Recovery Efficiency</span>
          <strong className="text-base text-emerald-400 font-bold block">88.5% Queue Cut</strong>
          <p className="text-[9px] text-neutral-500">Avg Intervention: 8.2m</p>
        </div>

        <div className="bg-[#121824] border border-[#1E293B] rounded-xl p-3 space-y-1">
          <span className="text-[9px] text-neutral-400 uppercase font-bold">Forecast Accuracy</span>
          <strong className="text-base text-cyan-400 font-bold block">94.8% WAPE</strong>
          <p className="text-[9px] text-neutral-500">Pinball Loss: 0.042</p>
        </div>

        <div className="bg-[#121824] border border-[#1E293B] rounded-xl p-3 space-y-1">
          <span className="text-[9px] text-neutral-400 uppercase font-bold">Fleet Electrification</span>
          <strong className="text-base text-emerald-400 font-bold block">42% EV Share</strong>
          <p className="text-[9px] text-neutral-500">Min Battery SoC: 82.0%</p>
        </div>
      </div>
    </div>
  );
};
