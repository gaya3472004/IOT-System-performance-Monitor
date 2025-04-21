export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  temperature: number;
  battery:number;
  uptime: number;
  wifi_speed: number;
  process_count: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface PredictionData {
  timestamp: string;
  metric: string;
  value: number;
  prediction: number;
}