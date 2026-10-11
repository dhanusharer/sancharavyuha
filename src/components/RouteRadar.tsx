import React, { useState } from 'react';
import { Navigation } from 'lucide-react';
import { Stop } from '../types';

interface RouteRadarProps {
  stops: Stop[];
  selectedStopNo: number;
  onSelectStop: (stopNo: number) => void;
}

export const RouteRadar: React.FC<RouteRadarProps> = ({ stops, selectedStopNo, onSelectStop }) => {
  const [hoveredStopNo, setHoveredStopNo] = useState<number | null>(null);

  const getCongestionColor = (stop: Stop) => {
    if (stop.congestion_level === 'high' || stop.congestion_percentage > 70) return '#EF4444';
    if (stop.congestion_level === 'medium') return '#F59E0B';
    return '#10B981';
  };

  // Severity-encoded ring size: Critical/Large queue gets huge halo ring
  const getRingRadius = (stop: Stop) => {
    if (stop.waiting_passengers > 200 || stop.congestion_percentage > 85) return 28; // Huge ring
    if (stop.waiting_passengers > 120 || stop.congestion_percentage > 60) return 20; // Medium ring
    if (stop.waiting_passengers > 70) return 14; // Small ring
    return 0; // No ring
  };

  const svgW = 800, svgH = 460;

  const displayStops = stops.length > 10 
    ? stops.filter((s, idx) => idx % 3 === 0 || s.stop_no === 1 || s.stop_no === 6 || s.congestion_level === 'high')
    : stops;

  const stopPositions = displayStops.map((stop, idx) => {
    const total = displayStops.length;
    const t = idx / (total - 1 || 1);
    const x = 70 + t * 650;
    const y = 80 + Math.sin(t * Math.PI) * 120 + t * 240;
    return { ...stop, x, y };
  });

  const pathD = stopPositions.map((s, i) => `${i === 0 ? 'M' : 'L'} ${s.x.toFixed(1)} ${s.y.toFixed(1)}`).join(' ');

  const activeStopNo = hoveredStopNo !== null ? hoveredStopNo : selectedStopNo;
  const activePos = stopPositions.find(s => s.stop_no === activeStopNo);

  return (
    <div className="area-map panel flex flex-col" style={{ background: '#ffffff', borderColor: '#e5e5e5', borderRadius: '24px', boxShadow: 'var(--shadow-subtle)' }}>
      {/* Header */}
      <div className="px-4 py-2 border-b border-neutral-100 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Navigation className="h-3.5 w-3.5 text-neutral-900" />
          <span className="text-[10px] font-semibold text-neutral-950 tracking-[0.12em] uppercase">ROUTE 365J — LIVE CORRIDOR RADAR</span>
        </div>
        <span className="text-[10px] font-mono text-neutral-500">Ring size encodes crowd risk severity</span>
      </div>

      {/* SVG Canvas Container */}
      <div className="flex-1 relative overflow-hidden bg-neutral-50">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
            </pattern>
            <filter id="glow"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <style>{`
              @keyframes dash { to { stroke-dashoffset: -24; } }
              .route-dash { animation: dash 1.2s linear infinite; }
            `}</style>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Route Corridor Lines */}
          <path d={pathD} fill="none" stroke="#e5e5e5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d={pathD} fill="none" stroke="#737373" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Active Dispatch Connection Path */}
          {activePos && (activePos.congestion_level === 'high' || activePos.congestion_percentage > 70) && (
            <path d={`M ${stopPositions[0].x} ${stopPositions[0].y} L ${activePos.x} ${activePos.y}`}
              fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeDasharray="8,6" className="route-dash" opacity="0.85" />
          )}

          {/* SEVERITY ENCODED MAP NODES */}
          {stopPositions.map((stop) => {
            const isSelected = stop.stop_no === activeStopNo;
            const color = getCongestionColor(stop);
            const ringRadius = getRingRadius(stop);

            return (
              <g
                key={stop.stop_no}
                className="cursor-pointer"
                onClick={() => onSelectStop(stop.stop_no)}
                onMouseEnter={() => setHoveredStopNo(stop.stop_no)}
                onMouseLeave={() => setHoveredStopNo(null)}
              >
                {/* SEVERITY ENCODED HALO RING SIZE */}
                {ringRadius > 0 && (
                  <circle cx={stop.x} cy={stop.y} r={ringRadius} fill="none" stroke={color} strokeWidth="1.5" opacity={ringRadius > 24 ? "0.6" : "0.35"} className="health-pulse" />
                )}

                {/* Selection / Hover ring */}
                {isSelected && (
                  <circle cx={stop.x} cy={stop.y} r="22" fill={`${color}20`} stroke="#0a0a0a" strokeWidth="2" opacity="0.9" filter="url(#glow)" />
                )}

                {/* Clean dot */}
                <circle cx={stop.x} cy={stop.y} r={isSelected ? 8 : ringRadius > 20 ? 7 : 4.5} fill={`${color}44`} stroke={color} strokeWidth="2" />
                <circle cx={stop.x} cy={stop.y} r={isSelected ? 3.5 : 2} fill={color} />

                {/* FLOATING CARD — EXCLUSIVELY ON HOVER / CLICK */}
                {isSelected && (
                  <g>
                    <rect
                      x={stop.x > 550 ? stop.x - 175 : stop.x + 18}
                      y={stop.y - 48}
                      width="165"
                      height="76"
                      rx="14"
                      fill="#ffffff"
                      stroke="#e5e5e5"
                      strokeWidth="1.5"
                    />
                    <text x={stop.x > 550 ? stop.x - 162 : stop.x + 30} y={stop.y - 30} className="text-[10px] font-semibold" fill="#0a0a0a">
                      {stop.stop_name.substring(0, 20)}
                    </text>
                    <text x={stop.x > 550 ? stop.x - 162 : stop.x + 30} y={stop.y - 14} className="text-[9px] font-mono" fill="#737373">
                      {stop.waiting_passengers} waiting · {stop.inside_buses.length} buses
                    </text>
                    <text x={stop.x > 550 ? stop.x - 162 : stop.x + 30} y={stop.y + 2} className="text-[9px] font-mono" fill="#171717">
                      ↑{stop.etm_data.boarding} boarded · ↓{stop.etm_data.alighting} alighted
                    </text>
                    <text x={stop.x > 550 ? stop.x - 162 : stop.x + 30} y={stop.y + 18} className="text-[9px] font-semibold" fill={ringRadius > 18 ? '#e7000b' : '#0a0a0a'}>
                      {ringRadius > 18 ? '⚡ DISPATCH RECOMMENDED' : '● NORMAL OPERATIONS'}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
