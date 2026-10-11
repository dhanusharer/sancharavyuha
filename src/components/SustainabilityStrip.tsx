import React from 'react';
import { Leaf, Droplets, Zap, TrendingUp } from 'lucide-react';

interface SustainabilityStripProps {
  carbonSavedKg: number;
  fuelSavedLiters: number;
  ecoScore: number;
  evReadinessPct: number;
}

export const SustainabilityStrip: React.FC<SustainabilityStripProps> = ({ carbonSavedKg, fuelSavedLiters, ecoScore, evReadinessPct }) => {
  const kpis = [
    { label: 'CO₂ Saved', value: `${carbonSavedKg.toLocaleString()} kg`, icon: Leaf, color: 'text-emerald-400' },
    { label: 'Fuel Saved', value: `${fuelSavedLiters} L`, icon: Droplets, color: 'text-cyan-400' },
    { label: 'Eco Score', value: `${ecoScore}/100`, icon: TrendingUp, color: 'text-amber-400' },
    { label: 'EV Ready', value: `${evReadinessPct}%`, icon: Zap, color: 'text-violet-400' },
  ];

  return (
    <div className="area-kpis panel flex flex-col">
      <div className="px-3 py-2 border-b border-slate-800/80 flex items-center space-x-1.5 flex-shrink-0">
        <Leaf className="h-3 w-3 text-emerald-400" />
        <span className="text-[9px] font-extrabold text-slate-500 tracking-[0.15em] uppercase">SUSTAINABILITY</span>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-2 px-3 py-2.5">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-slate-900/60 border border-slate-800/60 rounded-lg p-2.5 flex flex-col justify-center">
            <div className="flex items-center space-x-1.5 mb-1">
              <kpi.icon className={`h-3.5 w-3.5 ${kpi.color}`} />
              <span className="text-[9px] text-slate-500 font-medium uppercase">{kpi.label}</span>
            </div>
            <span className="text-base font-extrabold text-white">{kpi.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
