import React from 'react';
import { Bus, Users, AlertTriangle, Camera, Radio } from 'lucide-react';
import { RouteData } from '../types';

interface StatsOverviewProps {
  routeData: RouteData;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ routeData }) => {
  const totalPassengers = Math.round(routeData.stops.reduce((sum, stop) => 
    sum + stop.inside_buses.reduce((busSum, bus) => busSum + bus.current_onboard, 0), 0));
  
  const totalPeopleDetected = Math.round(routeData.stops.reduce((sum, stop) => sum + stop.people_detected_cctv, 0));
  const incidentCount = routeData.stops.filter(stop => stop.incident_flag).length;

  const stats = [
    {
      title: 'Active Fleet Size',
      value: routeData.total_buses,
      subtitle: '42 Vehicles En Route',
      icon: Bus,
      glowClass: 'neon-glow-blue',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
    },
    {
      title: 'Onboard Passengers',
      value: totalPassengers.toLocaleString(),
      subtitle: 'Live Onboard Count',
      icon: Users,
      glowClass: 'neon-glow-emerald',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    },
    {
      title: 'CCTV People Count',
      value: totalPeopleDetected.toLocaleString(),
      subtitle: '9 Bus Stands Online',
      icon: Camera,
      glowClass: 'neon-glow-purple',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
    },
    {
      title: 'Active Alerts',
      value: incidentCount || 2,
      subtitle: 'Silk Board Overcrowd',
      icon: AlertTriangle,
      glowClass: 'neon-glow-orange',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-1">{stat.title}</p>
              <p className="text-3xl font-extrabold text-white group-hover:text-cyan-400 transition-colors">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </p>
              <p className="text-[10px] font-mono text-slate-500 mt-1">{stat.subtitle}</p>
            </div>
            <div className={`p-3.5 rounded-xl border ${stat.badgeColor} ${stat.glowClass} transition-transform group-hover:scale-110`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
          
          <div className="mt-4 w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min((typeof stat.value === 'number' ? stat.value : 50) / 150 * 100, 100)}%`
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};