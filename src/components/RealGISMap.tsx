import React, { useEffect, useRef, useState } from 'react';
import { Zap, CheckCircle2, AlertTriangle, ArrowRight, Play, RefreshCw, Bus, Layers, ShieldCheck, Compass } from 'lucide-react';

declare global {
  interface Window {
    L: any;
  }
}

interface RealGISMapProps {
  selectedStopNo?: number;
  onSelectStop?: (stopNo: number) => void;
  height?: string;
  isDispatching?: boolean;
  onDispatchTriggered?: () => void;
  activeMode?: 'normal' | 'depot_dispatch' | 'layered_allocation';
  onModeChange?: (mode: 'normal' | 'depot_dispatch' | 'layered_allocation') => void;
  dispatchTriggerCount?: number;
}

export const RealGISMap: React.FC<RealGISMapProps> = ({
  selectedStopNo = 6,
  onSelectStop,
  height = '520px',
  isDispatching = false,
  onDispatchTriggered,
  activeMode = 'normal',
  onModeChange,
  dispatchTriggerCount = 0
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);

  // Bus Markers
  const dispatchedMockBusMarkerRef = useRef<any>(null);
  const evBusMarkerRef = useRef<any>(null);
  const layer2BusMarkerRef = useRef<any>(null);
  const dispatchPathRef = useRef<any>(null);
  const layeredPath1Ref = useRef<any>(null);
  const layeredPath2Ref = useRef<any>(null);
  const layeredPath3Ref = useRef<any>(null);

  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [dispatchState, setDispatchState] = useState<'idle' | 'simulating' | 'completed'>('idle');
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [activeQueue, setActiveQueue] = useState<number>(210);
  const [busProgress, setBusProgress] = useState<number>(0);
  const [dispatchedBusName, setDispatchedBusName] = useState<string>('⚡ EV-SP42 (DISPATCHED)');

  // Bengaluru Route 365J / 378 Real GPS Coordinates
  const routeCoordinates: [number, number][] = [
    [12.9767, 77.5713], // 1. Majestic Hub
    [12.9631, 77.5762], // 2. K.R. Market
    [12.9560, 77.5935], // 3. Shanthinagar Depot & Holding Bay
    [12.9377, 77.6001], // 4. Gurappanapalya
    [12.9352, 77.6146], // 5. Forum Koramangala
    [12.9172, 77.6228], // 6. Silk Board Junction (Surge Node)
    [12.9030, 77.6265], // 7. Bommanahalli
    [12.8452, 77.6602]  // 8. Electronic City Phase 1
  ];

  // Dispatch Waypoints from Shanthinagar Depot [12.9560, 77.5935] -> Silk Board [12.9172, 77.6228]
  const depotToSurgeWaypoints: [number, number][] = [
    [12.9560, 77.5935], // Shanthinagar Holding Bay Depot
    [12.9470, 77.5960], // Nimhans Flyover
    [12.9377, 77.6001], // Gurappanapalya
    [12.9352, 77.6146], // Forum Koramangala
    [12.9240, 77.6180], // Madiwala Underpass
    [12.9172, 77.6228]  // Silk Board Junction Target
  ];

  // Layer 2 Waypoints (Koramangala Short-Turn to Silk Board)
  const koramangalaToSurgeWaypoints: [number, number][] = [
    [12.9352, 77.6146], // Forum Koramangala
    [12.9260, 77.6190], // Madiwala Market
    [12.9172, 77.6228]  // Silk Board Junction
  ];

  // Layer 3 Waypoints (Express Flyover Deadhead from Majestic)
  const expressFlyoverWaypoints: [number, number][] = [
    [12.9767, 77.5713], // Majestic Hub
    [12.9560, 77.5935], // Shanthinagar
    [12.9172, 77.6228]  // Silk Board
  ];

  const stops = [
    { no: 1, name: 'Kempegowda Bus Station (Majestic)', coords: [12.9767, 77.5713], waiting: 160 },
    { no: 2, name: 'K.R. Circle / Market', coords: [12.9631, 77.5762], waiting: 120 },
    { no: 3, name: 'Shanthinagar Holding Bay', coords: [12.9560, 77.5935], waiting: 320, isHolding: true },
    { no: 4, name: 'Gurappanapalya', coords: [12.9377, 77.6001], waiting: 180 },
    { no: 5, name: 'Forum Koramangala', coords: [12.9352, 77.6146], waiting: 190 },
    { no: 6, name: 'Silk Board Junction (Surge Node)', coords: [12.9172, 77.6228], waiting: activeQueue, isCritical: activeQueue > 80 },
    { no: 7, name: 'Bommanahalli', coords: [12.9030, 77.6265], waiting: 140 },
    { no: 8, name: 'Electronic City Phase 1', coords: [12.8452, 77.6602], waiting: 90 }
  ];

  // Initialize Map & Stationary Corridor Buses
  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    if (!leafletMap.current) {
      const L = window.L;
      const map = L.map(mapRef.current, {
        center: [12.9350, 77.6100],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // Carto Voyager Light Tiles (BMTC Style Light Theme)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      // Route Path Polyline
      L.polyline(routeCoordinates, {
        color: '#94A3B8',
        weight: 5,
        opacity: 0.8,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(map);

      // Add Minimal Bus Stop Dots (○)
      stops.forEach(stop => {
        const isSelected = stop.no === selectedStopNo;
        const borderColor = stop.isCritical ? '#DC2626' : isSelected ? '#2563EB' : '#475569';
        
        const dotMarkerHtml = `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            ${stop.isCritical ? '<div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background: rgba(220, 38, 38, 0.35); animation: ping 1.5s infinite;"></div>' : ''}
            <div style="width: 14px; height: 14px; border-radius: 50%; background: #FFFFFF; border: 3px solid ${borderColor}; box-shadow: 0 1px 4px rgba(0,0,0,0.3);"></div>
          </div>
        `;

        const dotIcon = L.divIcon({
          html: dotMarkerHtml,
          className: '',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker(stop.coords, { icon: dotIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: monospace; font-size: 11px; padding: 6px; color: #0F172A; min-width: 190px;">
            <strong style="color: #0F172A; font-size: 12px;">🚏 ${stop.name}</strong><br/>
            <div style="background: #F8FAFC; padding: 6px; border-radius: 6px; border: 1px solid #E2E8F0; margin: 4px 0;">
              <span>Queue: <strong style="font-size: 16px; color: ${stop.isCritical ? '#DC2626' : '#0F172A'};">${stop.waiting} Passengers</strong></span>
            </div>
            <span>Status: <strong style="color: ${stop.isCritical ? '#DC2626' : '#059669'};">${stop.isCritical ? '⚠️ CRITICAL SURGE' : '✅ NORMAL'}</strong></span>
          </div>
        `);

        marker.on('click', () => {
          if (onSelectStop) onSelectStop(stop.no);
        });
      });

      // RENDER 6 BUSES STATIONED ALONG THE ROUTE CORRIDOR
      const corridorBuses = [
        { id: '🚍 365J-01', coords: [12.9767, 77.5713], type: 'diesel', label: 'Majestic Stationed' },
        { id: '🚍 365J-02', coords: [12.9560, 77.5935], type: 'diesel', label: 'Shanthinagar Bay' },
        { id: '🚍 365J-03', coords: [12.9377, 77.6001], type: 'diesel', label: 'Gurappanapalya En Route' },
        { id: '🚍 365J-04', coords: [12.9352, 77.6146], type: 'diesel', label: 'Koramangala Short-Turn' },
        { id: '⚡ EV-SP88', coords: [12.8452, 77.6602], type: 'ev', label: 'Electronic City EV Reserve' }
      ];

      corridorBuses.forEach(b => {
        const pinHtml = `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="background: ${b.type === 'ev' ? '#059669' : '#B81D5B'}; color: #FFFFFF; width: 30px; height: 30px; border-radius: 50%; border: 2px solid #FFFFFF; box-shadow: 0 3px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; font-size: 14px;">${b.type === 'ev' ? '⚡' : '🚍'}</div>
            <div style="width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid ${b.type === 'ev' ? '#059669' : '#B81D5B'}; margin-top: -1px;"></div>
            <div style="background: #0F172A; color: ${b.type === 'ev' ? '#10B981' : '#F59E0B'}; font-family: monospace; font-weight: 900; font-size: 8px; padding: 2px 5px; border-radius: 4px; border: 1px solid #334155; margin-top: 1px; white-space: nowrap;">${b.id}</div>
          </div>
        `;

        const pinIcon = L.divIcon({ html: pinHtml, className: '', iconSize: [60, 50], iconAnchor: [30, 18] });
        const m = L.marker(b.coords, { icon: pinIcon }).addTo(map);
        m.bindPopup(`
          <div style="font-family: monospace; font-size: 11px; color: #0F172A; padding: 4px;">
            <strong>${b.id}</strong><br/>
            <span>Status: <strong>${b.label}</strong></span>
          </div>
        `);

        if (b.id.includes('365J-04')) {
          layer2BusMarkerRef.current = m;
        }
      });

      // Primary Standby EV Bus 365J-SP42 at Shanthinagar Depot
      const evBusPinHtml = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
          <div style="position: absolute; width: 38px; height: 38px; border-radius: 50%; background: rgba(16, 185, 129, 0.35); animation: ping 1.5s infinite;"></div>
          <div style="background: #059669; color: #FFFFFF; width: 34px; height: 34px; border-radius: 50%; border: 2px solid #FFFFFF; box-shadow: 0 3px 12px rgba(16, 185, 129, 0.6); display: flex; align-items: center; justify-content: center; font-size: 16px;">⚡</div>
          <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid #059669; margin-top: -1px;"></div>
          <div style="background: #0F172A; color: #10B981; font-family: monospace; font-weight: 900; font-size: 9px; padding: 2px 6px; border-radius: 4px; border: 1px solid #10B981; margin-top: 2px; white-space: nowrap;">⚡ EV-SP42 (HOLDING BAY)</div>
        </div>
      `;

      const evBusIcon = L.divIcon({ html: evBusPinHtml, className: '', iconSize: [75, 55], iconAnchor: [37, 20] });
      evBusMarkerRef.current = L.marker(depotToSurgeWaypoints[0], { icon: evBusIcon }).addTo(map);

      leafletMap.current = map;
    }
  }, []);

  // Listen to activeMode changes from dashboard buttons
  useEffect(() => {
    if (activeMode === 'depot_dispatch') {
      handleStartSimulatedDispatch();
    } else if (activeMode === 'layered_allocation') {
      handleStartLayeredAllocationSim();
    }
  }, [activeMode]);

  // Listen to global dispatch triggers from anywhere in the system
  useEffect(() => {
    if (dispatchTriggerCount && dispatchTriggerCount > 0) {
      handleStartSimulatedDispatch();
    }
  }, [dispatchTriggerCount]);

  // Trigger Live Simulation 1: Direct Depot Dispatch (Spawn New Bus from Depot)
  const handleStartSimulatedDispatch = () => {
    if (dispatchState === 'simulating') return;

    if (onModeChange) onModeChange('depot_dispatch');
    setDispatchState('simulating');
    setCurrentStage(1);
    setActiveQueue(210);
    setBusProgress(0);

    const L = window.L;
    const busId = `⚡ MOCK EV-DISPATCHED #${Math.floor(Math.random() * 90 + 10)}`;
    setDispatchedBusName(busId);

    // Remove old layers
    if (leafletMap.current) {
      if (dispatchPathRef.current) leafletMap.current.removeLayer(dispatchPathRef.current);
      if (layeredPath1Ref.current) leafletMap.current.removeLayer(layeredPath1Ref.current);
      if (layeredPath2Ref.current) leafletMap.current.removeLayer(layeredPath2Ref.current);
      if (layeredPath3Ref.current) leafletMap.current.removeLayer(layeredPath3Ref.current);

      dispatchPathRef.current = L.polyline(depotToSurgeWaypoints, {
        color: '#10B981',
        weight: 7,
        opacity: 0.95,
        lineCap: 'round'
      }).addTo(leafletMap.current);

      // Spawn or update Dispatched Mock Bus Marker
      const mockBusPinHtml = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
          <div style="position: absolute; width: 42px; height: 42px; border-radius: 50%; background: rgba(16, 185, 129, 0.4); animation: ping 1.2s infinite;"></div>
          <div style="background: #10B981; color: #000000; font-weight: 900; width: 36px; height: 36px; border-radius: 50%; border: 2.5px solid #FFFFFF; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.8); display: flex; align-items: center; justify-content: center; font-size: 18px;">⚡</div>
          <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 7px solid #10B981; margin-top: -1px;"></div>
          <div style="background: #0F172A; color: #10B981; font-family: monospace; font-weight: 900; font-size: 9px; padding: 3px 8px; border-radius: 6px; border: 1.5px solid #10B981; margin-top: 2px; white-space: nowrap; shadow: 0 0 10px #10B981;">${busId}</div>
        </div>
      `;

      const mockBusIcon = L.divIcon({ html: mockBusPinHtml, className: '', iconSize: [85, 60], iconAnchor: [42, 22] });

      if (dispatchedMockBusMarkerRef.current) {
        leafletMap.current.removeLayer(dispatchedMockBusMarkerRef.current);
      }

      dispatchedMockBusMarkerRef.current = L.marker(depotToSurgeWaypoints[0], { icon: mockBusIcon }).addTo(leafletMap.current);
    }

    let stepIndex = 0;
    const interval = setInterval(() => {
      stepIndex++;
      const progress = Math.min(100, Math.round((stepIndex / (depotToSurgeWaypoints.length - 1)) * 100));
      setBusProgress(progress);

      if (stepIndex < depotToSurgeWaypoints.length) {
        const nextCoord = depotToSurgeWaypoints[stepIndex];
        if (dispatchedMockBusMarkerRef.current) {
          dispatchedMockBusMarkerRef.current.setLatLng(nextCoord);
        }

        if (stepIndex === 1) setCurrentStage(2);
        if (stepIndex === 2) setCurrentStage(3);
        if (stepIndex === 3) setCurrentStage(4);
        if (stepIndex === 4) setCurrentStage(5);
      } else {
        clearInterval(interval);
        setDispatchState('completed');
        setActiveQueue(30); // Queue cleared!

        if (onDispatchTriggered) onDispatchTriggered();
      }
    }, 1000);
  };

  // Trigger Live Simulation 2: Dynamic Layered Allocation for Faraway Stops
  const handleStartLayeredAllocationSim = () => {
    if (onModeChange) onModeChange('layered_allocation');
    setDispatchState('simulating');
    setCurrentStage(1);
    setActiveQueue(210);
    setBusProgress(0);

    const L = window.L;

    if (leafletMap.current) {
      if (dispatchPathRef.current) leafletMap.current.removeLayer(dispatchPathRef.current);
      if (layeredPath1Ref.current) leafletMap.current.removeLayer(layeredPath1Ref.current);
      if (layeredPath2Ref.current) leafletMap.current.removeLayer(layeredPath2Ref.current);
      if (layeredPath3Ref.current) leafletMap.current.removeLayer(layeredPath3Ref.current);

      // Render 3 Layer Polylines on Map
      // Layer 1: Green Shanthinagar Depot -> Silk Board (5 min ETA)
      layeredPath1Ref.current = L.polyline(depotToSurgeWaypoints, {
        color: '#10B981',
        weight: 6,
        opacity: 0.95,
        lineCap: 'round'
      }).addTo(leafletMap.current);

      // Layer 2: Orange Koramangala Short-Turn -> Silk Board (10 min ETA)
      layeredPath2Ref.current = L.polyline(koramangalaToSurgeWaypoints, {
        color: '#F59E0B',
        weight: 5,
        opacity: 0.9,
        dashArray: '6, 6',
        lineCap: 'round'
      }).addTo(leafletMap.current);

      // Layer 3: Blue Express Flyover from Majestic -> Silk Board (15 min ETA)
      layeredPath3Ref.current = L.polyline(expressFlyoverWaypoints, {
        color: '#3B82F6',
        weight: 4,
        opacity: 0.75,
        dashArray: '10, 5',
        lineCap: 'round'
      }).addTo(leafletMap.current);
    }

    // Animate Layer 1 & Layer 2 Buses Moving Simultaneously
    let stepIndex = 0;
    const interval = setInterval(() => {
      stepIndex++;
      const progress = Math.min(100, Math.round((stepIndex / (depotToSurgeWaypoints.length - 1)) * 100));
      setBusProgress(progress);

      if (stepIndex < depotToSurgeWaypoints.length) {
        const nextCoordL1 = depotToSurgeWaypoints[stepIndex];
        if (evBusMarkerRef.current) evBusMarkerRef.current.setLatLng(nextCoordL1);

        if (stepIndex < koramangalaToSurgeWaypoints.length && layer2BusMarkerRef.current) {
          layer2BusMarkerRef.current.setLatLng(koramangalaToSurgeWaypoints[stepIndex]);
        }

        if (stepIndex === 1) setCurrentStage(2);
        if (stepIndex === 2) setCurrentStage(3);
        if (stepIndex === 3) setCurrentStage(4);
        if (stepIndex === 4) setCurrentStage(5);
      } else {
        clearInterval(interval);
        setDispatchState('completed');
        setActiveQueue(25); // 100% Queue Cleared!
      }
    }, 1000);
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-[#1E293B] shadow-2xl bg-white font-sans select-none z-0 isolate">
      {/* FLOATING ROUTE DETAILS HEADER */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-[96%] max-w-xl bg-[#B81D5B] text-white rounded-2xl border border-white/20 shadow-2xl p-3 space-y-2 select-none">
        <div className="flex justify-between items-center border-b border-white/20 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-white font-extrabold text-sm tracking-wide">Route Details</span>
            <span className="bg-[#10B981] text-white font-mono font-black text-xs px-2.5 py-0.5 rounded-full shadow-sm">
              ROUTE 365J
            </span>
          </div>

          {/* ACTION BUTTONS: DISPATCH WITH REASON + LAYERED ALLOCATION */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleStartSimulatedDispatch}
              disabled={dispatchState === 'simulating'}
              className="bg-[#FFC107] hover:bg-yellow-300 text-black font-mono font-black text-[11px] px-3 py-1.5 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer uppercase"
              title="Dispatch New Spare EV Bus from Depot with Reason & Attribution"
            >
              <Play className="h-3.5 w-3.5 fill-black" />
              1. EXECUTE DEPOT DISPATCH
            </button>

            <button
              onClick={handleStartLayeredAllocationSim}
              disabled={dispatchState === 'simulating'}
              className="bg-[#00F0FF] hover:bg-cyan-300 text-black font-mono font-black text-[11px] px-3 py-1.5 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer uppercase"
              title="Dynamic Layered Interlining Allocation for Faraway Bus Stops"
            >
              <Layers className="h-3.5 w-3.5" />
              2. LAYERED ALLOCATION
            </button>
          </div>
        </div>

        {/* ORIGIN & DESTINATION STRIP */}
        <div className="bg-white text-neutral-900 rounded-xl p-2 flex items-center justify-between text-xs font-bold shadow-inner">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#10B981] flex items-center justify-center text-[9px] text-white font-bold">✓</span>
            <span>Majestic Bus Station</span>
          </div>
          <span className="text-[#B81D5B] font-bold">➔</span>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#10B981] flex items-center justify-center text-[9px] text-white font-bold">✓</span>
            <span>Electronic City Phase 1</span>
          </div>
        </div>
      </div>

      {/* ARCHITECTURE PIPELINE OVERLAY HUD PANEL */}
      {dispatchState === 'simulating' && (
        <div className="absolute top-28 left-4 z-30 bg-[#0B0F17]/95 border border-cyan-500/50 text-white p-3 rounded-2xl w-88 font-mono text-[10px] space-y-2 shadow-2xl backdrop-blur-md animate-fadeIn">
          <div className="flex justify-between items-center border-b border-cyan-500/30 pb-1.5">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5 uppercase">
              <Zap className="h-3.5 w-3.5 text-cyan-400 animate-bounce" /> 10-STAGE AI DECISION PIPELINE
            </span>
            <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded border border-emerald-500/40 font-bold">
              STAGE {currentStage}/5
            </span>
          </div>

          <div className="space-y-1">
            <div className={`p-1.5 rounded flex items-center justify-between ${currentStage >= 1 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-neutral-500'}`}>
              <span>1. Ingestion: CCTV (185 pax) + HERE Traffic</span>
              {currentStage >= 1 && <CheckCircle2 className="h-3 w-3 text-cyan-400" />}
            </div>
            <div className={`p-1.5 rounded flex items-center justify-between ${currentStage >= 2 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-neutral-500'}`}>
              <span>2. LightGBM Forecast ➔ P90: 262 pax</span>
              {currentStage >= 2 && <CheckCircle2 className="h-3 w-3 text-cyan-400" />}
            </div>
            <div className={`p-1.5 rounded flex items-center justify-between ${currentStage >= 3 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-neutral-500'}`}>
              <span>3. MILP Solver ➔ {dispatchedBusName} Selected</span>
              {currentStage >= 3 && <CheckCircle2 className="h-3 w-3 text-cyan-400" />}
            </div>
            <div className={`p-1.5 rounded flex items-center justify-between ${currentStage >= 4 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-neutral-500'}`}>
              <span>4. 5-Domain Policy Audit: PASSED (100%)</span>
              {currentStage >= 4 && <CheckCircle2 className="h-3 w-3 text-cyan-400" />}
            </div>
            <div className={`p-1.5 rounded flex items-center justify-between ${currentStage >= 5 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold' : 'text-neutral-500'}`}>
              <span>5. Depot Dispatch Active (Shanthinagar ➔ Silk Board)</span>
              {currentStage >= 5 && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
            </div>
          </div>

          <div className="pt-1 border-t border-neutral-800 flex justify-between text-neutral-300 text-[9px]">
            <span>NEW MOCK BUS EN ROUTE:</span>
            <strong className="text-emerald-400">{busProgress}% ({dispatchedBusName})</strong>
          </div>
        </div>
      )}

      {/* DYNAMIC LAYERED ALLOCATION HUD OVERLAY */}
      {activeMode === 'layered_allocation' && (
        <div className="absolute bottom-16 right-4 z-30 bg-[#0F172A]/95 border border-cyan-500/50 text-white p-3 rounded-2xl w-88 font-mono text-[10px] space-y-2 shadow-2xl backdrop-blur-md">
          <span className="text-cyan-400 font-bold uppercase block border-b border-cyan-500/30 pb-1">
            ⚡ DYNAMIC LAYERED ALLOCATION (FARAWAY STOPS)
          </span>
          <div className="space-y-1 text-[9px]">
            <div className="p-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded">
              <strong>Layer 1 (Immediate - 5 min ETA):</strong> Spare EV-SP42 from Shanthinagar Holding Bay Depot.
            </div>
            <div className="p-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded">
              <strong>Layer 2 (Interlining - 10 min ETA):</strong> Short-turn underutilized Bus 365J-04 at Koramangala.
            </div>
            <div className="p-1.5 bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded">
              <strong>Layer 3 (Express Deadhead - 15 min ETA):</strong> Express flyover dispatch from Majestic Hub.
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS BANNER WHEN DISPATCH COMPLETES */}
      {dispatchState === 'completed' && (
        <div className="absolute top-28 left-4 z-30 bg-emerald-950/95 border border-emerald-500 text-white p-3 rounded-2xl w-88 font-mono text-xs space-y-1.5 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-emerald-400 font-extrabold">
            <CheckCircle2 className="h-4 w-4" /> DISPATCH EXECUTED SUCCESSFULLY!
          </div>
          <p className="text-[10px] text-emerald-200">
            Newly dispatched bus <strong>{dispatchedBusName}</strong> arrived at Silk Board Junction. Queue reduced from 210 to 30 passengers!
          </p>
          <div className="bg-emerald-900/60 p-1.5 rounded text-[10px] flex justify-between font-bold text-white border border-emerald-500/30">
            <span>NET ROI SAVED:</span>
            <strong className="text-amber-300">₹2,315 Saved (0L Fuel)</strong>
          </div>
        </div>
      )}

      {/* MAP CANVAS CONTAINER */}
      <div ref={mapRef} style={{ width: '100%', height }} />

      {/* BOTTOM LEGEND */}
      <div className="absolute bottom-3 left-3 z-20 bg-white/90 border border-neutral-200 p-2 rounded-xl text-[10px] font-mono flex items-center gap-4 text-neutral-800 shadow-md backdrop-blur-md">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full border-2 border-slate-700 bg-white inline-block"></span> Bus Stop Dot (○)</span>
        <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-full bg-[#B81D5B] text-white text-[9px] flex items-center justify-center font-bold">🚍</span> 6 Corridor Buses Active</span>
        <span className="flex items-center gap-1.5 text-emerald-600 font-bold"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live Depot Mock Bus Dispatched</span>
      </div>
    </div>
  );
};
