import React, { useState } from 'react';
import { Shield, Key, Sliders, Server, Users, Bell, Bus, Settings } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'policies' | 'rbac' | 'keys' | 'alerts'>('policies');

  return (
    <div className="p-6 space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-950 tracking-tight">System Administration & Configuration</h1>
          <p className="text-xs text-neutral-500 font-mono">Persona: Administrator | Policy Bounds • RBAC Access Control • API Keys • Alert Triggers</p>
        </div>
      </div>

      {/* ADMIN TABS */}
      <div className="flex space-x-2 border-b border-neutral-200 pb-2">
        {[
          { id: 'policies', label: 'Policy Domains', icon: Sliders },
          { id: 'rbac', label: 'RBAC Roles & Users', icon: Users },
          { id: 'keys', label: 'API Keys & Gateways', icon: Key },
          { id: 'alerts', label: 'Alerting Thresholds', icon: Bell },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-[14px] text-xs font-mono transition-all cursor-pointer ${
                isActive ? 'bg-neutral-950 text-white font-bold' : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'policies' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white border border-neutral-200 rounded-[24px] p-5 space-y-3 shadow-sm">
            <div className="text-xs font-semibold text-neutral-950 font-mono uppercase border-b border-neutral-100 pb-2">Hard Policy Constraints (5 Domains)</div>
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between border-b border-neutral-100 pb-2"><span>POL-OPER-001: Driver Shift Hours Limit</span><strong className="text-neutral-950">8.0 Hours Max</strong></div>
              <div className="flex justify-between border-b border-neutral-100 pb-2"><span>POL-FLEET-002: EV Battery Minimum SoC</span><strong className="text-neutral-950">20.0% SoC</strong></div>
              <div className="flex justify-between border-b border-neutral-100 pb-2"><span>POL-SAFETY-003: Depot Spare Fleet Reserve</span><strong className="text-neutral-950">3 Buses Min</strong></div>
              <div className="flex justify-between border-b border-neutral-100 pb-2"><span>POL-BUSIN-004: Stop Dispatch Rate Limit</span><strong className="text-neutral-950">600s Lockout</strong></div>
              <div className="flex justify-between"><span>POL-ENVIRONMENT-005: Low Emission Zone</span><strong className="text-emerald-700">EV Priority</strong></div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-[24px] p-5 space-y-3 shadow-sm">
            <div className="text-xs font-semibold text-neutral-950 font-mono uppercase border-b border-neutral-100 pb-2">Dual-Trigger Rule Parameters</div>
            <div className="space-y-3 text-xs font-mono text-neutral-800">
              <div className="flex justify-between border-b border-neutral-100 pb-2"><span>P50 Median Surge Trigger:</span><strong>&gt; 120 pax</strong></div>
              <div className="flex justify-between border-b border-neutral-100 pb-2"><span>P90 Quantile Surge Trigger:</span><strong>&gt; 175 pax</strong></div>
              <div className="flex justify-between border-b border-neutral-100 pb-2"><span>Queue Rate-of-Change Limit:</span><strong>&gt; +15 pax/min</strong></div>
              <div className="flex justify-between"><span>ML Confidence Threshold:</span><strong>&ge; 0.85 (85%)</strong></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'rbac' && (
        <div className="bg-white border border-neutral-200 rounded-[24px] p-5 space-y-3 shadow-sm">
          <div className="text-xs font-semibold text-neutral-950 font-mono uppercase border-b border-neutral-100 pb-2">Role-Based Access Control (RBAC)</div>
          <div className="space-y-2 text-xs font-mono text-neutral-800">
            <div className="p-3 bg-neutral-50 rounded-[14px] flex justify-between items-center">
              <div><strong className="block text-neutral-950">Dispatcher Persona</strong><span>Permissions: Read Telemetry, View Radar, Trigger Dispatch Request</span></div>
              <span className="bg-neutral-950 text-white px-2 py-1 rounded-[6px] text-[10px]">3 Active Users</span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-[14px] flex justify-between items-center">
              <div><strong className="block text-neutral-950">Supervisor Persona</strong><span>Permissions: Approve/Reject Decision Package (Options A/B/C)</span></div>
              <span className="bg-neutral-950 text-white px-2 py-1 rounded-[6px] text-[10px]">2 Active Users</span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-[14px] flex justify-between items-center">
              <div><strong className="block text-neutral-950">System Administrator</strong><span>Permissions: Modify Policies, Calibration, User Management</span></div>
              <span className="bg-neutral-950 text-white px-2 py-1 rounded-[6px] text-[10px]">1 Active User</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'keys' && (
        <div className="bg-white border border-neutral-200 rounded-[24px] p-5 space-y-3 shadow-sm">
          <div className="text-xs font-semibold text-neutral-950 font-mono uppercase border-b border-neutral-100 pb-2">External API Gateways & Service Keys</div>
          <div className="space-y-2 text-xs font-mono text-neutral-800">
            <div className="flex justify-between border-b border-neutral-100 pb-2"><span>IMD Weather API Gateway:</span><strong className="text-emerald-600">CONNECTED (220ms)</strong></div>
            <div className="flex justify-between border-b border-neutral-100 pb-2"><span>TomTom Traffic Index API:</span><strong className="text-emerald-600">CONNECTED (180ms)</strong></div>
            <div className="flex justify-between border-b border-neutral-100 pb-2"><span>BMTC GTFS-Realtime Protobuf Feed:</span><strong className="text-emerald-600">CONNECTED (8.2s Freshness)</strong></div>
            <div className="flex justify-between"><span>Depot CCTV RTSP ByteTrack Stream:</span><strong className="text-emerald-600">ONLINE (29.8 FPS)</strong></div>
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="bg-white border border-neutral-200 rounded-[24px] p-5 space-y-3 shadow-sm">
          <div className="text-xs font-semibold text-neutral-950 font-mono uppercase border-b border-neutral-100 pb-2">Alert Rule Configuration</div>
          <div className="space-y-2 text-xs font-mono text-neutral-800">
            <div className="flex justify-between border-b border-neutral-100 pb-2"><span>Decision Latency &gt; 50ms:</span><strong className="text-amber-600">WARNING</strong></div>
            <div className="flex justify-between border-b border-neutral-100 pb-2"><span>Camera Feed Offline &gt; 300s:</span><strong className="text-rose-600">CRITICAL</strong></div>
            <div className="flex justify-between border-b border-neutral-100 pb-2"><span>GTFS Feed Stale &gt; 30s:</span><strong className="text-amber-600">WARNING</strong></div>
            <div className="flex justify-between"><span>Policy Engine Exception:</span><strong className="text-rose-600">CRITICAL</strong></div>
          </div>
        </div>
      )}
    </div>
  );
};
