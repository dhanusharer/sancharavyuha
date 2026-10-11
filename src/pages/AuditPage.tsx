import React, { useState } from 'react';
import { FileText, Search, ShieldCheck, Check, Clock, Eye, Bus, User, MapPin, Zap, AlertTriangle, Calendar } from 'lucide-react';

export const AuditPage: React.FC = () => {
  const auditLogs = [
    {
      decision_id: "DISP-2026-069",
      mission_id: "MISSION-365J-014",
      timestamp: "2026-10-11T11:15:00Z",
      stop: "Silk Board Junction",
      mode: "peak_rush",
      bus_id: "365J-SP42",
      number_plate: "KA-01-F-4298",
      driver_name: "Rajesh Kumar (EV Certified)",
      driver_shift_hrs: "5.2h (Shift OK)",
      route_no: "BMTC Route 365J (Majestic → Electronic City)",
      trigger_type: "UNSCHEDULED DEMAND SPIKE",
      trigger_reason: "CCTV ByteTrack detected 210 waiting pax. LightGBM P90 surge bound predicted 262 pax (+35% IMD Heavy Rain Alert impact). Dual Trigger condition met.",
      option: "A (EV Spare Dispatch)",
      policy: "PASS (5/5 Domains Passed)",
      risk: "LOW (12.5 / 100)",
      utility: 94.0,
      wait_cut: "-18.5 min",
      fuel_saved: "0 L (100% Electric)",
      co2_cut: "210 kg",
      approved_by: "Operator Supervisor #42"
    },
    {
      decision_id: "DISP-2026-068",
      mission_id: "MISSION-365J-013",
      timestamp: "2026-10-11T09:40:00Z",
      stop: "Silk Board Junction",
      mode: "rain_emergency",
      bus_id: "365J-SP18",
      number_plate: "KA-01-F-3811",
      driver_name: "Suresh Gowda",
      driver_shift_hrs: "4.1h (Shift OK)",
      route_no: "BMTC Route 365J (Majestic → Electronic City)",
      trigger_type: "UNSCHEDULED DEMAND SPIKE",
      trigger_reason: "IMD Emergency Rain Alert triggered priority safety weighting. Queue exceeded P90 capacity bound.",
      option: "A (EV Spare Dispatch)",
      policy: "PASS (5/5 Domains Passed)",
      risk: "LOW (18.2 / 100)",
      utility: 91.8,
      wait_cut: "-16.0 min",
      fuel_saved: "0 L (100% Electric)",
      co2_cut: "185 kg",
      approved_by: "Operator Supervisor #42"
    },
    {
      decision_id: "DISP-2026-067",
      mission_id: "MISSION-365J-012",
      timestamp: "2026-10-11T08:15:00Z",
      stop: "Majestic Bus Station",
      mode: "regular_schedule",
      bus_id: "365J-04",
      number_plate: "KA-01-F-1204",
      driver_name: "Venkatesh Murthy",
      driver_shift_hrs: "6.0h (Shift OK)",
      route_no: "BMTC Route 365J (Majestic → Silk Board)",
      trigger_type: "REGULAR TIMETABLE SCHEDULE",
      trigger_reason: "Standard timetable departure schedule for Morning Peak Office Rush.",
      option: "B (Short-Turn Bus Dispatch)",
      policy: "PASS (5/5 Domains Passed)",
      risk: "MED (15.0 / 100)",
      utility: 88.0,
      wait_cut: "-12.0 min",
      fuel_saved: "12.5 L Diesel",
      co2_cut: "140 kg",
      approved_by: "Automated Dispatch Scheduler"
    }
  ];

  const [selectedLog, setSelectedLog] = useState(auditLogs[0]);

  return (
    <div className="p-6 space-y-6 font-sans">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-950 tracking-tight">Audit Trail & Forensic Replay Workspace</h1>
          <p className="text-xs text-neutral-500 font-mono">Persona: Investigator | Detailed Fleet Dispatch Log Inspection (`decision_audit_log` DB)</p>
        </div>
        <div className="flex items-center space-x-2 bg-neutral-950 text-white px-3 py-1.5 rounded-[14px] text-xs font-mono font-semibold">
          <FileText className="h-4 w-4 text-emerald-400" />
          <span>AUDIT LOG: FORENSIC VERIFIED</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* LOG LIST TABLE */}
        <div className="col-span-1 bg-white border border-neutral-200 rounded-[24px] p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <span className="text-xs font-semibold text-neutral-950 uppercase font-mono">Executed Dispatches</span>
            <span className="text-[10px] text-neutral-500 font-mono">{auditLogs.length} Records</span>
          </div>

          <div className="space-y-2">
            {auditLogs.map(log => (
              <div 
                key={log.decision_id}
                onClick={() => setSelectedLog(log)}
                className={`p-3 rounded-[18px] border text-xs font-mono cursor-pointer transition-all ${
                  selectedLog.decision_id === log.decision_id 
                    ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm' 
                    : 'bg-neutral-50 border-neutral-200 text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[11px]">{log.decision_id}</span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-[6px] ${
                    log.trigger_type.includes('SPIKE') 
                      ? 'bg-rose-500 text-white' 
                      : 'bg-emerald-600 text-white'
                  }`}>
                    {log.trigger_type.includes('SPIKE') ? 'CROWD SPIKE' : 'TIMETABLE'}
                  </span>
                </div>
                <div className="text-[10px] opacity-80">{log.stop}</div>
                <div className="text-[10px] opacity-60 mt-1">Bus: {log.number_plate} ({log.bus_id})</div>
              </div>
            ))}
          </div>
        </div>

        {/* FORENSIC DETAILED DISPATCH INSPECTION CARD */}
        <div className="col-span-2 bg-white border border-neutral-200 rounded-[24px] p-6 space-y-5 shadow-sm font-mono">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-neutral-950" />
              <h2 className="text-sm font-bold text-neutral-950 uppercase tracking-wider">
                DETAILED DISPATCH INSPECTION LOG — {selectedLog.decision_id}
              </h2>
            </div>
            <span className="bg-neutral-100 text-neutral-800 border border-neutral-200 text-[10px] font-bold px-2.5 py-1 rounded-[10px]">
              {selectedLog.timestamp}
            </span>
          </div>

          {/* DISPATCH RATIONALE BANNER */}
          <div className={`p-4 rounded-[18px] border text-xs space-y-1.5 ${
            selectedLog.trigger_type.includes('SPIKE')
              ? 'bg-rose-50 border-rose-200 text-rose-950'
              : 'bg-emerald-50 border-emerald-200 text-emerald-950'
          }`}>
            <div className="flex items-center space-x-2 font-bold text-sm">
              {selectedLog.trigger_type.includes('SPIKE') ? (
                <Zap className="h-4 w-4 text-rose-600" />
              ) : (
                <Calendar className="h-4 w-4 text-emerald-600" />
              )}
              <span>DISPATCH TRIGGER RATIONALE: {selectedLog.trigger_type}</span>
            </div>
            <p className="text-xs leading-relaxed text-neutral-800">{selectedLog.trigger_reason}</p>
          </div>

          {/* GRID OF DISPATCH ATTRIBUTES */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            {/* BUS & VEHICLE INFO */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-[18px] p-4 space-y-2">
              <div className="flex items-center space-x-2 border-b border-neutral-200 pb-1.5 text-neutral-950 font-bold">
                <Bus className="h-4 w-4 text-neutral-900" />
                <span>VEHICLE & FLEET IDENTIFIER</span>
              </div>
              <div className="space-y-1 text-neutral-800">
                <div className="flex justify-between"><span>Number Plate:</span><strong className="text-neutral-950">{selectedLog.number_plate}</strong></div>
                <div className="flex justify-between"><span>Fleet Bus ID:</span><strong>{selectedLog.bus_id}</strong></div>
                <div className="flex justify-between"><span>Vehicle Type:</span><strong className="text-emerald-700">100% Electric EV Bus</strong></div>
              </div>
            </div>

            {/* DRIVER INFO */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-[18px] p-4 space-y-2">
              <div className="flex items-center space-x-2 border-b border-neutral-200 pb-1.5 text-neutral-950 font-bold">
                <User className="h-4 w-4 text-neutral-900" />
                <span>ASSIGNED DRIVER & SHIFT</span>
              </div>
              <div className="space-y-1 text-neutral-800">
                <div className="flex justify-between"><span>Driver Name:</span><strong className="text-neutral-950">{selectedLog.driver_name}</strong></div>
                <div className="flex justify-between"><span>Shift Hours:</span><strong>{selectedLog.driver_shift_hrs}</strong></div>
                <div className="flex justify-between"><span>Policy POL-OPER-001:</span><strong className="text-emerald-600">PASS (&lt; 8.0h)</strong></div>
              </div>
            </div>

            {/* ROUTE INFO */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-[18px] p-4 space-y-2">
              <div className="flex items-center space-x-2 border-b border-neutral-200 pb-1.5 text-neutral-950 font-bold">
                <MapPin className="h-4 w-4 text-neutral-900" />
                <span>ROUTE & DISPATCH NODE</span>
              </div>
              <div className="space-y-1 text-neutral-800">
                <div className="flex justify-between"><span>Bus Route:</span><strong className="text-neutral-950">{selectedLog.route_no}</strong></div>
                <div className="flex justify-between"><span>Dispatch Node:</span><strong>{selectedLog.stop}</strong></div>
                <div className="flex justify-between"><span>Mission ID:</span><strong>{selectedLog.mission_id}</strong></div>
              </div>
            </div>

            {/* IMPACT & UTILITY SCORECARD */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-[18px] p-4 space-y-2">
              <div className="flex items-center space-x-2 border-b border-neutral-200 pb-1.5 text-neutral-950 font-bold">
                <ShieldCheck className="h-4 w-4 text-neutral-900" />
                <span>IMPACT & UTILITY SCORECARD</span>
              </div>
              <div className="space-y-1 text-neutral-800">
                <div className="flex justify-between"><span>Utility Score:</span><strong className="text-neutral-950">{selectedLog.utility} / 100</strong></div>
                <div className="flex justify-between"><span>Commuter Wait Cut:</span><strong className="text-emerald-700">{selectedLog.wait_cut}</strong></div>
                <div className="flex justify-between"><span>Diesel Fuel Saved:</span><strong>{selectedLog.fuel_saved}</strong></div>
              </div>
            </div>
          </div>

          {/* APPROVAL FOOTER */}
          <div className="pt-2 border-t border-neutral-200 flex justify-between items-center text-xs text-neutral-500">
            <span>Policy Compliance: <strong className="text-emerald-700">{selectedLog.policy}</strong></span>
            <span>Approval: <strong className="text-neutral-950">{selectedLog.approved_by}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
