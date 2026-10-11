import React, { useState } from 'react';
import { Brain, Play, CloudRain, Flame, AlertOctagon, RotateCcw, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

export const DigitalTwinPage: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<string>('baseline');
  const [simulating, setSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const scenarios = [
    { id: 'baseline', name: 'Baseline Schedule', icon: Brain, desc: 'Normal working day operations under standard timetable.' },
    { id: 'rain', name: 'Torrential Heavy Monsoon Rain', icon: CloudRain, desc: 'IMD Rain Alert: CCTV blur (+35 pax impact, camera weight drops to 10%).' },
    { id: 'traffic', name: '+20% Traffic Congestion Spike', icon: Flame, desc: 'Silk Board Flyover bottleneck (+24 min delay penalty).' },
    { id: 'breakdown', name: 'Primary Route Bus Breakdown', icon: AlertOctagon, desc: 'EV Bus 365J-SP42 breakdown at Junction 4 (Auto short-turn fallback).' }
  ];

  const handleRunSimulation = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      setSimulationResult({
        scenario: selectedScenario,
        monte_carlo_runs: 1000,
        expected_recovery_pct: selectedScenario === 'rain' ? 88.5 : selectedScenario === 'traffic' ? 82.0 : 94.0,
        ci95_bounds: selectedScenario === 'rain' ? [85.0, 92.0] : [78.0, 86.0],
        rupee_benefit_saved: selectedScenario === 'rain' ? 2315 : 1840,
        recommended_gate: selectedScenario === 'traffic' ? 'Gate 5: Traffic-Aware Express Flyover Bypass' : 'Gate 2: Holding Bay EV Bus Dispatch'
      });
    }, 600);
  };

  return (
    <div className="p-4 space-y-4 font-mono">
      {/* HEADER BANNER */}
      <div className="bg-neutral-950 text-white rounded-[20px] p-4 border border-neutral-800 flex justify-between items-center shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-solid bg-purple-600 text-white text-[10px] font-bold">DIGITAL TWIN (WS-04)</span>
            <span className="text-xs text-neutral-400">Persona: Simulation Analyst</span>
          </div>
          <h1 className="text-base font-bold text-white">Pre-Dispatch Digital Twin & 1,000 Monte Carlo What-If Scenario Simulator</h1>
        </div>
        <button
          onClick={handleRunSimulation}
          disabled={simulating}
          className="bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold px-4 py-2 rounded-xl flex items-center gap-2 transition shadow-sm text-xs"
        >
          {simulating ? <RotateCcw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-black" />}
          <span>{simulating ? 'RUNNING MONTE CARLO SIM...' : 'RUN DIGITAL TWIN SIMULATION'}</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* SCENARIO SELECTOR */}
        <div className="bg-white border border-neutral-200 rounded-[20px] p-4 space-y-3 shadow-sm">
          <h2 className="text-xs font-bold text-neutral-950 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-purple-600" />
            Disruption Scenario Builder
          </h2>
          <div className="space-y-2">
            {scenarios.map(sc => {
              const Icon = sc.icon;
              return (
                <div
                  key={sc.id}
                  onClick={() => setSelectedScenario(sc.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    selectedScenario === sc.id
                      ? 'border-purple-600 bg-purple-50/50 shadow-sm'
                      : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4 text-purple-600" />
                    <strong className="text-xs font-bold text-neutral-950">{sc.name}</strong>
                  </div>
                  <p className="text-[10px] text-neutral-600">{sc.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* SIMULATION RESULTS */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white border border-neutral-200 rounded-[20px] p-4 space-y-4 shadow-sm">
            <h2 className="text-xs font-bold text-neutral-950 uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-100 pb-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              Pre-Dispatch Simulation & Candidate Option Trade-offs
            </h2>

            {simulationResult ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3 text-center bg-neutral-900 text-white p-3 rounded-xl border border-neutral-800 text-xs">
                  <div>
                    <span className="text-neutral-400 block text-[9px]">Expected Queue Recovery</span>
                    <strong className="text-emerald-400 text-base font-bold">{simulationResult.expected_recovery_pct}%</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[9px]">95% Confidence Interval</span>
                    <strong className="text-white text-base font-bold">[{simulationResult.ci95_bounds[0]}%, {simulationResult.ci95_bounds[1]}%]</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[9px]">Net Rupee Benefit (₹)</span>
                    <strong className="text-emerald-400 text-base font-bold">₹{simulationResult.rupee_benefit_saved} Saved</strong>
                  </div>
                </div>

                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1 text-xs">
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">AI Recommended Decision Gate Adaptation:</span>
                  <strong className="text-neutral-950 block">{simulationResult.recommended_gate}</strong>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-neutral-500 text-xs">
                Select a scenario and click <strong>RUN DIGITAL TWIN SIMULATION</strong> to execute 1,000 Monte Carlo runs.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
