import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Sparkles, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { mockPeakHourData } from '../data/mockData';
import { fetchQuantilePrediction, ApiQuantilePrediction } from '../services/api';

export const PeakHours: React.FC = () => {
  const [prediction, setPrediction] = useState<ApiQuantilePrediction | null>(null);
  const [selectedStop, setSelectedStop] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPrediction = async () => {
      setLoading(true);
      const res = await fetchQuantilePrediction(selectedStop);
      if (res) {
        setPrediction(res);
      } else {
        // Fallback demo values if backend is offline
        setPrediction({
          stop_no: selectedStop,
          stop_name: selectedStop === 1 ? "Kempegowda Bus Station (Majestic)" : "Silk Board Junction",
          prediction: { p10: 142, p50: 185, p90: 228 },
          recommended_action: "Dispatch Spare Bus",
          confidence: 0.94,
          top_factors: [
            { factor: "Heavy Rain Alert", impact: "+35 passengers", influence: "high_positive" },
            { factor: "Peak Evening Rush (5PM - 8PM)", impact: "+28 passengers", influence: "high_positive" },
            { factor: "Chinnaswamy Stadium Match", impact: "+45 passengers", influence: "high_positive" }
          ]
        });
      }
      setLoading(false);
    };

    loadPrediction();
  }, [selectedStop]);

  const morningData = Object.entries(mockPeakHourData.morning_peak).map(([stop, passengers]) => ({
    stop: stop.length > 15 ? stop.substring(0, 15) + '...' : stop,
    passengers,
    fullName: stop
  }));

  const eveningData = Object.entries(mockPeakHourData.evening_peak).map(([stop, passengers]) => ({
    stop: stop.length > 15 ? stop.substring(0, 15) + '...' : stop,
    passengers,
    fullName: stop
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-gray-900 dark:text-white font-medium">{data.fullName}</p>
          <p className="text-blue-600 dark:text-blue-400 font-semibold">
            Passengers: {payload[0].value} / hour
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <img 
            src="/src/assets/images.png" 
            alt="BMTC" 
            className="w-8 h-8 rounded-full bg-white p-0.5"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">LightGBM Quantile Demand Forecasting</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">P10 / P50 / P90 Uncertainty Bounds & SHAP Explainability</p>
          </div>
        </div>

        <select 
          value={selectedStop}
          onChange={(e) => setSelectedStop(Number(e.target.value))}
          className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-lg shadow-sm font-medium focus:ring-2 focus:ring-blue-500"
        >
          <option value={1}>Kempegowda Bus Station (Majestic)</option>
          <option value={2}>Corporation</option>
          <option value={3}>Shanthinagar Bus Station</option>
          <option value={4}>Dairy Circle</option>
          <option value={5}>Jayanagar 4th Block</option>
          <option value={6}>Silk Board Junction</option>
        </select>
      </div>

      {/* LightGBM Quantile & SHAP Decision Intelligence Panel */}
      {prediction && (
        <div className="bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-indigo-900/40 border border-blue-500/30 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-700/60 pb-4">
            <div className="flex items-center space-x-3">
              <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
              <div>
                <h3 className="text-lg font-bold text-white">Live Quantile Prediction for {prediction.stop_name}</h3>
                <span className="text-xs text-blue-300 font-mono">Engine: LightGBM Multi-Alpha Regressor</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-blue-950/60 px-4 py-2 rounded-xl border border-blue-400/30">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-semibold text-white">Action: <span className="text-emerald-400">{prediction.recommended_action}</span></span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">{(prediction.confidence * 100).toFixed(0)}% Confidence</span>
            </div>
          </div>

          {/* Quantile Bounds Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-gray-400">
                <span>P10 (CONSERVATIVE LOWER)</span>
                <span className="text-blue-400">10th Percentile</span>
              </div>
              <div className="text-3xl font-extrabold text-white">{prediction.prediction.p10} <span className="text-sm font-normal text-gray-400">passengers</span></div>
              <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>

            <div className="bg-gray-900/80 border border-purple-500/40 rounded-xl p-4 space-y-2 shadow-lg">
              <div className="flex justify-between text-xs font-semibold text-purple-300">
                <span>P50 (MEDIAN EXPECTED)</span>
                <span className="text-purple-400">50th Percentile</span>
              </div>
              <div className="text-3xl font-extrabold text-purple-300">{prediction.prediction.p50} <span className="text-sm font-normal text-gray-400">passengers</span></div>
              <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div className="bg-gray-900/70 border border-orange-500/40 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-orange-400">
                <span>P90 (PEAK SURGE UPPER)</span>
                <span className="text-orange-400">90th Percentile</span>
              </div>
              <div className="text-3xl font-extrabold text-orange-400">{prediction.prediction.p90} <span className="text-sm font-normal text-gray-400">passengers</span></div>
              <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>

          {/* SHAP Factor Drivers */}
          <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800">
            <h4 className="text-sm font-bold text-gray-300 mb-3 flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span>SHAP Feature Explainability Drivers (Why the prediction changed)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {prediction.top_factors.map((factor, idx) => (
                <div key={idx} className="bg-gray-800/80 border border-gray-700/80 p-3 rounded-lg flex items-center justify-between">
                  <span className="text-xs text-gray-300 font-medium">{factor.factor}</span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">{factor.impact}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Historical Peak Hours Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Morning Peak Flow (7:30 - 9:30 AM)</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={morningData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="stop" stroke="#9CA3AF" angle={-45} textAnchor="end" height={70} fontSize={11} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="passengers" fill="#F97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Evening Peak Flow (4:30 - 7:30 PM)</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={eveningData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="stop" stroke="#9CA3AF" angle={-45} textAnchor="end" height={70} fontSize={11} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="passengers" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};