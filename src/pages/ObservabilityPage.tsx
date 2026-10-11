import React, { useState } from 'react';
import { Activity, ShieldCheck, Clock, Layers, RefreshCw, Cpu, Database, AlertCircle } from 'lucide-react';

export const ObservabilityPage: React.FC = () => {
  const [selectedTraceId, setSelectedTraceId] = useState<string>('TRACE-88F4A21C');

  const traces = [
    {
      trace_id: 'TRACE-88F4A21C',
      mission_id: 'MISSION-365J-014',
      stop_no: 6,
      stop_name: 'Silk Board Junction',
      total_latency_ms: 14.2,
      status: '200_OK',
      timestamp: '2026-10-11T05:10:12Z',
      spans: [
        { name: '1_raw_telemetry_acquisition', latency_ms: 1.2, status: 'OK' },
        { name: '2_reliable_observation_fusion', latency_ms: 2.4, status: 'OK' },
        { name: '3_operational_context_builder', latency_ms: 1.1, status: 'OK' },
        { name: '4_lightgbm_demand_forecast', latency_ms: 3.2, status: 'OK' },
        { name: '5_policy_governance_audit', latency_ms: 0.8, status: 'OK' },
        { name: '6_multi_agent_consensus_bidding', latency_ms: 2.1, status: 'OK' },
        { name: '7_ortools_milp_solver', latency_ms: 1.8, status: 'OK' },
        { name: '8_digital_twin_pre_simulation', latency_ms: 1.0, status: 'OK' },
        { name: '9_approved_mission_financials', latency_ms: 0.4, status: 'OK' },
        { name: '10_closed_loop_learning_record', latency_ms: 0.2, status: 'OK' }
      ]
    }
  ];

  const currentTrace = traces.find(t => t.trace_id === selectedTraceId) || traces[0];

  return (
    <div className="p-4 space-y-4 font-mono">
      {/* HEADER BANNER */}
      <div className="bg-neutral-950 text-white rounded-[20px] p-4 border border-neutral-800 flex justify-between items-center shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-solid bg-indigo-600 text-white text-[10px] font-bold">OBSERVABILITY (WS-07)</span>
            <span className="text-xs text-neutral-400">Persona: Pipeline Debugger</span>
          </div>
          <h1 className="text-base font-bold text-white">10-Stage Pipeline Distributed Span Tracing & Telemetry Freshness</h1>
        </div>
        <div className="text-right">
          <span className="text-xs text-neutral-400 block">End-to-End Solver Latency</span>
          <strong className="text-lg text-emerald-400 font-bold">14.2 ms (&lt; 35ms SLA)</strong>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* RECENT TRACES LIST */}
        <div className="bg-white border border-neutral-200 rounded-[20px] p-4 space-y-3 shadow-sm">
          <h2 className="text-xs font-bold text-neutral-950 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-indigo-600" />
            Distributed Spans List
          </h2>

          <div className="space-y-2">
            {traces.map(tr => (
              <div
                key={tr.trace_id}
                onClick={() => setSelectedTraceId(tr.trace_id)}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  selectedTraceId === tr.trace_id
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                    : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <strong className="text-xs font-bold text-neutral-950">{tr.trace_id}</strong>
                  <span className="badge-solid bg-emerald-600 text-white font-bold text-[9px]">{tr.status}</span>
                </div>
                <span className="text-[10px] text-neutral-500 block">{tr.stop_name} (Stop #{tr.stop_no})</span>
                <div className="flex justify-between items-center text-[10px] pt-1">
                  <span className="text-neutral-500">Latency:</span>
                  <strong className="text-indigo-700 font-bold">{tr.total_latency_ms} ms</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DISTRIBUTED SPAN TIMELINE INSPECTOR */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white border border-neutral-200 rounded-[20px] p-4 space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase block">{currentTrace.trace_id}</span>
                <h2 className="text-sm font-bold text-neutral-950">10-Stage Pipeline Distributed Span Waterfall</h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-500 block">Total Execution Time</span>
                <strong className="text-xs text-emerald-700 font-bold">{currentTrace.total_latency_ms} ms</strong>
              </div>
            </div>

            {/* SPANS WATERFALL */}
            <div className="space-y-2">
              {currentTrace.spans.map((sp, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-neutral-950">
                    <span className="text-neutral-800">{idx + 1}. {sp.name}</span>
                    <span className="text-indigo-700">{sp.latency_ms} ms</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${(sp.latency_ms / 4.0) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
