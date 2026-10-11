import React, { useState } from 'react';
import { MapPin, Camera, Clock, Users, AlertCircle, Bus, Send, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';
import { Stop } from '../types';

interface StopCardProps {
  stop: Stop;
  onDispatchBus: (stopNo: number, stopName: string) => void;
}

export const StopCard: React.FC<StopCardProps> = ({ stop, onDispatchBus }) => {
  const [isDispatching, setIsDispatching] = useState(false);

  const getCongestionBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'severe':
      case 'high': 
        return 'text-rose-400 bg-rose-500/20 border-rose-500/40 neon-border-red';
      case 'moderate':
      case 'medium': 
        return 'text-amber-400 bg-amber-500/20 border-amber-500/40';
      default: 
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40';
    }
  };

  const highCrowdThreshold = 70;
  const cooldownPeriod = 300000;

  const shouldShowDispatchButton =
    stop.people_detected_cctv > highCrowdThreshold &&
    (!stop.lastDispatchTime || (Date.now() - stop.lastDispatchTime) > cooldownPeriod);

  const handleDispatch = async () => {
    if (isDispatching) return;
    setIsDispatching(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    onDispatchBus(stop.stop_no, stop.stop_name);
    setTimeout(() => {
      setIsDispatching(false);
    }, 1000);
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800 shadow-2xl relative overflow-hidden group">
      {/* Top Header & Stop Number Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-extrabold text-sm shadow-md border border-blue-400/30">
            {stop.stop_no}
          </div>
          <div>
            <h3 className="text-white font-bold text-base group-hover:text-blue-400 transition-colors">
              {stop.stop_name}
            </h3>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <MapPin className="h-3 w-3 text-cyan-400" />
              <span className="text-slate-400 text-xs font-mono">
                {stop.gps_coordinates}
              </span>
            </div>
          </div>
        </div>

        {stop.incident_flag && (
          <div className="flex items-center space-x-1 bg-rose-500/20 border border-rose-500/40 px-2.5 py-1 rounded-full animate-pulse">
            <AlertCircle className="h-4 w-4 text-rose-400" />
            <span className="text-[10px] font-bold text-rose-300">INCIDENT</span>
          </div>
        )}
      </div>

      {/* Micro-Metrics Telemetry Grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-4 text-xs">
        <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl flex items-center space-x-2">
          <Camera className="h-4 w-4 text-cyan-400" />
          <div>
            <span className="text-slate-400 text-[10px] block font-mono">CCTV DETECTED</span>
            <span className="text-white font-bold">{stop.people_detected_cctv} people</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl flex items-center space-x-2">
          <Users className="h-4 w-4 text-purple-400" />
          <div>
            <span className="text-slate-400 text-[10px] block font-mono">WAITING QUEUE</span>
            <span className="text-white font-bold">{stop.waiting_passengers} waiting</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl flex items-center space-x-2">
          <Clock className="h-4 w-4 text-amber-400" />
          <div>
            <span className="text-slate-400 text-[10px] block font-mono">ARRIVAL RATE</span>
            <span className="text-white font-bold">{stop.arrival_rate}/hr</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl flex items-center space-x-2">
          <Bus className="h-4 w-4 text-emerald-400" />
          <div>
            <span className="text-slate-400 text-[10px] block font-mono">ACTIVE FLEET</span>
            <span className="text-white font-bold">{stop.inside_buses.length} buses</span>
          </div>
        </div>
      </div>

      {/* Congestion Level Badge */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getCongestionBadge(stop.congestion_level)}`}>
          {stop.congestion_level.toUpperCase()} ({stop.congestion_percentage}%)
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
          {stop.recommended_action}
        </span>
      </div>

      {/* Door Line-Crossing Passenger Flow Vectors */}
      <div className="bg-slate-900/90 rounded-xl p-3 mb-4 border border-slate-800">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-300">Passenger Flow Vectors (ByteTrack)</span>
          <span className="text-[10px] text-cyan-400 font-mono">DOOR GATE ACTIVE</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg flex items-center space-x-2">
            <ArrowUpRight className="h-5 w-5 text-emerald-400" />
            <div>
              <span className="text-emerald-400 text-base font-extrabold">{stop.etm_data.boarding}</span>
              <span className="text-[10px] text-slate-400 block font-medium">Boarded</span>
            </div>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/20 p-2 rounded-lg flex items-center space-x-2">
            <ArrowDownRight className="h-5 w-5 text-cyan-400" />
            <div>
              <span className="text-cyan-400 text-base font-extrabold">{stop.etm_data.alighting}</span>
              <span className="text-[10px] text-slate-400 block font-medium">Alighted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spare Bus Dispatch Control Button */}
      <div className="mb-4">
        <button
          onClick={handleDispatch}
          disabled={isDispatching}
          className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center space-x-2 text-xs uppercase tracking-wider cursor-pointer border border-blue-400/30"
        >
          <Zap className={`h-4 w-4 text-yellow-300 ${isDispatching ? 'animate-spin' : ''}`} />
          <span>{isDispatching ? 'Optimizing Fleet...' : 'Dispatch Spare Bus (OR-Tools)'}</span>
        </button>
      </div>

      {/* Active Buses List */}
      <div>
        <h4 className="text-slate-300 font-bold mb-2 text-xs uppercase tracking-wider">Active Buses at Stop</h4>
        <div className="space-y-1.5">
          {stop.inside_buses.map((bus) => (
            <div key={bus.bus_id} className="bg-slate-900/60 rounded-lg p-2 border border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${
                  bus.status === 'spare_needed' ? 'bg-rose-500 animate-ping' : 
                  bus.status === 'maintenance' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}></span>
                <div>
                  <p className="text-white font-bold">{bus.bus_id}</p>
                  <p className="text-slate-400 text-[10px]">{bus.driver}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-300 font-mono font-bold">{bus.vehicle_no}</p>
                <p className="text-slate-400 text-[10px]">
                  {Math.round(bus.current_onboard)}/{bus.max_capacity} Passengers
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next ETA Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
        <span className="text-slate-400 font-medium">Next Bus ETA</span>
        <span className="text-cyan-400 font-extrabold font-mono">{stop.next_bus_eta}</span>
      </div>
    </div>
  );
};