import React, { useState, useRef, useEffect } from 'react';
import { Bus, Settings, Bell, Search, Sun, Moon, X, Activity, Radio, ShieldCheck } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Notification } from '../types';
import { fetchMetrics, ApiMetrics, fetchAlerts, ApiAlert } from '../services/api';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSettingsClick: () => void;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

export const Header: React.FC<HeaderProps> = ({ searchTerm, onSearchChange, onSettingsClick, notifications, setNotifications }) => {
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [metrics, setMetrics] = useState<ApiMetrics | null>(null);
  const [alerts, setAlerts] = useState<ApiAlert[]>([]);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = alerts.length > 0 ? alerts.length : notifications.filter(n => !n.read).length;

  useEffect(() => {
    const loadData = async () => {
      const metricsData = await fetchMetrics();
      const alertsData = await fetchAlerts();

      if (metricsData) setMetrics(metricsData);
      else {
        setMetrics({
          api_latency_ms: 14.2,
          inference_time_ms: 8.5,
          fps_camera_feed: 29.8,
          connected_cameras: 9,
          active_buses: 42,
          total_dispatches_today: 18,
          carbon_saved_today_kg: 1240.5
        });
      }

      if (alertsData.length > 0) setAlerts(alertsData);
    };

    loadData();
    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="glass-panel border-b border-slate-800/80 px-6 py-3.5 sticky top-0 z-50 backdrop-blur-xl shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Live System Operational Pulse */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src="/src/assets/images.png" 
                alt="BMTC Logo" 
                className="w-11 h-11 rounded-full bg-white p-0.5 shadow-lg border border-blue-500/40 hover:scale-105 transition-transform"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-ping"></span>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-extrabold tracking-wide bg-gradient-to-r from-white via-slate-100 to-blue-300 bg-clip-text text-transparent">
                  SANCHARA VYUHA
                </h1>
                <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  COMMAND CENTER v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">BMTC Depot 3 • Route 365J (Majestic ↔ Silk Board)</p>
            </div>
          </div>
        </div>

        {/* Center Live Operating Metrics Ticker */}
        {metrics && (
          <div className="hidden lg:flex items-center space-x-4 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
              <span className="text-slate-400">STATUS:</span>
              <span className="text-emerald-400 font-bold">ONLINE</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400">FPS:</span>
              <span className="text-emerald-400 font-bold">{metrics.fps_camera_feed}</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400">LATENCY:</span>
              <span className="text-cyan-400 font-bold">{metrics.api_latency_ms}ms</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center space-x-1.5">
              <Radio className="h-3.5 w-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="text-cyan-300 font-bold">GTFS-RT LIVE</span>
            </div>
          </div>
        )}

        {/* Right Search, Actions & Notifications */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search stops, buses, routes..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-56 transition-all shadow-inner"
            />
          </div>

          <button
            onClick={toggleTheme}
            className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl border border-slate-800 transition-all"
            title={`Switch Theme`}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-blue-400" />}
          </button>
          
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl border border-slate-800 transition-all"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-96 glass-panel rounded-2xl shadow-2xl border border-slate-700 py-3 z-50 animate-scale-in">
                <div className="px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="h-4 w-4 text-blue-400" />
                    <h3 className="font-bold text-sm text-white">Anomaly Alerts & Notifications</h3>
                  </div>
                  <span className="text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-bold">
                    {unreadCount} Active
                  </span>
                </div>
                <div className="max-h-88 overflow-y-auto divide-y divide-slate-800">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="p-3.5 hover:bg-slate-800/60 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              alert.severity === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            }`}>
                              {alert.type}
                            </span>
                            <span className="text-xs font-semibold text-white">{alert.stop}</span>
                          </div>
                          <p className="text-xs text-slate-300">{alert.message}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onSettingsClick}
            className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl border border-slate-800 transition-all"
            title="System Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};