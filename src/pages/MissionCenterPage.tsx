import React, { useState } from 'react';
import { Target, CheckCircle2, Clock, Play, RotateCcw, AlertTriangle, ArrowRight, ShieldCheck, Database, Layers } from 'lucide-react';

export const MissionCenterPage: React.FC = () => {
  const [activeMissionId, setActiveMissionId] = useState<string>('MISSION-365J-014');

  const missions = [
    {
      id: 'MISSION-365J-014',
      title: 'Silk Board Junction Overcrowding Recovery',
      corridor: 'Route 365J (Majestic to Silk Board)',
      severity: 'CRITICAL',
      status: 'EXECUTING',
      progress: 60,
      assigned_vehicle: '365J-SP42 (EV Standby Bus)',
      net_saved_rs: 2315,
      subtasks: [
        { id: 1, name: 'Ingest Multi-Stream Telemetry & Match Decision Memory', status: 'COMPLETED' },
        { id: 2, name: 'Validate 5-Domain Policy Governance Rules', status: 'COMPLETED' },
        { id: 3, name: 'Evaluate 7 Decision Gates via OR-Tools MILP Solver', status: 'COMPLETED' },
        { id: 4, name: 'Execute Dispatch Action & Broadcast GTFS-RT', status: 'IN_PROGRESS' },
        { id: 5, name: 'Monitor 15-Min Closed-Loop Recovery Evaluation', status: 'PENDING' }
      ]
    },
    {
      id: 'MISSION-365J-012',
      title: 'Heavy Rain Corridor Relief',
      corridor: 'Route 365J (Bannerghatta Road Segment)',
      severity: 'HIGH',
      status: 'RESOLVED',
      progress: 100,
      assigned_vehicle: '365J-04 (Diesel Short-Turn)',
      net_saved_rs: 1840,
      subtasks: [
        { id: 1, name: 'Ingest Multi-Stream Telemetry & Match Decision Memory', status: 'COMPLETED' },
        { id: 2, name: 'Validate 5-Domain Policy Governance Rules', status: 'COMPLETED' },
        { id: 3, name: 'Evaluate 7 Decision Gates via OR-Tools MILP Solver', status: 'COMPLETED' },
        { id: 4, name: 'Execute Dispatch Action & Broadcast GTFS-RT', status: 'COMPLETED' },
        { id: 5, name: 'Monitor 15-Min Closed-Loop Recovery Evaluation', status: 'COMPLETED' }
      ]
    }
  ];

  const currentMission = missions.find(m => m.id === activeMissionId) || missions[0];

  return (
    <div className="p-4 space-y-4 font-mono">
      {/* HEADER BANNER */}
      <div className="bg-neutral-950 text-white rounded-[20px] p-4 border border-neutral-800 flex justify-between items-center shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-solid bg-blue-600 text-white text-[10px] font-bold">MISSION CENTER (WS-03)</span>
            <span className="text-xs text-neutral-400">Persona: Operations Planner</span>
          </div>
          <h1 className="text-base font-bold text-white">Active Operations Mission Lifecycle & GTFS-RT Dispatch Tracking</h1>
        </div>
        <div className="text-right">
          <span className="text-xs text-neutral-400 block">Active Missions</span>
          <strong className="text-lg text-emerald-400 font-bold">1 EXECUTING | 1 RESOLVED</strong>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* MISSION SELECTOR SIDEBAR */}
        <div className="bg-white border border-neutral-200 rounded-[20px] p-4 space-y-3 shadow-sm">
          <h2 className="text-xs font-bold text-neutral-950 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="h-4 w-4 text-blue-600" />
            Operational Missions List
          </h2>

          <div className="space-y-2">
            {missions.map(m => (
              <div
                key={m.id}
                onClick={() => setActiveMissionId(m.id)}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  activeMissionId === m.id
                    ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                    : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-neutral-500">{m.id}</span>
                  <span className={`badge-solid text-[9px] ${
                    m.status === 'EXECUTING' ? 'bg-amber-500 text-black' : 'bg-emerald-600 text-white'
                  }`}>
                    {m.status}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-neutral-950 mb-1">{m.title}</h3>
                <span className="text-[10px] text-neutral-500 block mb-2">{m.corridor}</span>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-neutral-600">Net Rupee Benefit:</span>
                  <strong className="text-emerald-700 font-bold">₹{m.net_saved_rs} Saved</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVE MISSION DETAILED LIFECYCLE */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white border border-neutral-200 rounded-[20px] p-4 space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase block">{currentMission.id}</span>
                <h2 className="text-sm font-bold text-neutral-950">{currentMission.title}</h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-500 block">Assigned Interlining Vehicle</span>
                <strong className="text-xs text-neutral-950 font-bold">{currentMission.assigned_vehicle}</strong>
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-neutral-950">
                <span>Mission Execution Progress</span>
                <span className="text-blue-600">{currentMission.progress}%</span>
              </div>
              <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${currentMission.progress}%` }}></div>
              </div>
            </div>

            {/* SUBTASKS STEPPER */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-neutral-900" />
                Mission Subtask Execution Pipeline
              </h3>
              <div className="space-y-2">
                {currentMission.subtasks.map(st => (
                  <div key={st.id} className="flex justify-between items-center p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-[10px]">
                        {st.id}
                      </span>
                      <span className="text-neutral-950 font-medium">{st.name}</span>
                    </div>
                    <span className={`badge-solid text-[9px] font-bold ${
                      st.status === 'COMPLETED' ? 'bg-emerald-600 text-white' :
                      st.status === 'IN_PROGRESS' ? 'bg-amber-500 text-black animate-pulse' : 'bg-neutral-200 text-neutral-700'
                    }`}>
                      {st.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
