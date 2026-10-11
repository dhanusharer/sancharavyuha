import React from 'react';
import { Bus, Zap, ShieldCheck, Clock, AlertTriangle, BatteryCharging, Wrench, ShieldAlert } from 'lucide-react';

export const FleetIntelligencePage: React.FC = () => {
  const fleetVehicles = [
    { id: '365J-SP42', type: 'Spare EV Bus', driver: 'M. Kumar (ID #4208)', shiftHrs: 4.8, maxHrs: 8.0, soc: 82.0, temp: '31°C', health: 'HEALTHY', status: 'DISPATCHED' },
    { id: '365J-04', type: 'Diesel BS-VI', driver: 'S. Ramu (ID #1104)', shiftHrs: 6.2, maxHrs: 8.0, soc: null, temp: '88°C', health: 'HEALTHY', status: 'EN ROUTE' },
    { id: '365J-SP18', type: 'Spare EV Bus', driver: 'V. Naidu (ID #3092)', shiftHrs: 2.1, maxHrs: 8.0, soc: 95.0, temp: '29°C', health: 'HEALTHY', status: 'STANDBY (BAY A)' },
    { id: '365J-12', type: 'Diesel BS-VI', driver: 'R. Gowda (ID #0841)', shiftHrs: 7.6, maxHrs: 8.0, soc: null, temp: '94°C', health: 'WARNING (OVERHEAT)', status: 'HOLDING BAY B' },
  ];

  return (
    <div className="p-4 space-y-4 font-mono bg-[#0B0F17] text-white min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-[#1E293B] pb-3">
        <div>
          <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
            FLEET INTELLIGENCE (WS-06)
          </span>
          <h1 className="text-xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <Bus className="h-5 w-5 text-cyan-400" />
            Electric Vehicle State-of-Charge & Driver Shift Compliance
          </h1>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-bold">
            ⚡ 18 ACTIVE EVs ONLINE
          </span>
        </div>
      </div>

      {/* KPI METRICS STRIP */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-[#121824] border border-[#1E293B] rounded-xl p-3">
          <span className="text-[9px] text-neutral-400 uppercase font-bold block">ACTIVE FLEET COUNT</span>
          <strong className="text-2xl text-emerald-400 font-bold block my-1">42 Vehicles</strong>
          <span className="text-[9px] text-neutral-500">18 EV / 24 Diesel BS-VI</span>
        </div>
        <div className="bg-[#121824] border border-[#1E293B] rounded-xl p-3">
          <span className="text-[9px] text-neutral-400 uppercase font-bold block">AVG EV BATTERY SOC</span>
          <strong className="text-2xl text-cyan-400 font-bold block my-1">84.5%</strong>
          <span className="text-[9px] text-emerald-400 font-bold">ALL ABOVE 20% MIN LIMIT</span>
        </div>
        <div className="bg-[#121824] border border-[#1E293B] rounded-xl p-3">
          <span className="text-[9px] text-neutral-400 uppercase font-bold block">DRIVER SHIFT COMPLIANCE</span>
          <strong className="text-2xl text-emerald-400 font-bold block my-1">100%</strong>
          <span className="text-[9px] text-neutral-500">0 Overtime Violations</span>
        </div>
        <div className="bg-[#121824] border border-[#1E293B] rounded-xl p-3">
          <span className="text-[9px] text-neutral-400 uppercase font-bold block">DEPOT STANDBY RESERVES</span>
          <strong className="text-2xl text-amber-400 font-bold block my-1">4 Buses</strong>
          <span className="text-[9px] text-amber-300 font-bold">Shanthinagar Holding Bay</span>
        </div>
      </div>

      {/* FLEET TABLE */}
      <div className="bg-[#121824] border border-[#1E293B] rounded-2xl p-4 space-y-3">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#1E293B] pb-2 flex items-center justify-between">
          <span>Active Vehicle Health & Driver Shift Ledger</span>
          <span className="text-[10px] text-neutral-400 font-normal">POL-FLEET-002 ENFORCED</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1E293B] text-neutral-400 text-[10px]">
                <th className="p-2.5">BUS ID</th>
                <th className="p-2.5">TYPE</th>
                <th className="p-2.5">ASSIGNED DRIVER</th>
                <th className="p-2.5">DUTY HOURS</th>
                <th className="p-2.5">BATTERY / TEMP</th>
                <th className="p-2.5">HEALTH</th>
                <th className="p-2.5">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {fleetVehicles.map(bus => (
                <tr key={bus.id} className="border-b border-[#1E293B]/60 hover:bg-[#161F30]">
                  <td className="p-2.5 font-bold text-white">{bus.id}</td>
                  <td className="p-2.5 text-neutral-300">{bus.type}</td>
                  <td className="p-2.5 text-neutral-300">{bus.driver}</td>
                  <td className="p-2.5 font-mono">{bus.shiftHrs} / {bus.maxHrs} hrs</td>
                  <td className="p-2.5 font-mono text-cyan-400">{bus.soc ? `${bus.soc}% SoC` : bus.temp}</td>
                  <td className="p-2.5">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${bus.health.includes('WARNING') ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'}`}>
                      {bus.health}
                    </span>
                  </td>
                  <td className="p-2.5 font-bold text-cyan-400">{bus.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
