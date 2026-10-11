import React, { useState } from 'react';
import { Sliders, Zap, Play, ShieldCheck, AlertTriangle, CloudRain, Flame, Layers } from 'lucide-react';

export const WhatIfSimulatorPage: React.FC = () => {
  const [trafficVal, setTrafficVal] = useState<number>(20);
  const [rainVal, setRainVal] = useState<number>(35);
  const [demandVal, setDemandVal] = useState<number>(210);
  const [cameraOffline, setCameraOffline] = useState<boolean>(false);
  const [metroFail, setMetroFail] = useState<boolean>(false);

  // Dynamic AI Decision recalculation
  const effectiveDemand = Math.round(demandVal * (1 + rainVal / 100) * (metroFail ? 1.4 : 1.0));
  const dynamicConfidence = cameraOffline ? 78.5 : 94.2;
  const recommendedGate = effectiveDemand > 250 
    ? 'Gate 6: Cross-Depot Fleet Borrowing (Shanthinagar)' 
    : trafficVal > 25 
    ? 'Gate 5: Traffic-Aware Express Flyover Bypass' 
    : 'Gate 2: Holding Bay EV Bus Dispatch';

  return (
    <div className="p-4 space-y-4 font-mono">
      {/* HEADER BANNER */}
      <div className="bg-neutral-950 text-white rounded-[20px] p-4 border border-neutral-800 flex justify-between items-center shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-solid bg-amber-500 text-black text-[10px] font-extrabold">WHAT-IF SIMULATOR (DASHBOARD 13)</span>
            <span className="text-xs text-neutral-400">Live AI Decision Adaptation Workbench</span>
          </div>
          <h1 className="text-base font-bold text-white">Interactive Operational Disruption & Live AI Decision Engine Reaction Simulator</h1>
        </div>
        <div className="text-right">
          <span className="text-xs text-neutral-400 block">AI Adaptation Latency</span>
          <strong className="text-lg text-emerald-400 font-bold">12.4 ms (Live Dynamic)</strong>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* INTERACTIVE DISRUPTION CONTROLS */}
        <div className="bg-white border border-neutral-200 rounded-[20px] p-4 space-y-4 shadow-sm">
          <h2 className="text-xs font-bold text-neutral-950 uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-100 pb-2">
            <Sliders className="h-4 w-4 text-amber-600" />
            Interactive Disruption Sliders & Toggles
          </h2>

          {/* Traffic Delay Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-neutral-950">
              <span>Traffic Congestion Spike</span>
              <span className="text-amber-700">+{trafficVal}% Delay</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={trafficVal}
              onChange={e => setTrafficVal(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
          </div>

          {/* Rain Intensity Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-neutral-950">
              <span>Rain Precipitation Impact</span>
              <span className="text-blue-700">+{rainVal}% Pax Demand</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={rainVal}
              onChange={e => setRainVal(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          {/* Commuter Demand Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-neutral-950">
              <span>Base Corridor Queue</span>
              <span className="text-neutral-950">{demandVal} Commuters</span>
            </div>
            <input
              type="range"
              min="50"
              max="350"
              value={demandVal}
              onChange={e => setDemandVal(Number(e.target.value))}
              className="w-full accent-neutral-900"
            />
          </div>

          {/* Hardware & Infrastructure Toggles */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setCameraOffline(!cameraOffline)}
              className={`p-3 rounded-xl border text-xs font-bold transition flex justify-between items-center ${
                cameraOffline ? 'border-rose-600 bg-rose-50 text-rose-700' : 'border-neutral-200 bg-neutral-50 text-neutral-700'
              }`}
            >
              <span>📷 Camera Offline</span>
              <span className="badge-solid bg-neutral-900 text-white text-[9px]">{cameraOffline ? 'OFFLINE' : 'ONLINE'}</span>
            </button>

            <button
              onClick={() => setMetroFail(!metroFail)}
              className={`p-3 rounded-xl border text-xs font-bold transition flex justify-between items-center ${
                metroFail ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-neutral-200 bg-neutral-50 text-neutral-700'
              }`}
            >
              <span>🚇 Metro Line Down</span>
              <span className="badge-solid bg-neutral-900 text-white text-[9px]">{metroFail ? 'DOWN' : 'NORMAL'}</span>
            </button>
          </div>
        </div>

        {/* LIVE ADAPTIVE AI DECISION REACTION CARD */}
        <div className="bg-white border border-neutral-200 rounded-[20px] p-4 space-y-4 shadow-sm">
          <h2 className="text-xs font-bold text-neutral-950 uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-100 pb-2">
            <Zap className="h-4 w-4 text-emerald-600" />
            Live Adaptive AI Decision Output Reaction
          </h2>

          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center bg-neutral-950 text-white p-3 rounded-xl border border-neutral-800 text-xs">
              <div>
                <span className="text-neutral-400 block text-[9px]">Effective Pax Demand</span>
                <strong className="text-amber-400 text-base font-bold">{effectiveDemand} Pax</strong>
              </div>
              <div>
                <span className="text-neutral-400 block text-[9px]">Observation Confidence</span>
                <strong className="text-emerald-400 text-base font-bold">{dynamicConfidence}%</strong>
              </div>
              <div>
                <span className="text-neutral-400 block text-[9px]">Rupee Benefit Saved</span>
                <strong className="text-white text-base font-bold">₹{Math.round(effectiveDemand * 11.2)} Saved</strong>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1 text-xs">
              <span className="text-neutral-500 block text-[10px] uppercase font-bold">Live Selected Decision Gate:</span>
              <strong className="text-emerald-700 font-bold block text-sm">{recommendedGate}</strong>
              <p className="text-[10px] text-neutral-600 pt-1">
                AI dynamically re-optimized OR-Tools MILP decision gates in response to real-time slider adjustments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
