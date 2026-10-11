import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  CheckCircle2, 
  Activity, 
  Brain, 
  ShieldCheck, 
  Zap, 
  Bus, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Database
} from 'lucide-react';

interface LivePipelineDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDispatchSuccess?: () => void;
}

export const LivePipelineDemoModal: React.FC<LivePipelineDemoModalProps> = ({
  isOpen,
  onClose,
  onDispatchSuccess
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [approved, setApproved] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setActiveStep(1);
      setIsRunning(true);
      setApproved(false);
      setLogs([
        "[00:00.01] 📡 Stage 1: Ingesting CCTV YOLOv8 Gate Counts (Silk Board Stop #6: 185 pax)...",
        "[00:00.04] 📡 Stage 1: Ingesting GTFS-RT Protobuf Bus Positions & IMD Heavy Rain Alert (+35 pax impact)...",
        "[00:00.08] 🧠 Stage 2: Context Builder querying SQLite WAL DB for historical lags (T-1h: 178, T-24h: 164, T-7d: 158 pax)...",
        "[00:00.12] 🧠 Stage 2: Historical Incident Memory retrieved (Heavy Rain Emergency on Nov 7, 2025: -18.5m wait cut achieved)...",
        "[00:00.18] 📈 Stage 3: LightGBM Quantile Forecast executed in 5.8ms -> P10: 158, P50: 210, P90: 262 pax...",
        "[00:00.22] 📈 Stage 3: SHAP Feature Attribution calculated: IMD Rain (+35), Evening Rush (+28), Traffic (+18)...",
        "[00:00.28] 🛡️ Stage 4: 5-Domain Policy Firewall evaluating constraints (Driver Shift < 8h, EV SoC >= 20%)...",
        "[00:00.32] 🛡️ Stage 4: ALL 5 DOMAINS PASSED (100% Compliance). OR-Tools MILP Solver running 1,000 Monte Carlo tests...",
        "[00:00.38] ⚡ Stage 5: AI Option Package Generated: Option A (Spare EV Bus 365J-SP42) - Wait Cut: -18.5m, Fuel: 0L.",
        "[00:00.40] 👨‍✈️ Stage 5: Awaiting Human Supervisor Approval..."
      ]);
    }
  }, [isOpen]);

  const handleStepClick = (stepNum: number) => {
    setActiveStep(stepNum);
  };

  const handleApproveDispatch = () => {
    setApproved(true);
    setLogs(prev => [
      ...prev,
      "[00:01.05] 🟢 HUMAN SUPERVISOR ACTION: APPROVED OPTION A (EV BUS 365J-SP42)!",
      "[00:01.12] 🚌 Executing POST /api/v1/dispatch -> Deploying EV Bus 365J-SP42 from Depot Bay #4...",
      "[00:01.18] 📡 GTFS-RT Protobuf feed updated -> VehiclePosition broadcasted to Google Maps / Moovit...",
      "[00:01.24] ✅ 180 waiting passengers cleared! Silk Board Stop status updated from CRITICAL to NORMAL."
    ]);
    
    if (onDispatchSuccess) {
      onDispatchSuccess();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-white border border-neutral-200 rounded-[24px] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* MODAL HEADER */}
        <div className="px-6 py-4 bg-neutral-950 text-white flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
              <Zap className="h-5 w-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight font-mono flex items-center gap-2">
                LIVE END-TO-END PIPELINE SIMULATOR
                <span className="badge-solid text-[10px] bg-emerald-500 text-black font-bold">REAL-TIME</span>
              </h2>
              <p className="text-xs text-neutral-400">
                Observe live data flow: CCTV Ingestion → Context Memory → LightGBM Forecast → Policy Engine → Human Approval → Dispatch
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* PIPELINE PROGRESS STEPPER */}
        <div className="bg-neutral-900 border-b border-neutral-800 px-6 py-3">
          <div className="grid grid-cols-5 gap-2">
            
            {/* Step 1 */}
            <button 
              onClick={() => handleStepClick(1)}
              className={`p-2.5 rounded-xl border text-left font-mono text-xs transition ${
                activeStep === 1 
                  ? 'bg-neutral-800 border-emerald-500 text-white' 
                  : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] text-neutral-500 mb-1">
                <span>STAGE 1</span>
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              </div>
              <span className="font-bold block text-neutral-200 text-[11px]">1. Data Telemetry</span>
              <span className="text-[9px] text-neutral-400 block truncate">CCTV, GTFS, Weather</span>
            </button>

            {/* Step 2 */}
            <button 
              onClick={() => handleStepClick(2)}
              className={`p-2.5 rounded-xl border text-left font-mono text-xs transition ${
                activeStep === 2 
                  ? 'bg-neutral-800 border-emerald-500 text-white' 
                  : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] text-neutral-500 mb-1">
                <span>STAGE 2</span>
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              </div>
              <span className="font-bold block text-neutral-200 text-[11px]">2. Context & Memory</span>
              <span className="text-[9px] text-neutral-400 block truncate">Lags T-1h, T-24h, T-7d</span>
            </button>

            {/* Step 3 */}
            <button 
              onClick={() => handleStepClick(3)}
              className={`p-2.5 rounded-xl border text-left font-mono text-xs transition ${
                activeStep === 3 
                  ? 'bg-neutral-800 border-emerald-500 text-white' 
                  : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] text-neutral-500 mb-1">
                <span>STAGE 3</span>
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              </div>
              <span className="font-bold block text-neutral-200 text-[11px]">3. LightGBM Forecast</span>
              <span className="text-[9px] text-neutral-400 block truncate">P10, P50, P90 Bounds</span>
            </button>

            {/* Step 4 */}
            <button 
              onClick={() => handleStepClick(4)}
              className={`p-2.5 rounded-xl border text-left font-mono text-xs transition ${
                activeStep === 4 
                  ? 'bg-neutral-800 border-emerald-500 text-white' 
                  : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] text-neutral-500 mb-1">
                <span>STAGE 4</span>
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              </div>
              <span className="font-bold block text-neutral-200 text-[11px]">4. Policy & MILP Solver</span>
              <span className="text-[9px] text-neutral-400 block truncate">5 Domains, Monte Carlo</span>
            </button>

            {/* Step 5 */}
            <button 
              onClick={() => handleStepClick(5)}
              className={`p-2.5 rounded-xl border text-left font-mono text-xs transition ${
                activeStep === 5 
                  ? 'bg-neutral-800 border-emerald-500 text-white' 
                  : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] text-neutral-500 mb-1">
                <span>STAGE 5</span>
                {approved ? (
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                ) : (
                  <Clock className="h-3 w-3 text-amber-400 animate-pulse" />
                )}
              </div>
              <span className="font-bold block text-neutral-200 text-[11px]">5. Human Approval</span>
              <span className="text-[9px] text-neutral-400 block truncate">Option A EV Dispatch</span>
            </button>

          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-neutral-50">

          {/* STAGE 1 DETAIL */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="bg-white border border-neutral-200 rounded-[18px] p-4 font-mono space-y-3 shadow-sm">
                <h3 className="text-sm font-bold text-neutral-950 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-600" />
                  STAGE 1: MULTI-STREAM SENSOR TELEMETRY FUSION
                </h3>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 space-y-1">
                    <span className="text-neutral-500 text-[10px] block uppercase font-bold">CCTV YOLOv8 Feed</span>
                    <strong className="text-neutral-950 block text-sm">185 Passengers Detected</strong>
                    <span className="text-[10px] text-emerald-700 font-medium">Camera 6: Silk Board Gate</span>
                  </div>
                  <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 space-y-1">
                    <span className="text-neutral-500 text-[10px] block uppercase font-bold">GTFS-RT Protobuf</span>
                    <strong className="text-neutral-950 block text-sm">12.5 min Headway Delay</strong>
                    <span className="text-[10px] text-amber-700 font-medium">GPS Freshness: 8s ago</span>
                  </div>
                  <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 space-y-1">
                    <span className="text-neutral-500 text-[10px] block uppercase font-bold">IMD Weather & TomTom</span>
                    <strong className="text-rose-600 block text-sm">Heavy Rain (+35 pax)</strong>
                    <span className="text-[10px] text-rose-700 font-medium">Traffic Delay: +15.5 mins</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2 DETAIL */}
          {activeStep === 2 && (
            <div className="space-y-4 font-mono">
              <div className="bg-white border border-neutral-200 rounded-[18px] p-4 space-y-3 shadow-sm">
                <h3 className="text-sm font-bold text-neutral-950 flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-600" />
                  STAGE 2: CONTEXT BUILDER & HISTORICAL OPERATIONAL MEMORY
                </h3>
                <div className="grid grid-cols-4 gap-2 text-center bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-xs">
                  <div><span className="text-neutral-500 text-[10px] block">T-1h (1h Ago)</span><strong>178 pax</strong></div>
                  <div><span className="text-neutral-500 text-[10px] block">T-24h (Yesterday)</span><strong>164 pax</strong></div>
                  <div><span className="text-neutral-500 text-[10px] block">T-7d (Last Week)</span><strong>158 pax</strong></div>
                  <div><span className="text-neutral-500 text-[10px] block">Trend Delta</span><strong className="text-emerald-700">↑ +17.6%</strong></div>
                </div>
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-xs space-y-1">
                  <span className="text-neutral-950 font-bold block">📜 Past Similar Incident Memory (SQLite WAL DB):</span>
                  <p className="text-neutral-700 text-[11px]">
                    Heavy Rain Emergency on Friday 2025-11-07: Dispatched EV Spare Bus 365J-SP42 (-18.5 min wait cut achieved). Operator Supervisor approved Option A.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3 DETAIL */}
          {activeStep === 3 && (
            <div className="space-y-4 font-mono">
              <div className="bg-white border border-neutral-200 rounded-[18px] p-4 space-y-3 shadow-sm">
                <h3 className="text-sm font-bold text-neutral-950 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  STAGE 3: LIGHTGBM QUANTILE DEMAND FORECAST & SHAP DRIVERS
                </h3>
                <div className="grid grid-cols-3 gap-3 text-center bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-xs">
                  <div><span className="text-neutral-500 text-[10px] block">P10 (Floor)</span><strong>158 pax</strong></div>
                  <div className="border-x border-neutral-200"><span className="text-neutral-500 text-[10px] block">P50 (Median)</span><strong>210 pax</strong></div>
                  <div><span className="text-neutral-500 text-[10px] block">P90 (Surge Peak)</span><strong className="text-rose-600 font-bold">262 pax</strong></div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <span className="text-neutral-500 text-[10px] uppercase font-bold block">SHAP Marginal Feature Drivers:</span>
                  <div className="flex justify-between bg-neutral-50 p-2 rounded-lg border border-neutral-100">
                    <span>⚡ IMD Heavy Rain Emergency</span><strong className="text-neutral-950">+35 passengers</strong>
                  </div>
                  <div className="flex justify-between bg-neutral-50 p-2 rounded-lg border border-neutral-100">
                    <span>⚡ Evening Peak Office Rush (5-8 PM)</span><strong className="text-neutral-950">+28 passengers</strong>
                  </div>
                  <div className="flex justify-between bg-neutral-50 p-2 rounded-lg border border-neutral-100">
                    <span>⚡ TomTom Corridor Congestion Delay</span><strong className="text-neutral-950">+18 passengers</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4 DETAIL */}
          {activeStep === 4 && (
            <div className="space-y-4 font-mono">
              <div className="bg-white border border-neutral-200 rounded-[18px] p-4 space-y-3 shadow-sm">
                <h3 className="text-sm font-bold text-neutral-950 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-purple-600" />
                  STAGE 4: 5-DOMAIN POLICY ENGINE & OR-TOOLS MILP SOLVER
                </h3>
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-3 rounded-xl text-xs flex justify-between items-center">
                  <span className="font-bold">POLICY AUDIT STATUS: 100% COMPLIANT (ALL 5 PASSED)</span>
                  <span className="badge-solid bg-emerald-600 text-white font-bold">5 / 5 PASSED</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                  <div><span className="text-neutral-500 block text-[9px]">Driver Shift</span>&lt; 8.0h (5.2h)</div>
                  <div><span className="text-neutral-500 block text-[9px]">EV Battery SoC</span>82% (&ge; 20%)</div>
                  <div><span className="text-neutral-500 block text-[9px]">Depot Reserve</span>3 Spare Buses</div>
                </div>
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-xs space-y-1">
                  <span className="font-bold text-neutral-950 block">🎲 Google OR-Tools & Monte Carlo Simulation:</span>
                  <p className="text-neutral-700 text-[11px]">
                    Evaluated 1,000 stochastic traffic scenarios in 11.2ms. Option A (EV Bus 365J-SP42) yields optimal utility score of 94/100 with 95% confidence interval [-15.0m, -22.0m].
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 5 DETAIL */}
          {activeStep === 5 && (
            <div className="space-y-4 font-mono">
              <div className="bg-white border border-neutral-200 rounded-[18px] p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-neutral-950 flex items-center gap-2">
                    <Bus className="h-5 w-5 text-emerald-600" />
                    STAGE 5: HUMAN SUPERVISOR APPROVAL & DISPATCH ACTION
                  </h3>
                  <span className="text-xs text-neutral-500">HUMAN-IN-THE-LOOP</span>
                </div>

                <div className="bg-neutral-950 text-white p-4 rounded-2xl space-y-3 border border-neutral-800">
                  <div className="flex justify-between items-center">
                    <span className="badge-solid bg-emerald-500 text-black font-bold text-xs">★ RECOMMENDED DISPATCH PACKAGE</span>
                    <span className="text-xs text-neutral-400">DISP-2026-069</span>
                  </div>
                  <div className="text-base font-bold text-white">
                    Action: Dispatch Spare EV Bus 365J-SP42 to Silk Board Stop #6
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs text-center bg-neutral-900 p-2.5 rounded-xl border border-neutral-800">
                    <div><span className="text-neutral-400 block text-[9px]">Wait Cut</span><strong className="text-emerald-400">-18.5 mins</strong></div>
                    <div><span className="text-neutral-400 block text-[9px]">Diesel Fuel</span><strong>0.0 Liters</strong></div>
                    <div><span className="text-neutral-400 block text-[9px]">CO2 Reduction</span><strong className="text-emerald-400">-210 kg</strong></div>
                    <div><span className="text-neutral-400 block text-[9px]">Utility Score</span><strong>94 / 100</strong></div>
                  </div>
                </div>

                {/* APPROVAL ACTION BUTTON */}
                {!approved ? (
                  <button
                    onClick={handleApproveDispatch}
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm rounded-xl transition shadow-lg flex items-center justify-center space-x-2"
                  >
                    <CheckCircle2 className="h-5 w-5 text-black" />
                    <span>APPROVE & DISPATCH EV BUS 365J-SP42 NOW</span>
                  </button>
                ) : (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-700 text-xs space-y-1 text-center font-bold">
                    <div className="flex justify-center items-center gap-2 text-sm text-emerald-800">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <span>DISPATCH EXECUTED SUCCESSFULLY!</span>
                    </div>
                    <p className="text-neutral-700 text-[11px] font-medium pt-1">
                      EV Bus 365J-SP42 deployed. 180 waiting passengers cleared. GTFS-RT feed broadcasted.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* REAL-TIME TERMINAL LOG CONSOLE */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-[18px] p-4 space-y-2 font-mono text-[11px]">
            <div className="flex items-center justify-between text-neutral-400 border-b border-neutral-800 pb-2">
              <span className="flex items-center space-x-2 text-xs font-bold text-neutral-200">
                <Activity className="h-4 w-4 text-emerald-400" />
                <span>LIVE PIPELINE LOG CONSOLE</span>
              </span>
              <span className="text-[10px] text-neutral-500">FastAPI & Python Logs</span>
            </div>
            <div className="space-y-1 max-h-36 overflow-y-auto text-neutral-300">
              {logs.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  {log.includes("🟢") || log.includes("✅") ? (
                    <span className="text-emerald-400 font-bold">{log}</span>
                  ) : log.includes("📈") ? (
                    <span className="text-blue-300">{log}</span>
                  ) : log.includes("🛡️") ? (
                    <span className="text-purple-300">{log}</span>
                  ) : (
                    <span>{log}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-3.5 bg-white border-t border-neutral-200 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center space-x-2 text-neutral-600">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span>Sanchara Vyuha Decision Intelligence v3.0 Pipeline</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition"
          >
            Close Pipeline Simulator
          </button>
        </div>

      </div>
    </div>
  );
};
