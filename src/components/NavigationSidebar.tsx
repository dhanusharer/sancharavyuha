import React, { useState } from 'react';
import { 
  Activity, 
  BrainCircuit, 
  BarChart3, 
  Gauge, 
  Cpu, 
  FileText, 
  TrendingUp, 
  Shield, 
  Settings,
  Bus,
  ChevronLeft,
  ChevronRight,
  Menu,
  Leaf
} from 'lucide-react';

export type WorkspaceType = 
  | 'executive_command'
  | 'sustainability'
  | 'operations' 
  | 'decision' 
  | 'digital_twin'
  | 'network_analytics'
  | 'fleet_intelligence'
  | 'ai_intelligence'
  | 'forecasting'
  | 'policy'
  | 'monitoring' 
  | 'observability'
  | 'decision_memory'
  | 'audit' 
  | 'whatif_simulator'
  | 'executive_analytics' 
  | 'admin';

interface NavigationSidebarProps {
  activeWorkspace: WorkspaceType;
  onSelectWorkspace: (ws: WorkspaceType) => void;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  activeWorkspace,
  onSelectWorkspace
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true); // Collapsed by default as requested!

  const navItems = [
    { id: 'executive_command', label: 'Executive Command Center', icon: Activity, persona: 'Executive / CEO' },
    { id: 'sustainability', label: 'Green Mobility & AWS Impact', icon: Leaf, persona: 'AWS Judge / Eco Lead' },
    { id: 'operations', label: 'Operations Command Center', icon: Activity, persona: 'Dispatcher' },
    { id: 'decision', label: 'Decision Intelligence', icon: BrainCircuit, persona: 'Supervisor' },
    { id: 'digital_twin', label: 'Digital Twin', icon: Cpu, persona: 'Simulation Analyst' },
    { id: 'network_analytics', label: 'Network Analytics', icon: BarChart3, persona: 'Ops Manager' },
    { id: 'fleet_intelligence', label: 'Fleet Intelligence', icon: Bus, persona: 'Fleet Manager' },
    { id: 'ai_intelligence', label: 'AI Intelligence', icon: Cpu, persona: 'AI Engineer' },
    { id: 'forecasting', label: 'Forecasting Intelligence', icon: TrendingUp, persona: 'Data Scientist' },
    { id: 'policy', label: 'Policy Governance', icon: Shield, persona: 'Policy Auditor' },
    { id: 'monitoring', label: 'System Monitoring', icon: Gauge, persona: 'Platform Eng' },
    { id: 'observability', label: 'Observability Tracing', icon: Activity, persona: 'Pipeline Debugger' },
    { id: 'decision_memory', label: 'Decision Memory', icon: FileText, persona: 'Incident Analyst' },
    { id: 'audit', label: 'Audit Trail Replay', icon: FileText, persona: 'Investigator' },
    { id: 'whatif_simulator', label: 'What-If Simulator', icon: Cpu, persona: 'Disruption Analyst' },
    { id: 'executive_analytics', label: 'Executive Rupee ROI', icon: TrendingUp, persona: 'Executive' },
    { id: 'admin', label: 'Administration', icon: Settings, persona: 'Admin' },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-[#090D16] border-r border-[#1E293B] flex flex-col justify-between flex-shrink-0 h-screen font-mono text-white select-none transition-all duration-300 relative`}>
      {/* TOGGLE EXPAND / COLLAPSE BUTTON */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-5 z-50 bg-[#121824] border border-[#1E293B] text-cyan-400 p-1 rounded-full hover:bg-neutral-800 shadow-md cursor-pointer transition"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* BRANDING HEADER */}
      <div className="p-3 border-b border-[#1E293B] bg-[#0D131F]/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_12px_rgba(0,240,255,0.4)] flex-shrink-0">
            <Activity className="h-5 w-5 text-black font-extrabold" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-xs font-black tracking-widest text-white uppercase truncate">SANCHARA VYUHA</h1>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping flex-shrink-0"></span>
              </div>
              <span className="text-[9px] text-cyan-400 tracking-wider uppercase font-bold block truncate">AI-TOS v6.0 GOTHAM</span>
            </div>
          )}
        </div>
      </div>

      {/* NAVIGATION ITEMS */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-neutral-800">
        {!isCollapsed && (
          <span className="text-[9px] font-bold text-neutral-500 tracking-widest uppercase px-3 py-1.5 block">
            TACTICAL WORKSPACES
          </span>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeWorkspace === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectWorkspace(item.id as WorkspaceType)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'} rounded-lg text-xs transition duration-150 group ${
                isActive
                  ? 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 font-bold shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-cyan-400 drop-shadow-[0_0_6px_rgba(0,240,255,0.8)]' : 'text-neutral-500 group-hover:text-neutral-300'}`} />
                {!isCollapsed && <span className="truncate text-[11px] font-mono">{item.label}</span>}
              </div>
              {!isCollapsed && (
                <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'bg-neutral-900 text-neutral-500'
                }`}>
                  {item.persona}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SYSTEM STATUS FOOTER */}
      <div className="p-3 border-t border-[#1E293B] bg-[#0D131F]/90 text-[10px] text-neutral-400 space-y-1">
        {!isCollapsed ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-neutral-500">SYSTEM MODE</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> GOTHAM OPERATIONAL
              </span>
            </div>
            <div className="flex justify-between items-center text-[9px]">
              <span className="text-neutral-500">SOLVER ENGINE</span>
              <span className="text-cyan-400 font-bold">OR-TOOLS v9.8 (14ms)</span>
            </div>
          </>
        ) : (
          <div className="flex justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" title="Gotham Operational"></span>
          </div>
        )}
      </div>
    </aside>
  );
};
