const API_BASE_URL = "http://localhost:8000/api/v1";

export interface ApiStop {
  id: number;
  stop_no: number;
  name: string;
  lat: number;
  lng: number;
  people_detected_cctv: number;
  waiting_passengers: number;
  congestion_level: string;
  action_required: string;
  incident: boolean;
  incident_description?: string;
  last_updated: string;
}

export interface ApiBus {
  id: number;
  bus_id: string;
  driver: string;
  vehicle_no: string;
  route_id: string;
  current_onboard: number;
  max_capacity: number;
  status: string;
  fuel_type: string;
  battery_soc: number;
  current_stop?: number;
  destination_stop?: number;
  lat?: number;
  lng?: number;
  speed_kmh: number;
  last_updated: string;
}

export interface ApiDispatch {
  id: number;
  dispatch_id: string;
  bus_id: string;
  target_stop_no: number;
  target_stop_name: string;
  timestamp: string;
  status: string;
  reason: string;
  predicted_wait_reduction_mins: number;
}

export interface ApiSustainability {
  id: number;
  timestamp: string;
  carbon_saved_kg: number;
  fuel_saved_liters: number;
  eco_score: number;
  ev_readiness_pct: number;
  active_ev_buses: number;
  total_buses: number;
}

export interface ApiQuantilePrediction {
  stop_no: number;
  stop_name: string;
  prediction: {
    p10: number;
    p50: number;
    p90: number;
  };
  recommended_action: string;
  confidence: number;
  top_factors: Array<{
    factor: string;
    impact: string;
    influence: string;
  }>;
}

export interface ApiAlert {
  id: string;
  type: string;
  stop: string;
  severity: string;
  message: string;
  timestamp: string;
}

export interface ApiMetrics {
  api_latency_ms: number;
  inference_time_ms: number;
  fps_camera_feed: number;
  connected_cameras: number;
  active_buses: number;
  total_dispatches_today: number;
  carbon_saved_today_kg: number;
}

export const fetchStops = async (): Promise<ApiStop[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stops`);
    if (!response.ok) throw new Error("Failed to fetch stops");
    return await response.json();
  } catch (error) {
    console.warn("Backend API unavailable, using fallback client data", error);
    return [];
  }
};

export const fetchBuses = async (): Promise<ApiBus[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/buses`);
    if (!response.ok) throw new Error("Failed to fetch buses");
    return await response.json();
  } catch (error) {
    console.warn("Backend API unavailable, using fallback client data", error);
    return [];
  }
};

export const triggerDispatch = async (stopNo: number, reason?: string): Promise<ApiDispatch | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/dispatch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stop_no: stopNo, reason })
    });
    if (!response.ok) throw new Error("Failed to trigger dispatch");
    return await response.json();
  } catch (error) {
    console.warn("Backend API unavailable for dispatch", error);
    return null;
  }
};

export const fetchSustainabilityMetrics = async (): Promise<ApiSustainability | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sustainability`);
    if (!response.ok) throw new Error("Failed to fetch sustainability metrics");
    return await response.json();
  } catch (error) {
    console.warn("Backend API unavailable for sustainability", error);
    return null;
  }
};

export const fetchQuantilePrediction = async (stopNo: number = 1): Promise<ApiQuantilePrediction | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/forecasting/predict?stop_no=${stopNo}`);
    if (!response.ok) throw new Error("Failed to fetch quantile prediction");
    return await response.json();
  } catch (error) {
    console.warn("Backend API unavailable for forecasting", error);
    return null;
  }
};

export const fetchAlerts = async (): Promise<ApiAlert[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/alerts`);
    if (!response.ok) throw new Error("Failed to fetch anomaly alerts");
    return await response.json();
  } catch (error) {
    console.warn("Backend API unavailable for alerts", error);
    return [];
  }
};

export const fetchMetrics = async (): Promise<ApiMetrics | null> => {
  try {
    const response = await fetch(`http://localhost:8000/metrics`);
    if (!response.ok) throw new Error("Failed to fetch system metrics");
    return await response.json();
  } catch (error) {
    console.warn("Backend API unavailable for metrics", error);
    return null;
  }
};

export const fetchDecisionPackage = async (stopNo: number = 6): Promise<any | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/dispatch/decision-package?stop_no=${stopNo}`);
    if (!response.ok) throw new Error("Failed to fetch decision package");
    return await response.json();
  } catch (error) {
    console.warn("Backend API unavailable for decision package", error);
    return null;
  }
};

export const fetchMissions = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/dispatch/missions`);
    if (!response.ok) throw new Error("Failed to fetch missions");
    return await response.json();
  } catch (error) {
    console.warn("Backend API unavailable for missions", error);
    return [];
  }
};

// --- AWS CLOUD & GREEN MOBILITY ENHANCED SERVICES ---

