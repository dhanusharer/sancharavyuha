import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, AlertCircle, Database, GitBranch, RefreshCw } from 'lucide-react';

export const MLOpsPage: React.FC = () => {
  const [modelMeta, setModelMeta] = useState<any>({
    model_id: "lgbm_quantile_v3.1",
    algorithm: "LightGBM Multi-Quantile Regressor",
    version: "3.1.0",
    training_date: "2026-10-10T04:00:00Z",
    dataset_version: "bmtc_route365j_180days_v3",
    hyperparameters: { n_estimators: 250, learning_rate: 0.045, num_leaves: 31, quantiles: [0.10, 0.50, 0.90] },
    metrics: { mae: 29.54, pinball_loss: 14.77, r2_score: 0.884 }
  });

  return (
    <div className="p-6 space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-950 tracking-tight">ML Operations & Model Lifecycle Workspace</h1>
          <p className="text-xs text-neutral-500 font-mono">Persona: ML Engineer | Model Registry • Feature Store • Drift Detection • Shadow Deployments</p>
        </div>
        <div className="flex items-center space-x-2 bg-neutral-950 text-white px-3 py-1.5 rounded-[14px] text-xs font-mono font-semibold">
          <GitBranch className="h-4 w-4 text-emerald-400" />
          <span>ACTIVE MODEL: {modelMeta.model_id}</span>
        </div>
      </div>

      {/* ===== MODEL REGISTRY & METRICS ===== */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 rounded-[24px] p-5 space-y-3 shadow-sm">
          <div className="flex items-center space-x-2 text-neutral-500 text-xs font-mono">
            <Database className="h-4 w-4 text-neutral-950" />
            <span>MODEL REGISTRY</span>
          </div>
          <div className="space-y-1 font-mono text-xs text-neutral-800">
            <div><span className="text-neutral-400">Algorithm:</span> {modelMeta.algorithm}</div>
            <div><span className="text-neutral-400">Version:</span> {modelMeta.version}</div>
            <div><span className="text-neutral-400">Trained:</span> {modelMeta.training_date}</div>
            <div><span className="text-neutral-400">Dataset:</span> {modelMeta.dataset_version}</div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-[24px] p-5 space-y-3 shadow-sm">
          <div className="flex items-center space-x-2 text-neutral-500 text-xs font-mono">
            <Cpu className="h-4 w-4 text-neutral-950" />
            <span>HYPERPARAMETERS</span>
          </div>
          <div className="space-y-1 font-mono text-xs text-neutral-800">
            <div><span className="text-neutral-400">Estimators:</span> {modelMeta.hyperparameters.n_estimators} trees</div>
            <div><span className="text-neutral-400">Learning Rate:</span> {modelMeta.hyperparameters.learning_rate}</div>
            <div><span className="text-neutral-400">Leaves:</span> {modelMeta.hyperparameters.num_leaves}</div>
            <div><span className="text-neutral-400">Quantiles:</span> P10, P50, P90</div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-[24px] p-5 space-y-3 shadow-sm">
          <div className="flex items-center space-x-2 text-neutral-500 text-xs font-mono">
            <CheckCircle2 className="h-4 w-4 text-neutral-950" />
            <span>QUANTILE ACCURACY</span>
          </div>
          <div className="space-y-1 font-mono text-xs text-neutral-800">
            <div><span className="text-neutral-400">MAE:</span> <strong className="text-neutral-950">{modelMeta.metrics.mae} pax</strong></div>
            <div><span className="text-neutral-400">Pinball Loss:</span> <strong className="text-neutral-950">{modelMeta.metrics.pinball_loss}</strong></div>
            <div><span className="text-neutral-400">R2 Score:</span> <strong className="text-neutral-950">{modelMeta.metrics.r2_score}</strong></div>
            <div><span className="text-neutral-400">P90 Coverage:</span> <strong className="text-emerald-600">91.2% (Calibrated)</strong></div>
          </div>
        </div>
      </div>

      {/* ===== DRIFT DETECTION & SHADOW DEPLOYMENT ===== */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-neutral-200 rounded-[24px] p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <span className="text-xs font-semibold text-neutral-950 uppercase font-mono">Feature & Concept Drift Detector</span>
            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-[6px]">
              STATUS: STABLE
            </span>
          </div>
          <div className="space-y-2 text-xs font-mono text-neutral-700">
            <div className="flex justify-between"><span>Kolmogorov-Smirnov Drift Stat:</span><strong>0.042 (&lt; 0.10 bound)</strong></div>
            <div className="flex justify-between"><span>Calibration Delta:</span><strong>0.015 (&lt; 0.05 bound)</strong></div>
            <div className="flex justify-between"><span>Recommendation:</span><span className="text-neutral-950 font-bold">Maintain active model version</span></div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-[24px] p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <span className="text-xs font-semibold text-neutral-950 uppercase font-mono">Shadow Model Evaluation</span>
            <span className="bg-neutral-950 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-[6px]">
              SHADOW v3.2 ACTIVE
            </span>
          </div>
          <div className="space-y-2 text-xs font-mono text-neutral-700">
            <div className="flex justify-between"><span>Active Model P50:</span><strong>210 pax</strong></div>
            <div className="flex justify-between"><span>Shadow Model v3.2 P50:</span><strong>206 pax</strong></div>
            <div className="flex justify-between"><span>Variance Delta:</span><strong>-1.9% (In Monitoring)</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
