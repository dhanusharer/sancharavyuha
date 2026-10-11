import React from 'react';
import { Bus } from 'lucide-react';
import { Stop } from '../types';

interface FleetStripProps {
  stops: Stop[];
}

export const FleetStrip: React.FC<FleetStripProps> = ({ stops }) => {
  const allBuses = stops.flatMap(stop =>
    stop.inside_buses.map(bus => ({ ...bus, stopName: stop.stop_name, stopNo: stop.stop_no }))
  );

  return (
    <div className="area-fleet panel flex flex-col" style={{ background: '#ffffff', borderColor: '#e5e5e5', borderRadius: '24px', boxShadow: 'var(--shadow-subtle)' }}>
      <div className="px-3 py-2 border-b border-neutral-100 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-1.5">
          <Bus className="h-3 w-3 text-neutral-900" />
          <span className="text-[9px] font-semibold text-neutral-500 tracking-[0.12em] uppercase font-mono">FLEET AVAILABILITY</span>
        </div>
        <span className="text-[10px] font-mono text-neutral-500">{allBuses.length} active</span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
        {allBuses.map(bus => {
          const pct = Math.round((bus.current_onboard / bus.max_capacity) * 100);
          
          // Color code fleet status by availability & occupancy
          const barColor = pct > 80 ? 'bg-[#e7000b]' : pct > 50 ? 'bg-neutral-600' : 'bg-neutral-950';
          const statusText = pct > 80 ? 'FULL' : pct > 50 ? 'NEAR CAPACITY' : 'READY';
          const textColor = pct > 80 ? 'text-[#e7000b]' : 'text-neutral-950';

          return (
            <div key={bus.bus_id} className="flex items-center space-x-2">
              <span className="text-[10px] font-semibold text-neutral-950 w-14 flex-shrink-0 font-mono">{bus.bus_id}</span>
              <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
                <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }}></div>
              </div>
              <span className={`text-[8px] font-mono font-semibold w-16 text-right flex-shrink-0 ${textColor}`}>
                {statusText} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
