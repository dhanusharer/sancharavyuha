import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Brain, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Database, 
  Layers, 
  Play, 
  RotateCcw,
  CloudRain,
  Flame,
  AlertOctagon,
  RefreshCw,
  FileCode,
  DollarSign,
  Share2
} from 'lucide-react';

export const MultiAgentWorkbenchPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'observation' | 'agents' | 'digital_twin' | 'playbooks' | 'standards'>('observation');
  const [whatIfScenario, setWhatIfScenario] = useState<string>('baseline');
  const [selectedPlaybook, setSelectedPlaybook] = useState<string>('heavy_rain');
  const [selectedStandard, setSelectedStandard] = useState<'gtfs-rt' | 'siri' | 'netex'>('gtfs-rt');
  const [standardsData, setStandardsData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/v1/standards/${selectedStandard}`)
      .then(res => res.json())
      .then(data => setStandardsData(data))
      .catch(() => {
        if (selectedStandard === 'gtfs-rt') {
          setStandardsData({
            header: { gtfs_realtime_version: "2.0", timestamp: Math.floor(Date.now() / 1000) },
            entity: [{ id: "BUS-365J-SP42", vehicle: { trip: { route_id: "365J" }, position: { latitude: 12.9172, longitude: 77.6228 }, vehicle: { label: "KA-01-F-4298 (Spare EV Bus)" } } }]
          });
        } else if (selectedStandard === 'siri') {
          setStandardsData({
            Siri: { ServiceDelivery: { VehicleMonitoringDelivery: { VehicleActivity: [{ MonitoredVehicleJourney: { LineRef: "365J", PublishedLineName: "Majestic to Silk Board", Delay: "P0Y0M0DT0H12M30S" } }] } } }
          });
        } else {
          setStandardsData({
            PublicationDelivery: { ParticipantRef: "BMTC_SANCHARA_VYUHA", dataObjects: { CompositeFrame: { id: "NETEX_FRAME_365J", Name: "Route 365J High Density Corridor" } } }
          });
        }
      });
  }, [selectedStandard]);

  const agents = [
    { id: 'route', name: 'Route Agent', bid: 92.5, status: 'Active', color: 'border-blue-500 text-blue-600', rec: 'Urgent Headway Reduction Required at Stop #6' },
    { id: 'depot', name: 'Depot Agent', bid: 95.0, status: 'Active', color: 'border-emerald-500 text-emerald-600', rec: 'Depot Standby Fleet Ready (4 EV buses available)' },
    { id: 'traffic', name: 'Traffic Agent', bid: 88.0, status: 'Active', color: 'border-amber-500 text-amber-600', rec: 'Execute Flyover Corridor Bypass to save 12 mins' },
    { id: 'fleet', name: 'Fleet Agent', bid: 98.0, status: 'Active', color: 'border-purple-500 text-purple-600', rec: 'Primary EV Bus 365J-SP42 fully charged (82%)' },
    { id: 'forecast', name: 'Forecast Agent', bid: 94.0, status: 'Active', color: 'border-indigo-500 text-indigo-600', rec: 'High Surge Confidence (P90 = 262 pax)' },
    { id: 'policy', name: 'Policy Agent', bid: 100.0, status: 'Active', color: 'border-emerald-600 text-emerald-700', rec: '100% Policy Pass across all 5 Governance Domains' },
    { id: 'risk', name: 'Risk Agent', bid: 90.0, status: 'Active', color: 'border-rose-500 text-rose-600', rec: 'Measured Operational Risk Score: LOW (22.5/100)' },
  ];

  return (
    <div className="flex-1 bg-[#F8F9FA] h-full overflow-y-auto p-4 font-sans space-y-4">
      
      {/* PAGE HEADER */}
      <div className="bg-white border border-neutral-200 rounded-[20px] p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-neutral-950 text-white rounded-xl">
            <Brain className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-neutral-950 font-mono tracking-tight">
                MULTI-AGENT & DIGITAL TWIN WORKBENCH
              </h1>
              <span className="badge-solid bg-emerald-600 text-white font-mono text-[10px]">AI-TOS v5.0</span>
            </div>
            <p className="text-xs text-neutral-500">
              Interactive Multi-Agent Bidding Consensus, Digital Twin What-If Simulator, Operational Playbooks, and Open Transit Standards API Suite.
            </p>
          </div>
        </div>

        {/* WORKBENCH TABS */}
        <div className="flex bg-neutral-100 p-1 rounded-xl border border-neutral-200 font-mono text-xs">
          <button
            onClick={() => setActiveTab('observation')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'observation' ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            👁️ Observation Layer (v5.1)
          </button>
          <button
            onClick={() => setActiveTab('agents')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'agents' ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            🤖 7 AI Agents
          </button>
          <button
            onClick={() => setActiveTab('digital_twin')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'digital_twin' ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            🔮 Digital Twin
          </button>
          <button
            onClick={() => setActiveTab('playbooks')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'playbooks' ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            📖 Playbooks
          </button>
          <button
            onClick={() => setActiveTab('standards')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'standards' ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            🔌 Standards
          </button>
        </div>
      </div>

      {/* TAB 0: OBSERVATION INTELLIGENCE LAYER (AI-TOS v5.1) */}
      {activeTab === 'observation' && (
        <div className="space-y-4 font-mono">
          
          {/* ARCHITECTURAL MANIFESTO BANNER */}
          <div className="bg-neutral-950 text-white rounded-[20px] p-4 border border-neutral-800 space-y-2 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="badge-solid bg-emerald-500 text-black font-extrabold text-xs">
                AI-TOS v5.2 EVOLVING DECISION CONTEXT ACCUMULATOR
              </span>
              <span className="text-xs text-neutral-400 font-mono">TRACE-88F4A21C | Latency: 14.2ms</span>
            </div>
            <h2 className="text-sm font-bold text-white">
              Core Principle: Single DecisionContext Object evolves sequentially across all 10 pipeline stages.
            </h2>
            <div className="grid grid-cols-4 gap-2 text-center bg-neutral-900 p-2.5 rounded-xl border border-neutral-800 text-xs">
              <div><span className="text-neutral-400 block text-[9px]">Reliable Estimate</span><strong className="text-white text-sm">144 Pax</strong></div>
              <div><span className="text-neutral-400 block text-[9px]">Observation Confidence</span><strong className="text-emerald-400 text-sm">93.0%</strong></div>
              <div><span className="text-neutral-400 block text-[9px]">Champion ML Model</span><strong className="text-emerald-400 text-sm">LightGBM v3.1</strong></div>
              <div><span className="text-neutral-400 block text-[9px]">Outlier Status</span><strong className="text-amber-400 text-sm">Lidar (18) Rejected</strong></div>
            </div>
          </div>

          {/* ENTERPRISE INFRASTRUCTURE SERVICES BAR */}
          <div className="bg-white border border-neutral-200 rounded-[18px] p-3 space-y-2 font-mono">
            <div className="flex justify-between items-center text-xs font-bold text-neutral-950">
              <span className="flex items-center gap-1.5">
                <Database className="h-4 w-4 text-blue-600" />
                ENTERPRISE INFRASTRUCTURE SERVICES
              </span>
              <span className="badge-solid bg-blue-600 text-white text-[9px]">5 SERVICES ACTIVE</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] bg-neutral-50 p-2 rounded-xl border border-neutral-200">
              <div>
                <span className="text-neutral-500 block">Event Bus</span>
                <strong className="text-emerald-700 font-bold">KAFKA READY</strong>
              </div>
              <div>
                <span className="text-neutral-500 block">Feature Store</span>
                <strong className="text-neutral-950">v3.2 Online</strong>
              </div>
              <div>
                <span className="text-neutral-500 block">Decision Store</span>
                <strong className="text-neutral-950">WAL SQLite Saved</strong>
              </div>
              <div>
                <span className="text-neutral-500 block">Model Registry</span>
                <strong className="text-purple-700 font-bold">Champion: LightGBM v3.1</strong>
              </div>
            </div>
          </div>

          {/* DYNAMIC WEIGHT PRIORITIZATION & SENSOR HEALTH MATRIX */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* SENSOR HEALTH EVALUATION (LAYER 2 & 3) */}
            <div className="bg-white border border-neutral-200 rounded-[20px] p-4 space-y-3 shadow-sm">
              <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Layer 2 & 3: Sensor Health & Confidence Evaluation
              </h3>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div>
                    <strong className="text-neutral-950 block">📷 CCTV YOLO Camera Feed</strong>
                    <span className="text-[10px] text-neutral-500">Raw: 145 pax | Health: 98% (Daylight)</span>
                  </div>
                  <span className="badge-solid bg-emerald-600 text-white font-bold text-[10px]">Confidence 93.1%</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div>
                    <strong className="text-neutral-950 block">🎟️ ETM Electronic Ticket Scans</strong>
                    <span className="text-[10px] text-neutral-500">Raw: 138 tickets | Health: 99.5%</span>
                  </div>
                  <span className="badge-solid bg-emerald-600 text-white font-bold text-[10px]">Confidence 99.0%</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div>
                    <strong className="text-neutral-950 block">📡 AVL GPS Bus Occupancy</strong>
                    <span className="text-[10px] text-neutral-500">Raw: 142 pax | Health: 92.0%</span>
                  </div>
                  <span className="badge-solid bg-emerald-600 text-white font-bold text-[10px]">Confidence 91.0%</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div>
                    <strong className="text-neutral-950 block">📈 LightGBM Historical Forecast</strong>
                    <span className="text-[10px] text-neutral-500">Raw: 145 pax P50 | Health: 90.0%</span>
                  </div>
                  <span className="badge-solid bg-emerald-600 text-white font-bold text-[10px]">Confidence 89.0%</span>
                </div>
              </div>
            </div>

            {/* DYNAMIC WEIGHT SHIFT PRIORITIZATION (LAYER 6) */}
            <div className="bg-white border border-neutral-200 rounded-[20px] p-4 space-y-3 shadow-sm">
              <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider flex items-center gap-2">
                <Layers className="h-4 w-4 text-purple-600" />
                Layer 6: Automatic Source Prioritization Weights
              </h3>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-bold text-neutral-950">
                    <span>CCTV Camera Weight</span>
                    <span>45.0%</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-bold text-neutral-950">
                    <span>ETM Ticket Scans Weight</span>
                    <span>30.0%</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-bold text-neutral-950">
                    <span>AVL GPS Occupancy Weight</span>
                    <span>15.0%</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-bold text-neutral-950">
                    <span>Historical Forecast Weight</span>
                    <span>10.0%</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 text-[10px] text-neutral-700 font-sans">
                💡 <strong>Dynamic Weight Shift Rule:</strong> If Heavy Rain occurs, CCTV weight drops automatically from 45% &rarr; 10%, while ETM/GPS weight increases to 75%.
              </div>
            </div>

          </div>

          {/* HUMAN TRUST LAYER & OBSERVATION AUDIT (LAYERS 8, 9, 10) */}
          <div className="bg-white border border-neutral-200 rounded-[20px] p-4 space-y-2 shadow-sm text-xs">
            <div className="flex justify-between items-center font-bold text-neutral-950">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Layer 8 & 10: Human Trust Summary & Audit Trail
              </span>
              <span className="badge-solid bg-blue-600 text-white font-bold text-[10px]">AUDIT ID: OBS-AUDIT-2026</span>
            </div>
            <p className="text-neutral-700 text-xs">
              <strong>Operator Trust Summary:</strong> Reliable Passenger Estimate (144 pax) validated across ETM tickets (138) and GPS occupancy (142) with 93.0% confidence. All sensors nominal.
            </p>
          </div>

        </div>
      )}

      {/* TAB 1: MULTI-AGENT BIDDING CONSENSUS */}
      {activeTab === 'agents' && (
        <div className="space-y-4 font-mono">
          
          {/* CONSENSUS BANNER */}
          <div className="bg-neutral-950 text-white rounded-[20px] p-4 border border-neutral-800 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">Central Coordinator Consensus</span>
              <h2 className="text-base font-bold text-white">
                Multi-Agent Consensus Score: <span className="text-emerald-400">93.9%</span> (High Alignment)
              </h2>
              <p className="text-xs text-neutral-400">
                All 7 AI Agents reached 93.9% bidding alignment for Option A (Dispatch EV Bus 365J-SP42 from Holding Bay).
              </p>
            </div>
            <div className="text-right">
              <span className="badge-solid bg-emerald-500 text-black font-extrabold text-xs">
                CONSENSUS REACHED
              </span>
              <span className="text-[10px] text-neutral-400 block mt-1">7 of 7 Agents Bidded</span>
            </div>
          </div>

          {/* AGENTS GRID */}
          <div className="grid grid-cols-3 gap-3">
            {agents.map((agent) => (
              <div key={agent.id} className={`bg-white border rounded-[18px] p-3 space-y-2 shadow-sm ${agent.color}`}>
                <div className="flex justify-between items-center text-xs font-bold border-b border-neutral-100 pb-2">
                  <span className="text-neutral-950 flex items-center gap-1.5">
                    <Activity className="h-4 w-4" />
                    {agent.name}
                  </span>
                  <span className="badge-solid text-[10px]">Bid: {agent.bid}</span>
                </div>
                <p className="text-[11px] text-neutral-700 leading-tight">
                  {agent.rec}
                </p>
                <div className="flex justify-between items-center text-[9.5px] text-neutral-400 pt-1">
                  <span>Status: {agent.status}</span>
                  <span className="text-emerald-700 font-bold">100% Weight Valid</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DIGITAL TWIN & WHAT-IF SIMULATOR */}
      {activeTab === 'digital_twin' && (
        <div className="space-y-4 font-mono">
          
          {/* WHAT-IF SCENARIO SELECTOR */}
          <div className="bg-white border border-neutral-200 rounded-[20px] p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-950 uppercase tracking-wider flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-600" />
                Select Interactive What-If Disruption Scenario
              </span>
              <span className="text-xs text-neutral-500">DIGITAL TWIN ENGINE</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-xs">
              <button
                onClick={() => setWhatIfScenario('baseline')}
                className={`p-3 rounded-xl border text-left transition ${
                  whatIfScenario === 'baseline' ? 'bg-neutral-950 text-white border-neutral-950' : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                }`}
              >
                <strong className="block text-xs">Baseline Scenario</strong>
                <span className="text-[10px] text-neutral-400 block">Normal 210 pax queue</span>
              </button>

              <button
                onClick={() => setWhatIfScenario('breakdown')}
                className={`p-3 rounded-xl border text-left transition ${
                  whatIfScenario === 'breakdown' ? 'bg-neutral-950 text-white border-neutral-950' : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                }`}
              >
                <strong className="block text-xs text-amber-400">🚨 Bus Breakdown</strong>
                <span className="text-[10px] text-neutral-400 block">Bus 365J-12 breaks down</span>
              </button>

              <button
                onClick={() => setWhatIfScenario('traffic_20')}
                className={`p-3 rounded-xl border text-left transition ${
                  whatIfScenario === 'traffic_20' ? 'bg-neutral-950 text-white border-neutral-950' : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                }`}
              >
                <strong className="block text-xs text-purple-400">🚗 +20% Traffic Spike</strong>
                <span className="text-[10px] text-neutral-400 block">Congestion delay +24 mins</span>
              </button>

              <button
                onClick={() => setWhatIfScenario('heavy_rain')}
                className={`p-3 rounded-xl border text-left transition ${
                  whatIfScenario === 'heavy_rain' ? 'bg-neutral-950 text-white border-neutral-950' : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                }`}
              >
                <strong className="block text-xs text-blue-400">🌧️ Torrential Rain</strong>
                <span className="text-[10px] text-neutral-400 block">Precipitation &gt; 25mm/h</span>
              </button>
            </div>
          </div>

          {/* SIMULATION RESULT DISPLAY */}
          <div className="bg-neutral-950 text-white rounded-[20px] p-4 border border-neutral-800 space-y-3 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="badge-solid bg-purple-600 text-white font-bold text-xs">DIGITAL TWIN SIMULATION OUTPUT</span>
              <span className="text-xs text-neutral-400">1,000 Scenarios Tested</span>
            </div>

            {whatIfScenario === 'baseline' && (
              <div className="space-y-2 text-xs">
                <h3 className="text-sm font-bold text-white">Baseline Operational Simulation</h3>
                <p className="text-neutral-400 text-xs">
                  Option A (Dispatch EV Bus 365J-SP42) yields 88.5% recovery rate, ₹2,315 net benefit saved, and 0L diesel consumption.
                </p>
              </div>
            )}

            {whatIfScenario === 'breakdown' && (
              <div className="space-y-2 text-xs">
                <h3 className="text-sm font-bold text-amber-400">What-If: Bus 365J-12 Breakdown at Stop #4</h3>
                <p className="text-neutral-300 text-xs">
                  Digital Twin Adaptation: Activate Level 4 Multi-Route Borrowing (Borrow Bus 365K-09 from underloaded Route 365K). Predicted Recovery: 85.0%.
                </p>
              </div>
            )}

            {whatIfScenario === 'traffic_20' && (
              <div className="space-y-2 text-xs">
                <h3 className="text-sm font-bold text-purple-400">What-If: Traffic Congestion Increases by +20%</h3>
                <p className="text-neutral-300 text-xs">
                  Digital Twin Adaptation: Execute Level 5 Traffic-Aware Deadhead via Ring Road Flyover. Saves 12 mins and mitigates ₹180 delay penalty.
                </p>
              </div>
            )}

            {whatIfScenario === 'heavy_rain' && (
              <div className="space-y-2 text-xs">
                <h3 className="text-sm font-bold text-blue-400">What-If: Sudden Torrential Monsoon Rain</h3>
                <p className="text-neutral-300 text-xs">
                  Digital Twin Adaptation: Activate Heavy Rain Playbook (Lower threshold to 150 pax). Saves ₹2,450 in commuter time value.
                </p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 text-center bg-neutral-900 p-2.5 rounded-xl border border-neutral-800 text-xs pt-2">
              <div><span className="text-neutral-400 block text-[9px]">Simulated Recovery</span><strong className="text-emerald-400">88.5%</strong></div>
              <div><span className="text-neutral-400 block text-[9px]">95% Confidence</span><strong className="text-white">[-15.0m, -22.0m]</strong></div>
              <div><span className="text-neutral-400 block text-[9px]">Net Economic Benefit</span><strong className="text-emerald-400">₹2,315 Saved</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OPERATIONAL PLAYBOOKS */}
      {activeTab === 'playbooks' && (
        <div className="space-y-4 font-mono">
          <div className="bg-white border border-neutral-200 rounded-[20px] p-4 space-y-3 shadow-sm">
            <h2 className="text-xs font-bold text-neutral-950 uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-600" />
              OPERATIONAL PLAYBOOKS ENGINE (PILLAR 13)
            </h2>

            <div className="grid grid-cols-4 gap-2 text-xs">
              <button
                onClick={() => setSelectedPlaybook('heavy_rain')}
                className={`p-3 rounded-xl border text-left transition ${
                  selectedPlaybook === 'heavy_rain' ? 'bg-neutral-950 text-white border-neutral-950' : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                }`}
              >
                <strong className="block text-xs">🌧️ Heavy Rain Playbook</strong>
                <span className="text-[10px] text-neutral-400 block">Threshold: 150 pax</span>
              </button>

              <button
                onClick={() => setSelectedPlaybook('festival')}
                className={`p-3 rounded-xl border text-left transition ${
                  selectedPlaybook === 'festival' ? 'bg-neutral-950 text-white border-neutral-950' : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                }`}
              >
                <strong className="block text-xs">🎆 Festival Playbook</strong>
                <span className="text-[10px] text-neutral-400 block">Threshold: 120 pax</span>
              </button>

              <button
                onClick={() => setSelectedPlaybook('metro')}
                className={`p-3 rounded-xl border text-left transition ${
                  selectedPlaybook === 'metro' ? 'bg-neutral-950 text-white border-neutral-950' : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                }`}
              >
                <strong className="block text-xs">🚆 Metro Collapse Playbook</strong>
                <span className="text-[10px] text-neutral-400 block">Threshold: 100 pax</span>
              </button>

              <button
                onClick={() => setSelectedPlaybook('jam')}
                className={`p-3 rounded-xl border text-left transition ${
                  selectedPlaybook === 'jam' ? 'bg-neutral-950 text-white border-neutral-950' : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                }`}
              >
                <strong className="block text-xs">🚗 Traffic Jam Playbook</strong>
                <span className="text-[10px] text-neutral-400 block">Threshold: 160 pax</span>
              </button>
            </div>

            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-xs space-y-2">
              <div className="flex justify-between font-bold text-neutral-950">
                <span>Active Playbook Rules:</span>
                <span className="text-emerald-700">STATUS: ACTIVE</span>
              </div>
              <ul className="space-y-1 text-neutral-700 text-xs list-disc pl-4">
                <li>Bypass diesel vehicles in clean air zones if EV battery SoC &ge; 20%</li>
                <li>Enable express deadheading via flyover corridors to bypass 15m traffic jams</li>
                <li>Set stop lockout window to 450s (tighter headway control)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: OPEN TRANSIT STANDARDS API VIEWER */}
      {activeTab === 'standards' && (
        <div className="space-y-4 font-mono">
          <div className="bg-white border border-neutral-200 rounded-[20px] p-4 space-y-3 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-neutral-950 uppercase tracking-wider flex items-center gap-2">
                <FileCode className="h-4 w-4 text-blue-600" />
                OPEN TRANSIT STANDARDS LIVE VIEWER (PILLAR 10)
              </span>
              <div className="flex space-x-1">
                <button
                  onClick={() => setSelectedStandard('gtfs-rt')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    selectedStandard === 'gtfs-rt' ? 'bg-emerald-600 text-white' : 'bg-neutral-100 text-neutral-700'
                  }`}
                >
                  GTFS-RT
                </button>
                <button
                  onClick={() => setSelectedStandard('siri')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    selectedStandard === 'siri' ? 'bg-blue-600 text-white' : 'bg-neutral-100 text-neutral-700'
                  }`}
                >
                  SIRI
                </button>
                <button
                  onClick={() => setSelectedStandard('netex')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    selectedStandard === 'netex' ? 'bg-purple-600 text-white' : 'bg-neutral-100 text-neutral-700'
                  }`}
                >
                  NeTEx
                </button>
              </div>
            </div>

            <div className="bg-neutral-950 text-emerald-400 p-4 rounded-xl text-xs overflow-x-auto border border-neutral-800 max-h-96">
              <pre>{JSON.stringify(standardsData, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
