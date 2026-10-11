import React, { useState, useEffect } from 'react';
import { Activity, Radio, Settings, Search, CloudRain, Flame, Play, ChevronDown, FileText, X, AlertOctagon, RefreshCw, Zap } from 'lucide-react';
import { fetchMetrics, ApiMetrics, fetchAlerts } from '../services/api';

interface CommandHeaderProps {
  networkHealth: 'normal' | 'elevated' | 'critical';
  healthScore: number;
  healthReasons: string[];
  criticalStopCount: number;
  nextPeakMinutes: number;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSettingsClick: () => void;
  simulationMode: string;
  onSimulationChange: (mode: string) => void;
  onOpenDemoModal?: () => void;
}

export const CommandHeader: React.FC<CommandHeaderProps> = ({
  networkHealth,
  healthScore,
  healthReasons,
  criticalStopCount,
  nextPeakMinutes,
  searchTerm,
  onSearchChange,
  onSettingsClick,
  simulationMode,
  onSimulationChange,
  onOpenDemoModal
}) => {
  const [metrics, setMetrics] = useState<ApiMetrics | null>(null);
  const [alertCount, setAlertCount] = useState(0);
  const [showSimDropdown, setShowSimDropdown] = useState(false);
  const [showHealthReasons, setShowHealthReasons] = useState(false);
  const [showMissionBrief, setShowMissionBrief] = useState(false);

  useEffect(() => {
    const load = async () => {
      const m = await fetchMetrics();
      const a = await fetchAlerts();
      if (m) setMetrics(m);
      else setMetrics({ api_latency_ms: 14.2, inference_time_ms: 8.5, fps_camera_feed: 29.8, connected_cameras: 9, active_buses: 42, total_dispatches_today: 18, carbon_saved_today_kg: 1240.5 });
      setAlertCount(a.length || 2);
    };
    load();
    const interval = setInterval(load, 8000);
    return () => clearInterval(interval);
  }, []);

  const simScenarios = [
    { id: 'live', label: 'Live Stream', icon: Activity },
    { id: 'rain', label: 'Heavy Rain', icon: CloudRain },
    { id: 'festival', label: 'Festival Surge', icon: Flame },
    { id: 'metro_fail', label: 'Metro Failure', icon: AlertOctagon },
    { id: 'strike', label: 'Route Strike', icon: RefreshCw },
  ];

  const filledBars = Math.round((healthScore / 100) * 8);

  return (
    <>
      <header className="relative z-50 bg-[#0B0F17] border-b border-[#1E293B] shadow-lg px-4 py-2 flex items-center justify-between flex-wrap gap-2 select-none font-mono text-white">
        {/* GROUP 1: BRAND & SCENARIO SELECTOR */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <img src="/src/assets/images.png" alt="BMTC" className="w-7 h-7 rounded-full bg-neutral-100 p-0.5 border border-neutral-200" />
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold tracking-tight text-neutral-950 font-mono">SANCHARA VYUHA</span>
                <button
                  onClick={() => setShowMissionBrief(true)}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 px-1.5 py-0.5 rounded-[10px] transition-all cursor-pointer flex items-center space-x-1 text-[9px] font-mono font-medium"
                >
                  <FileText className="h-3 w-3 text-neutral-600" />
                  <span>Brief</span>
                </button>
              </div>
              <span className="text-[9px] text-neutral-500 font-mono block -mt-0.5 uppercase tracking-wider">ROUTE 365J • v3.1</span>
            </div>
          </div>

          {/* LIVE PIPELINE DEMO BUTTON */}
          {onOpenDemoModal && (
            <button
              onClick={onOpenDemoModal}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[11px] font-mono px-3 py-1.5 rounded-xl transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer animate-pulse"
            >
              <Zap className="h-3.5 w-3.5 text-black" />
              <span>⚡ LIVE PIPELINE DEMO</span>
            </button>
          )}

          <div className="h-5 w-px bg-neutral-200"></div>

          {/* Scenario Selector */}
          <div className="relative">
            <button
              onClick={() => setShowSimDropdown(!showSimDropdown)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-[12px] bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-900 cursor-pointer hover:bg-neutral-100 transition-all font-mono"
            >
              <Play className="h-3 w-3 text-neutral-600" />
              <span className="text-[9px] text-neutral-500 uppercase">SCENARIO:</span>
              <span className="text-neutral-950 font-semibold">{simScenarios.find(s => s.id === simulationMode)?.label}</span>
              <ChevronDown className="h-3 w-3 text-neutral-400" />
            </button>

            {showSimDropdown && (
              <div className="absolute left-0 top-full mt-1.5 w-48 bg-white border border-neutral-200 rounded-[18px] shadow-xl z-[100] py-1.5 divide-y divide-neutral-100">
                <div className="px-3 py-1 text-[9px] font-semibold text-neutral-400 uppercase tracking-wider font-mono">Operational Scenario</div>
                {simScenarios.map(s => (
                  <button
                    key={s.id}
                    onClick={() => { onSimulationChange(s.id); setShowSimDropdown(false); }}
                    className={`w-full flex items-center space-x-2 px-3 py-1.5 text-xs hover:bg-neutral-50 transition-colors ${simulationMode === s.id ? 'text-neutral-950 font-semibold bg-neutral-100' : 'text-neutral-700'}`}
                  >
                    <s.icon className="h-3.5 w-3.5 text-neutral-500" />
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* GROUP 2: SYSTEM HEALTH GAUGE */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="relative">
            <button
              onClick={() => setShowHealthReasons(!showHealthReasons)}
              className="flex items-center space-x-2 px-2.5 py-1 rounded-[12px] border border-neutral-200 bg-neutral-50 text-neutral-900 cursor-pointer hover:bg-neutral-100 transition-all font-mono"
            >
              <div className="flex items-center space-x-0.5">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-3 rounded-sm ${
                      i < filledBars
                        ? networkHealth === 'critical' ? 'bg-[#e7000b]' : 'bg-neutral-950'
                        : 'bg-neutral-200'
                    }`}
                  ></div>
                ))}
              </div>

              <div className="text-left leading-none">
                <span className="text-[11px] font-bold text-neutral-950 block">{healthScore}/100</span>
                <span className="text-[8px] font-semibold uppercase text-rose-600">{networkHealth}</span>
              </div>
              <ChevronDown className="h-3 w-3 text-neutral-400" />
            </button>

            {showHealthReasons && (
              <div className="absolute left-0 top-full mt-1.5 w-64 bg-white border border-neutral-200 rounded-[18px] shadow-xl p-3 z-[100] animate-scale-in">
                <span className="text-[9px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5 font-mono">Health Diagnosis</span>
                <div className="space-y-1 text-xs text-neutral-700">
                  {healthReasons.map((reason, idx) => (
                    <div key={idx} className="flex items-start space-x-1.5">
                      <span className="text-[#e7000b] font-bold">•</span>
                      <span className="leading-tight text-[11px]">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 text-[11px] font-mono text-neutral-600">
            {criticalStopCount > 0 && (
              <span className="text-[#e7000b] font-semibold text-[10px]">{criticalStopCount} Critical</span>
            )}
            <span>Latency: <strong className="text-neutral-950">{metrics?.api_latency_ms || 14.2}ms</strong></span>
            <div className="flex items-center space-x-1 text-emerald-700">
              <Radio className="h-3 w-3 text-emerald-600 animate-spin" style={{ animationDuration: '3s' }} />
              <span className="font-semibold text-[9px]">GTFS-RT</span>
            </div>
          </div>
        </div>

        {/* GROUP 3: SEARCH, PROFILE & SETTINGS */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search stop or bus..."
              className="bg-neutral-50 border border-neutral-200 rounded-[14px] pl-8 pr-2.5 py-1 text-[11px] text-neutral-950 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-950 font-mono w-40"
            />
          </div>

          <div className="h-5 w-px bg-neutral-200"></div>

          <div className="flex items-center space-x-1.5">
            <div className="w-6 h-6 rounded-full bg-neutral-950 text-white flex items-center justify-center text-[10px] font-mono font-bold">
              OP
            </div>
            <div className="text-left text-[10px] font-mono leading-none">
              <span className="text-neutral-950 font-bold block">Operator</span>
              <span className="text-[8px] text-neutral-500 uppercase">Dispatcher</span>
            </div>
          </div>

          <button
            onClick={onSettingsClick}
            className="p-1 rounded-[10px] text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* AI Mission Brief Modal */}
      {showMissionBrief && (
        <div className="fixed inset-0 bg-neutral-950/40 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-fade-in-up">
          <div className="bg-white border border-neutral-200 rounded-[24px] max-w-lg w-full p-6 shadow-xl relative space-y-4 font-sans">
            <button
              onClick={() => setShowMissionBrief(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-950 p-1 rounded-[18px] hover:bg-neutral-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-3 border-b border-neutral-100 pb-3">
              <Zap className="h-6 w-6 text-neutral-950" />
              <div>
                <h2 className="text-lg font-semibold text-neutral-950 tracking-tight">09:32 Operations Brief</h2>
                <span className="text-xs text-neutral-500 font-mono">Autonomous Operations Copilot</span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-neutral-700 leading-relaxed font-sans">
              <div className="flex items-center space-x-2 font-mono">
                <span className="bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-[6px] font-bold">
                  SILK BOARD JUNCTION
                </span>
                <span className="bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-[6px] font-bold">
                  MAJESTIC
                </span>
              </div>

              <p className="text-sm font-medium text-neutral-950">
                Silk Board Junction and Majestic are projected to exceed safe capacity within the next 12 minutes.
              </p>

              <div className="bg-neutral-50 p-3.5 rounded-[18px] border border-neutral-200 space-y-1.5 font-mono text-[11px]">
                <div className="text-neutral-950 font-semibold">Deploy spare electric bus 365J-SP24 immediately.</div>
                <div className="text-neutral-700">Expected reduction: <strong className="text-neutral-950">18.5 minutes average waiting time</strong>.</div>
                <div className="text-neutral-700">Confidence: <strong className="text-neutral-950">94%</strong>.</div>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex justify-end">
              <button
                onClick={() => setShowMissionBrief(false)}
                className="bg-neutral-950 hover:bg-neutral-800 text-white font-mono text-xs px-4 py-2 rounded-[14px] cursor-pointer"
              >
                Acknowledge Briefing
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
