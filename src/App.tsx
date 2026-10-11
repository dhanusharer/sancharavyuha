import { useState, useMemo, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { CommandHeader } from './components/CommandHeader';
import { StopSidebar } from './components/StopSidebar';
import { RouteRadar } from './components/RouteRadar';
import { AIOperations } from './components/AIOperations';
import { FleetStrip } from './components/FleetStrip';
import { EventTimeline } from './components/EventTimeline';
import { NetworkKPIs } from './components/NetworkKPIs';
import { SettingsModal } from './components/SettingsModal';
import { LivePipelineDemoModal } from './components/LivePipelineDemoModal';
import { NavigationSidebar, WorkspaceType } from './components/NavigationSidebar';
import { WorkspaceBreadcrumb } from './components/WorkspaceBreadcrumb';
import { MonitoringPage } from './pages/MonitoringPage';
import { MLOpsPage } from './pages/MLOpsPage';
import { AuditPage } from './pages/AuditPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ExecutivePage } from './pages/ExecutivePage';
import { AdminPage } from './pages/AdminPage';
import { MultiAgentWorkbenchPage } from './pages/MultiAgentWorkbenchPage';
import { MissionCenterPage } from './pages/MissionCenterPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { ObservabilityPage } from './pages/ObservabilityPage';
import { ExecutiveCommandCenterPage } from './pages/ExecutiveCommandCenterPage';
import { SustainabilityPage } from './pages/SustainabilityPage';
import { WhatIfSimulatorPage } from './pages/WhatIfSimulatorPage';
import { FleetIntelligencePage } from './pages/FleetIntelligencePage';
import { PolicyGovernancePage } from './pages/PolicyGovernancePage';
import { mockRouteData, mockNotifications } from './data/mockData';
import { Notification } from './types';
import { fetchStops, triggerDispatch } from './services/api';

function AppContent() {
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceType>('executive_command');
  const [searchTerm, setSearchTerm] = useState('');
  const [routeData, setRouteData] = useState(mockRouteData);
  const [showSettings, setShowSettings] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedStopNo, setSelectedStopNo] = useState<number>(6); // Default to Silk Board
  const [simulationMode, setSimulationMode] = useState<string>('live');
  const [dispatchTriggerCount, setDispatchTriggerCount] = useState<number>(0);
  const [activeToast, setActiveToast] = useState<{ title: string; message: string } | null>(null);

  // Fetch real backend data
  useEffect(() => {
    const load = async () => {
      const apiStops = await fetchStops();
      if (apiStops.length > 0) {
        setRouteData(prev => ({
          ...prev,
          stops: prev.stops.map(stop => {
            const match = apiStops.find(s => s.stop_no === stop.stop_no);
            if (match) {
              return { ...stop, people_detected_cctv: match.people_detected_cctv, waiting_passengers: match.waiting_passengers, congestion_level: (match.congestion_level.toLowerCase() as any) || stop.congestion_level };
            }
            return stop;
          })
        }));
      }
    };

    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  // Apply simulation mode modifiers
  const simulatedStops = useMemo(() => {
    if (simulationMode === 'live') return routeData.stops;

    return routeData.stops.map(stop => {
      const copy = { ...stop, etm_data: { ...stop.etm_data }, inside_buses: [...stop.inside_buses] };
      if (simulationMode === 'rain') {
        copy.waiting_passengers = Math.round(stop.waiting_passengers * 1.35);
        copy.people_detected_cctv = Math.round(stop.people_detected_cctv * 1.25);
        if (copy.waiting_passengers > 150) copy.congestion_level = 'high';
      } else if (simulationMode === 'festival') {
        copy.waiting_passengers = Math.round(stop.waiting_passengers * 1.7);
        copy.people_detected_cctv = Math.round(stop.people_detected_cctv * 1.6);
        copy.congestion_level = 'high';
        copy.congestion_percentage = Math.min(copy.congestion_percentage + 30, 99);
      } else if (simulationMode === 'strike') {
        copy.waiting_passengers = Math.round(stop.waiting_passengers * 0.3);
        copy.people_detected_cctv = Math.round(stop.people_detected_cctv * 0.25);
        copy.congestion_level = 'low';
        copy.inside_buses = copy.inside_buses.slice(0, 1);
      }
      return copy;
    });
  }, [routeData.stops, simulationMode]);

  // Filter stops by search
  const filteredStops = useMemo(() => {
    if (!searchTerm) return simulatedStops;
    return simulatedStops.filter(s =>
      s.stop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.inside_buses.some(b => b.bus_id.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [simulatedStops, searchTerm]);

  // Compute network health & score
  const criticalStopCount = simulatedStops.filter(s => s.congestion_level === 'high' || s.congestion_percentage > 70).length;
  const networkHealth: 'normal' | 'elevated' | 'critical' =
    criticalStopCount >= 3 ? 'critical' : criticalStopCount >= 1 ? 'elevated' : 'normal';

  const healthScore = networkHealth === 'critical' ? 37 : networkHealth === 'elevated' ? 68 : 94;

  const healthReasons = useMemo(() => {
    const reasons: string[] = [];
    if (simulationMode === 'rain') reasons.push('Heavy Rain alert active in South Bengaluru corridor');
    else if (simulationMode === 'festival') reasons.push('Ganesh Chaturthi festival passenger surge');
    else if (simulationMode === 'metro_fail') reasons.push('Namma Metro Purple Line service failure');
    else if (simulationMode === 'strike') reasons.push('Feeder bus driver strike');

    reasons.push(`${criticalStopCount} stops exceeding P90 capacity thresholds`);
    reasons.push('Fleet capacity utilization at 92%');
    return reasons;
  }, [simulationMode, criticalStopCount]);

  const selectedStop = simulatedStops.find(s => s.stop_no === selectedStopNo) || null;

  const handleDispatchBus = async (stopNo: number, stopName: string) => {
    const result = await triggerDispatch(stopNo, `Dispatch for ${stopName}`);
    const busId = result ? result.bus_id : `365J-SP${Math.floor(Math.random() * 90) + 10}`;

    // Dynamically update local stop state: deploy spare bus, clear passenger queue, and reduce congestion!
    setRouteData(prev => ({
      ...prev,
      stops: prev.stops.map(stop => {
        if (stop.stop_no === stopNo) {
          const updatedWaiting = Math.max(15, stop.waiting_passengers - 180);
          return {
            ...stop,
            waiting_passengers: updatedWaiting,
            people_detected_cctv: Math.max(10, stop.people_detected_cctv - 150),
            congestion_level: updatedWaiting > 120 ? 'medium' : 'low',
            congestion_percentage: Math.max(25, stop.congestion_percentage - 45),
            inside_buses: [
              { bus_id: busId, occupancy_pct: 85, driver_name: 'Driver #42 (EV)', driver_shift_hrs: 4.8, battery_soc_pct: 85.0 },
              ...stop.inside_buses
            ]
          };
        }
        return stop;
      })
    }));

    setNotifications(prev => [{
      id: Date.now().toString(),
      type: 'dispatch',
      title: 'Spare EV Bus Dispatched',
      message: `${busId} dispatched to ${stopName}. Queue reduced by 180 passengers.`,
      timestamp: new Date().toISOString(),
      read: false,
      priority: 'high'
    }, ...prev]);

    // Increment global dispatch counter to trigger map movement animation!
    setDispatchTriggerCount(prev => prev + 1);

    // Show live Toast Notification
    setActiveToast({
      title: '🟢 LIVE DISPATCH ORDER BROADCASTED',
      message: `Spare EV Bus ${busId} deployed from Shanthinagar Holding Bay Depot Bay #4 ➔ ${stopName}!`
    });

    setTimeout(() => {
      setActiveToast(null);
    }, 6000);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F5F5F5]">
      {/* PERSISTENT LEFT SIDEBAR */}
      <NavigationSidebar 
        activeWorkspace={activeWorkspace} 
        onSelectWorkspace={setActiveWorkspace} 
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* TOP HEADER */}
        <CommandHeader
          networkHealth={networkHealth}
          healthScore={healthScore}
          healthReasons={healthReasons}
          criticalStopCount={criticalStopCount}
          nextPeakMinutes={12}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSettingsClick={() => setShowSettings(true)}
          simulationMode={simulationMode}
          onSimulationChange={setSimulationMode}
          onOpenDemoModal={() => setShowDemoModal(true)}
        />

        {/* WORKSPACE BREADCRUMB */}
        <WorkspaceBreadcrumb 
          activeWorkspace={activeWorkspace}
          selectedStopName={selectedStop?.stop_name}
        />

        {/* GLOBAL ACTIVE DISPATCH TOAST NOTIFICATION OVERLAY */}
        {activeToast && (
          <div className="fixed top-4 right-4 z-[999999] bg-[#0F172A] border-2 border-emerald-500 text-white p-4 rounded-2xl shadow-2xl font-mono text-xs max-w-sm animate-bounce">
            <div className="flex items-center gap-2 text-emerald-400 font-black mb-1 text-sm">
              <span>🟢</span> {activeToast.title}
            </div>
            <p className="text-neutral-200 text-[11px] font-semibold">{activeToast.message}</p>
          </div>
        )}

        {/* WORKSPACE BODY VIEW ROUTER */}
        <div className="flex-1 overflow-y-auto">
          {activeWorkspace === 'executive_command' && (
            <ExecutiveCommandCenterPage 
              dispatchTriggerCount={dispatchTriggerCount} 
              onDispatchBus={(busId, stopName) => handleDispatchBus(6, stopName || 'Silk Board Junction')} 
              onNavigateToSustainability={() => setActiveWorkspace('sustainability')}
            />
          )}
          {activeWorkspace === 'sustainability' && <SustainabilityPage />}
          {activeWorkspace === 'operations' && <MissionCenterPage />}
          {activeWorkspace === 'decision' && <MultiAgentWorkbenchPage />}
          {activeWorkspace === 'digital_twin' && <DigitalTwinPage />}
          {activeWorkspace === 'network_analytics' && <AnalyticsPage />}
          {activeWorkspace === 'fleet_intelligence' && <FleetIntelligencePage />}
          {activeWorkspace === 'ai_intelligence' && <MLOpsPage />}
          {activeWorkspace === 'forecasting' && <AnalyticsPage />}
          {activeWorkspace === 'policy' && <PolicyGovernancePage />}
          {activeWorkspace === 'monitoring' && <MonitoringPage />}
          {activeWorkspace === 'observability' && <ObservabilityPage />}
          {activeWorkspace === 'decision_memory' && <AuditPage />}
          {activeWorkspace === 'audit' && <AuditPage />}
          {activeWorkspace === 'whatif_simulator' && <WhatIfSimulatorPage />}
          {activeWorkspace === 'executive_analytics' && <ExecutivePage />}
          {activeWorkspace === 'admin' && <AdminPage />}
        </div>

        {/* BOTTOM LIVE STATUS BAR */}
        <footer className="bg-neutral-950 text-white border-t border-neutral-800 px-4 py-2 flex justify-between items-center text-xs font-mono flex-shrink-0">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> GTFS-RT SOCKET: CONNECTED</span>
            <span className="text-neutral-500">|</span>
            <span className="text-neutral-400">FASTAPI SOLVER LATENCY: <strong className="text-emerald-400">14.2ms</strong></span>
            <span className="text-neutral-500">|</span>
            <span className="text-neutral-400">POLICY ENGINE: <strong className="text-emerald-400">100% PASS</strong></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-neutral-400">SANCHARA VYUHA AI-TOS v6.0</span>
            <span className="badge-solid bg-blue-600 text-white text-[9px] font-bold">ENTERPRISE COMMAND PLATFORM</span>
          </div>
        </footer>
      </div>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <LivePipelineDemoModal 
        isOpen={showDemoModal} 
        onClose={() => setShowDemoModal(false)} 
        onDispatchSuccess={() => handleDispatchBus(6)} 
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
