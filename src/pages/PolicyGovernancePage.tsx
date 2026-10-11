import React from 'react';
import { Shield, ShieldCheck, AlertOctagon, CheckCircle2, Lock, FileText, Cpu } from 'lucide-react';

export const PolicyGovernancePage: React.FC = () => {
  const policyRules = [
    { id: 'POL-OPS-001', domain: 'OPERATIONAL', rule: 'Max Commuter Wait Delay Cut Ceiling', threshold: '≤ 20.0 minutes', status: 'COMPLIANT (100%)', weight: '0.35' },
    { id: 'POL-FLEET-002', domain: 'FLEET', rule: 'Minimum EV Battery State-of-Charge', threshold: '≥ 20.0% SoC', status: 'COMPLIANT (100%)', weight: '0.25' },
    { id: 'POL-SAFETY-003', domain: 'SAFETY', rule: 'Driver Maximum Shift Length Limit', threshold: '≤ 8.0 Hours', status: 'COMPLIANT (100%)', weight: '0.20' },
    { id: 'POL-BIZ-004', domain: 'BUSINESS', rule: 'Positive Rupee ROI Economic Threshold', threshold: '≥ ₹500 Net Benefit', status: 'COMPLIANT (100%)', weight: '0.10' },
    { id: 'POL-REG-005', domain: 'REGULATORY', rule: 'Minimum Holding Bay Depot Standby Reserve', threshold: '≥ 3 Standby Buses', status: 'COMPLIANT (100%)', weight: '0.10' },
  ];

  return (
    <div className="p-4 space-y-4 font-mono bg-[#0B0F17] text-white min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-[#1E293B] pb-3">
        <div>
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
            POLICY GOVERNANCE (WS-09)
          </span>
          <h1 className="text-xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-400" />
            5-Domain Policy Audit Engine & Hard Operational Boundaries
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" /> 100% POLICY PASS RATE
          </span>
        </div>
      </div>

      {/* POLICY AUDIT LEDGER */}
      <div className="bg-[#121824] border border-[#1E293B] rounded-2xl p-4 space-y-3">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#1E293B] pb-2 flex items-center justify-between">
          <span>Active Policy Rule Set & Constraint Scoring Weights</span>
          <span className="text-[10px] text-cyan-400 font-bold">5 GOVERNANCE RULES ACTIVE</span>
        </h2>
        <div className="space-y-2">
          {policyRules.map(rule => (
            <div key={rule.id} className="p-3 bg-[#161F30] border border-[#1E293B] rounded-xl flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                    {rule.id}
                  </span>
                  <strong className="text-white font-bold">{rule.rule}</strong>
                </div>
                <span className="text-[10px] text-neutral-400 block font-mono">
                  Domain: {rule.domain} | Threshold Boundary: <strong className="text-white">{rule.threshold}</strong>
                </span>
              </div>
              <div className="text-right space-y-1">
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-bold px-2 py-0.5 rounded inline-block">
                  {rule.status}
                </span>
                <span className="text-[10px] text-neutral-400 block font-mono">Weight: {rule.weight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
