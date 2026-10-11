import React from 'react';
import { ChevronRight, Layers } from 'lucide-react';
import { WorkspaceType } from './NavigationSidebar';

interface WorkspaceBreadcrumbProps {
  activeWorkspace: WorkspaceType;
  selectedStopName?: string;
  activeMissionId?: string;
  selectedOption?: string;
}

export const WorkspaceBreadcrumb: React.FC<WorkspaceBreadcrumbProps> = ({
  activeWorkspace,
  selectedStopName = 'Silk Board Junction',
  activeMissionId = 'MISSION-365J-014',
  selectedOption = 'Option A'
}) => {
  const workspaceNames: Record<WorkspaceType, string> = {
    executive_command: 'Executive Command Center',
    sustainability: 'Green Mobility & AWS Environmental Impact',
    operations: 'Operations Command Center',
    decision: 'Decision Intelligence Workspace',
    digital_twin: 'Digital Twin Corridor Simulation',
    network_analytics: 'Network Analytics',
    fleet_intelligence: 'Fleet Intelligence & Telemetry',
    ai_intelligence: 'AI Model Registry & Feature Store',
    forecasting: 'LightGBM Quantile Demand Forecasting',
    policy: 'Policy Governance & Safety Constraints',
    monitoring: 'Real-time System Monitoring',
    observability: 'Observability & Distributed Tracing',
    decision_memory: 'Operational Decision Memory',
    audit: 'Audit Trail & Forensic Replay',
    whatif_simulator: 'What-If Disruption Simulator',
    executive_analytics: 'Executive Rupee ROI & Board Metrics',
    admin: 'System Administration'
  };

  return (
    <div className="bg-white border-b border-neutral-200 px-6 py-2 flex items-center justify-between font-mono text-xs text-neutral-600">
      <div className="flex items-center space-x-2">
        <Layers className="h-3.5 w-3.5 text-neutral-900" />
        <span className="font-semibold text-neutral-950">{workspaceNames[activeWorkspace]}</span>
        <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
        <span className="text-neutral-700">{selectedStopName}</span>
        <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
        <span className="text-neutral-950 font-semibold">{activeMissionId}</span>
        {activeWorkspace === 'decision' && (
          <>
            <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
            <span className="bg-neutral-950 text-white px-2 py-0.5 rounded-[6px] text-[10px] font-bold">
              {selectedOption}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center space-x-3 text-[10px]">
        <span className="text-neutral-400">CORRIDOR: BMTC 365J</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-neutral-950 font-semibold">LIVE STREAM ACTIVE</span>
      </div>
    </div>
  );
};
