import React from 'react';
import { Camera, Users, ArrowUpRight, ArrowDownRight, Zap, AlertCircle, ChevronRight } from 'lucide-react';
import { Stop } from '../types';

interface StopSidebarProps {
  stops: Stop[];
  selectedStopNo: number;
  onSelectStop: (stopNo: number) => void;
  onDispatchBus: (stopNo: number, stopName: string) => void;
}

export const StopSidebar: React.FC<StopSidebarProps> = ({ stops, selectedStopNo, onSelectStop, onDispatchBus }) => {
  // Sort stops: high congestion first
  const sortedStops = [...stops].sort((a, b) => {
    const severity = (s: Stop) => {
      if (s.congestion_level === 'high' || s.congestion_percentage > 70) return 0;
      if (s.congestion_level === 'medium' || s.congestion_percentage > 40) return 1;
      return 2;
    };
    return severity(a) - severity(b);
  });

  const criticalStops = sortedStops.filter(s => s.congestion_level === 'high' || s.congestion_percentage > 70);
  const otherStops = sortedStops.filter(s => !(s.congestion_level === 'high' || s.congestion_percentage > 70));

  // Only expand top 3 critical stops to prevent sidebar overload
  const expandedStops = criticalStops.slice(0, 3);
  const collapsedCriticalStops = criticalStops.slice(3);

  const getSeverityClass = (stop: Stop) => {
    if (stop.congestion_level === 'high' || stop.congestion_percentage > 70) return 'stop-critical';
    if (stop.congestion_level === 'medium') return 'stop-warning';
    return 'stop-healthy';
  };

  const getSeverityDot = (stop: Stop) => {
    if (stop.congestion_level === 'high' || stop.congestion_percentage > 70) return 'bg-rose-500';
    if (stop.congestion_level === 'medium') return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const renderExpandedStop = (stop: Stop) => (
    <div
      key={stop.stop_no}
      onClick={() => onSelectStop(stop.stop_no)}
      className={`${getSeverityClass(stop)} px-3 py-2 cursor-pointer transition-all duration-200 ${selectedStopNo === stop.stop_no ? 'bg-neutral-100' : ''}`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-2 min-w-0">
          <div className="relative flex-shrink-0">
            <div className={`w-2.5 h-2.5 rounded-full ${getSeverityDot(stop)}`}></div>
            {stop.congestion_level === 'high' && <div className={`absolute inset-0 w-2.5 h-2.5 rounded-full ${getSeverityDot(stop)} health-pulse`}></div>}
          </div>
          <span className="text-xs font-semibold text-neutral-950 truncate max-w-[150px]">{stop.stop_name}</span>
        </div>
        {stop.incident_flag && <AlertCircle className="h-3.5 w-3.5 text-[#e7000b] animate-pulse flex-shrink-0" />}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mb-1.5 text-[10px] font-mono">
        <div className="flex items-center space-x-1">
          <Camera className="h-3 w-3 text-neutral-500 flex-shrink-0" />
          <span className="text-neutral-600">{stop.people_detected_cctv} det</span>
        </div>
        <div className="flex items-center space-x-1">
          <Users className="h-3 w-3 text-neutral-500 flex-shrink-0" />
          <span className="text-neutral-600">{stop.waiting_passengers} wait</span>
        </div>
        <div className="flex items-center space-x-1">
          <ArrowUpRight className="h-3 w-3 text-neutral-900 flex-shrink-0" />
          <span className="text-neutral-950 font-medium">↑{stop.etm_data.boarding}</span>
        </div>
        <div className="flex items-center space-x-1">
          <ArrowDownRight className="h-3 w-3 text-neutral-900 flex-shrink-0" />
          <span className="text-neutral-950 font-medium">↓{stop.etm_data.alighting}</span>
        </div>
      </div>

      {/* Dispatch Button */}
      <button
        onClick={(e) => { e.stopPropagation(); onDispatchBus(stop.stop_no, stop.stop_name); }}
        className="btn-primary w-full flex items-center justify-center space-x-1.5 text-[10px] font-semibold py-1 rounded-[18px] transition-all cursor-pointer"
        style={{ height: '28px' }}
      >
        <Zap className="h-3 w-3 text-white" />
        <span>DISPATCH SPARE</span>
      </button>
    </div>
  );

  const renderCollapsedStop = (stop: Stop) => (
    <div
      key={stop.stop_no}
      onClick={() => onSelectStop(stop.stop_no)}
      className={`${getSeverityClass(stop)} px-3 py-1.5 cursor-pointer flex items-center justify-between transition-all duration-200 hover:bg-neutral-50 ${selectedStopNo === stop.stop_no ? 'bg-neutral-100' : ''}`}
    >
      <div className="flex items-center space-x-2 min-w-0">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getSeverityDot(stop)}`}></div>
        <span className="text-[11px] text-neutral-800 truncate max-w-[140px] font-medium">{stop.stop_name}</span>
      </div>
      <div className="flex items-center space-x-1.5 text-[10px] font-mono text-neutral-500 flex-shrink-0">
        <span>{stop.waiting_passengers}w</span>
        <ChevronRight className="h-3 w-3 text-neutral-400" />
      </div>
    </div>
  );

  return (
    <div className="area-stops panel flex flex-col" style={{ background: '#ffffff', borderColor: '#e5e5e5', borderRadius: '24px', boxShadow: 'var(--shadow-subtle)' }}>
      {/* Section Header */}
      <div className="px-3 py-2 border-b border-neutral-100 flex items-center justify-between flex-shrink-0">
        <span className="text-[10px] font-semibold text-neutral-500 tracking-[0.12em] uppercase font-mono">BUS STOPS ({stops.length})</span>
        <span className="text-[9px] font-mono text-[#e7000b] font-semibold">{criticalStops.length} CRITICAL</span>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
        {/* Top 3 Critical Stops — Expanded */}
        {expandedStops.length > 0 && (
          <div>
            <div className="px-3 py-1 bg-red-50/50 border-b border-neutral-100 text-[9px] font-semibold text-[#e7000b] tracking-[0.12em] uppercase font-mono">
              ⚠ ACTION REQUIRED ({criticalStops.length})
            </div>
            <div className="divide-y divide-neutral-100">
              {expandedStops.map(renderExpandedStop)}
            </div>
          </div>
        )}

        {/* Other Critical & Warning Stops — Collapsed */}
        {collapsedCriticalStops.length > 0 && (
          <div>
            <div className="divide-y divide-neutral-100">
              {collapsedCriticalStops.map(renderCollapsedStop)}
            </div>
          </div>
        )}

        {/* Healthy Stops — Collapsed */}
        {otherStops.length > 0 && (
          <div>
            <div className="px-3 py-1 bg-neutral-50 border-b border-neutral-100 text-[9px] font-semibold text-neutral-600 tracking-[0.12em] uppercase font-mono">
              ● NORMAL OPERATIONS ({otherStops.length})
            </div>
            <div className="divide-y divide-neutral-100">
              {otherStops.map(renderCollapsedStop)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
