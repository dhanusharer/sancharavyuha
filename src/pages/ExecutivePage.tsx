import React from 'react';
import { TrendingUp, ShieldCheck, DollarSign, Award, Leaf, Calendar, ArrowUpRight, Bus } from 'lucide-react';

export const ExecutivePage: React.FC = () => {
  return (
    <div className="p-6 space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-950 tracking-tight">Executive ROI & Governance Workspace</h1>
          <p className="text-xs text-neutral-500 font-mono">Persona: Executive | High-level ROI metrics, SLA compliance, and fleet electrification progress</p>
        </div>
        <div className="flex items-center space-x-2 bg-neutral-950 text-white px-3 py-1.5 rounded-[14px] text-xs font-mono font-semibold">
          <Award className="h-4 w-4 text-emerald-400" />
          <span>BMTC PILOT PERFORMANCE: EXCELLENT</span>
        </div>
      </div>

      {/* LEVEL 1: OVERVIEW KPI CARDS */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 rounded-[24px] p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
            <span>ANNUAL OPEX SAVINGS</span>
            <span className="text-emerald-600 font-semibold flex items-center"><ArrowUpRight className="h-3.5 w-3.5" />+18.4%</span>
          </div>
          <div className="text-3xl font-bold text-neutral-950 font-mono">₹12.58 Cr</div>
          <div className="text-[10px] text-neutral-500 font-mono">Derived from 3,750L daily diesel savings</div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-[24px] p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
            <span>CORRIDOR SLA COMPLIANCE</span>
            <span className="text-emerald-600 font-semibold flex items-center"><ArrowUpRight className="h-3.5 w-3.5" />Target Met</span>
          </div>
          <div className="text-3xl font-bold text-neutral-950 font-mono">98.4%</div>
          <div className="text-[10px] text-neutral-500 font-mono">Target &ge; 95.0% on-time performance</div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-[24px] p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
            <span>FLEET ELECTRIFICATION RATIO</span>
            <span className="text-emerald-600 font-semibold flex items-center"><ArrowUpRight className="h-3.5 w-3.5" />+5% MoM</span>
          </div>
          <div className="text-3xl font-bold text-neutral-950 font-mono">42% EV</div>
          <div className="text-[10px] text-emerald-600 font-mono font-medium">Zero emission corridor lead</div>
        </div>
      </div>

      {/* LEVEL 2: DEEPENED ANALYTICAL SECTIONS (MONTHLY ROI & CO2 TIMELINE) */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-200 rounded-[24px] p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <span className="text-xs font-semibold text-neutral-950 uppercase font-mono">Quarterly OPEX & Savings Trajectory</span>
            <span className="text-[10px] text-neutral-500 font-mono">Q1–Q4 2026</span>
          </div>
          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-neutral-700 mb-1"><span>Q1 2026 (Actual):</span><strong>₹3.14 Cr Saved</strong></div>
              <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-neutral-950 h-full rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-neutral-700 mb-1"><span>Q2 2026 (Actual):</span><strong>₹3.42 Cr Saved</strong></div>
              <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-neutral-950 h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-neutral-700 mb-1"><span>Q3 2026 (Projected):</span><strong>₹3.02 Cr Target</strong></div>
              <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-[24px] p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <span className="text-xs font-semibold text-neutral-950 uppercase font-mono">ISO 14064 Well-to-Wheel Carbon Mitigation</span>
            <span className="text-[10px] text-emerald-600 font-mono font-bold">10.03 TONNES CO2/DAY</span>
          </div>
          <div className="space-y-2 text-xs font-mono text-neutral-700">
            <div className="flex justify-between border-b border-neutral-100 pb-1.5"><span>Direct Tailpipe Reduction:</span><strong>7,420 kg/day</strong></div>
            <div className="flex justify-between border-b border-neutral-100 pb-1.5"><span>Grid Solar Offsetting:</span><strong>2,610 kg/day</strong></div>
            <div className="flex justify-between border-b border-neutral-100 pb-1.5"><span>Cumulative 2026 Reduction:</span><strong className="text-neutral-950 font-bold">912.4 Tonnes CO2</strong></div>
            <div className="flex justify-between"><span>Audit Certification:</span><span className="text-emerald-700 font-bold">Verified by Bureau Veritas</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