export interface ApiSustainabilityReport {
  id?: number;
  timestamp?: string;
  carbon_saved_kg?: number;
  fuel_saved_liters?: number;
  eco_score?: number;
  ev_readiness_pct?: number;
  active_ev_buses?: number;
  total_buses?: number;
  status?: string;
  calculation_timestamp?: string;
  scope?: string;
  data_source_label?: string;
  confidence_level?: string;
  operational_metrics?: {
    trips_analyzed: number;
    total_passengers_served: number;
    total_passenger_km: number;
    active_fleet_count: number;
    active_ev_buses: number;
    active_diesel_buses: number;
    ev_penetration_pct: number;
    corridor_length_km: number;
  };
  distance_metrics?: {
    baseline_vkm: number;
    optimized_vkm: number;
    deadhead_vkm_avoided: number;
    unit: string;
  };
  fuel_and_energy?: {
    baseline_diesel_liters: number;
    optimized_diesel_liters: number;
    fuel_saved_liters: number;
    fuel_saving_pct: number;
    optimized_ev_energy_kwh: number;
    ev_energy_unit: string;
  };
  emissions_accounting?: {
    baseline_co2_kg: number;
    optimized_co2_kg: number;
    avoided_co2_kg: number;
    emission_reduction_pct: number;
    eco_score: number;
    modal_shift_displaced_co2_kg: number;
    unit: string;
  };
  methodology?: {
    diesel_factor: string;
    ev_grid_factor: string;
    diesel_consumption_rate: string;
    ev_consumption_rate: string;
    baseline_formula: string;
    avoided_formula: string;
    double_counting_safeguard: string;
  };
}

export interface ApiRouteSustainability {
  route_id: string;
  name: string;
  length_km: number;
  daily_trips: number;
  ev_share_pct: number;
  baseline_fuel_l: number;
  optimized_fuel_l: number;
  fuel_saved_l: number;
  baseline_co2_kg: number;
  optimized_co2_kg: number;
  co2_avoided_kg: number;
  efficiency_pct: number;
  pax_served: number;
  status: string;
}

export interface ApiAwsStatus {
  status: string;
  provider_mode: 'live_aws' | 'local_mock_adapter';
  region: string;
  s3: {
    bucket_name: string;
    endpoint: string;
    connected: boolean;
    is_live: boolean;
  };
  cloudwatch: {
    namespace: string;
    connected: boolean;
    is_live: boolean;
  };
  features_enabled: string[];
}

export const fetchSustainabilityReport = async (): Promise<ApiSustainabilityReport | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sustainability`);
    if (!response.ok) throw new Error("Failed to fetch sustainability report");
    return await response.json();
  } catch (error) {
    console.warn("Backend API unavailable for sustainability report, using fallback", error);
    return null;
  }
};

export const fetchSustainabilityRoutes = async (): Promise<ApiRouteSustainability[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sustainability/routes`);
    if (!response.ok) throw new Error("Failed to fetch route sustainability");
    return await response.json();
  } catch (error) {
    console.warn("Backend API unavailable for route sustainability", error);
    return [];
  }
};

export const fetchSustainabilityTrends = async (days: number = 7): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sustainability/trends?days=${days}`);
    if (!response.ok) throw new Error("Failed to fetch sustainability trends");
    return await response.json();
  } catch (error) {
    console.warn("Backend API unavailable for trends", error);
    return [];
  }
};

export const simulateSustainabilityScenario = async (payload: {
  ev_fleet_ratio_pct: number;
  demand_surge_pct: number;
  optimized_dispatch_enabled: boolean;
}): Promise<any | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sustainability/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("Failed to simulate scenario");
    return await response.json();
  } catch (error) {
    console.warn("Backend API unavailable for simulation", error);
    return null;
  }
};

export const fetchSustainabilityMethodology = async (): Promise<any | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sustainability/methodology`);
    if (!response.ok) throw new Error("Failed to fetch methodology");
    return await response.json();
  } catch (error) {
    console.warn("Backend API unavailable for methodology", error);
    return null;
  }
};

export const fetchAwsStatus = async (): Promise<ApiAwsStatus | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/aws/status`);
    if (!response.ok) throw new Error("Failed to fetch AWS status");
    return await response.json();
  } catch (error) {
    console.warn("Backend API unavailable for AWS status", error);
    return null;
  }
};

export const exportAuditReportToS3 = async (title: string = "BMTC Route 365J Sustainability Audit"): Promise<any | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/aws/export-s3`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ report_title: title, include_methodology: true })
    });
    if (!response.ok) throw new Error("Failed to export audit report to S3");
    return await response.json();
  } catch (error) {
    console.warn("Backend API unavailable for S3 export", error);
    return null;
  }
};

export const syncMetricsToCloudWatch = async (metrics?: {
  avoided_co2_kg?: number;
  fuel_saved_liters?: number;
  eco_score?: number;
}): Promise<any | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/aws/sync-cloudwatch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metrics || {})
    });
    if (!response.ok) throw new Error("Failed to sync metrics to CloudWatch");
    return await response.json();
  } catch (error) {
    console.warn("Backend API unavailable for CloudWatch sync", error);
    return null;
  }
};

export const fetchAwsArchivedReports = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/aws/archive`);
    if (!response.ok) throw new Error("Failed to fetch AWS archive");
    return await response.json();
  } catch (error) {
    console.warn("Backend API unavailable for AWS archive", error);
    return [];
  }
};

