import React, { useState, useEffect, useRef } from 'react';
import { Clock, TrendingUp, AlertTriangle, Bus, Zap, Radio } from 'lucide-react';

interface TimelineEvent {
  id: string;
  time: string;
  label: string;
  type: 'forecast' | 'alert' | 'dispatch' | 'resolved' | 'system';
}

interface EventTimelineProps {
  simulationMode: string;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({ simulationMode }) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const now = new Date();
    const fmt = (d: Date) => d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    const baseEvents: TimelineEvent[] = [
      { id: '1', time: fmt(new Date(now.getTime() - 600000)), label: 'System initialized. 9 cameras online.', type: 'system' },
      { id: '2', time: fmt(new Date(now.getTime() - 480000)), label: 'LightGBM forecast computed for all stops.', type: 'forecast' },
      { id: '3', time: fmt(new Date(now.getTime() - 360000)), label: 'Silk Board congestion detected (210 waiting).', type: 'alert' },
      { id: '4', time: fmt(new Date(now.getTime() - 240000)), label: 'AI recommends spare bus dispatch → Silk Board.', type: 'dispatch' },
      { id: '5', time: fmt(new Date(now.getTime() - 120000)), label: 'Bus 365J-SP42 assigned & en route.', type: 'dispatch' },
      { id: '6', time: fmt(now), label: 'Monitoring. Next forecast update in 8 min.', type: 'system' },
    ];

    if (simulationMode === 'rain') {
      baseEvents.splice(2, 0, { id: 'r1', time: fmt(new Date(now.getTime() - 400000)), label: 'IMD Rain Alert: Heavy rainfall Bengaluru South.', type: 'alert' });
    }
    if (simulationMode === 'festival') {
      baseEvents.splice(2, 0, { id: 'f1', time: fmt(new Date(now.getTime() - 400000)), label: 'Festival mode: Ganesh Chaturthi surge expected.', type: 'alert' });
    }

    setEvents(baseEvents);
  }, [simulationMode]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [events]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'forecast': return <TrendingUp className="h-3 w-3 text-blue-400" />;
      case 'alert': return <AlertTriangle className="h-3 w-3 text-amber-400" />;
      case 'dispatch': return <Bus className="h-3 w-3 text-cyan-400" />;
      case 'resolved': return <Zap className="h-3 w-3 text-emerald-400" />;
      default: return <Clock className="h-3 w-3 text-slate-500" />;
    }
  };

  const getDotColor = (type: string) => {
    switch (type) {
      case 'alert': return 'bg-amber-500 shadow-amber-500/30';
      case 'dispatch': return 'bg-cyan-500 shadow-cyan-500/30';
      case 'forecast': return 'bg-blue-500 shadow-blue-500/30';
      case 'resolved': return 'bg-emerald-500 shadow-emerald-500/30';
      default: return 'bg-slate-600';
    }
  };

  return (
    <div className="area-timeline panel flex flex-col" style={{ background: '#ffffff', borderColor: '#e5e5e5', borderRadius: '24px', boxShadow: 'var(--shadow-subtle)' }}>
      <div className="px-3 py-2 border-b border-neutral-100 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-1.5">
          <Clock className="h-3 w-3 text-neutral-900" />
          <span className="text-[9px] font-semibold text-neutral-500 tracking-[0.12em] uppercase font-mono">LIVE EVENT TIMELINE</span>
        </div>
        <div className="flex items-center space-x-1 text-neutral-950 font-mono text-[9px] font-semibold">
          <Radio className="h-3 w-3 animate-spin" style={{ animationDuration: '3s' }} />
          <span>NOW (LIVE)</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-x-auto overflow-y-hidden px-3 py-2">
        <div className="flex items-start space-x-0 min-w-max relative">
          {/* Horizontal connector line */}
          <div className="absolute top-[7px] left-0 right-0 h-px bg-neutral-200"></div>

          {events.map((event, idx) => {
            const isLatest = idx === events.length - 1;
            const isDispatch = event.type === 'dispatch';
            return (
              <div
                key={event.id}
                className={`flex flex-col items-start relative transition-opacity cursor-pointer ${
                  isLatest ? 'opacity-100 font-semibold' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ minWidth: '150px' }}
              >
                {/* Dot */}
                <div className={`w-3.5 h-3.5 rounded-full ${getDotColor(event.type)} z-10 border-2 border-white`}></div>

                {/* Content */}
                <div className="mt-1.5 pr-3">
                  <div className="flex items-center space-x-1 mb-0.5 font-mono">
                    {getIcon(event.type)}
                    <span className="text-[9px] font-semibold text-neutral-500">{event.time}</span>
                  </div>
                  <p className="text-[10px] text-neutral-900 leading-tight max-w-[140px] font-medium">{event.label}</p>
                  {isDispatch && (
                    <div className="mt-1 text-[8px] font-mono bg-neutral-950 text-white px-1.5 py-0.5 rounded-[4px] inline-block font-bold">
                      KA-01-F-4298 • Driver: Rajesh
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* NOW (LIVE) Pulsing Marker at the far right */}
          <div className="flex flex-col items-start relative pr-4" style={{ minWidth: '80px' }}>
            <div className="relative">
              <div className="w-3.5 h-3.5 rounded-full bg-neutral-950 z-10 border-2 border-white"></div>
              <div className="absolute inset-0 w-3.5 h-3.5 rounded-full bg-neutral-950 health-pulse"></div>
            </div>
            <div className="mt-1.5">
              <span className="text-[9px] font-semibold text-neutral-950 font-mono">NOW</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
