export type AnomalyType =
  | 'THRESHOLD_BREACH'
  | 'TRAFFIC_SPIKE'
  | 'FLAPPING_LINK'
  | 'CONFIG_DRIFT'
  | 'UNAUTHORIZED_ACCESS'
  | 'PACKET_LOSS'
  | 'LATENCY_DEGRADATION';

export type AnomalySeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type AnomalyDetectionStatus = 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED' | 'FALSE_POSITIVE';

export const ANOMALY_TYPES: AnomalyType[] = [
  'THRESHOLD_BREACH',
  'TRAFFIC_SPIKE',
  'FLAPPING_LINK',
  'CONFIG_DRIFT',
  'UNAUTHORIZED_ACCESS',
  'PACKET_LOSS',
  'LATENCY_DEGRADATION',
];

export const ANOMALY_SEVERITIES: AnomalySeverity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'];

export const ANOMALY_DETECTION_STATUSES: AnomalyDetectionStatus[] = [
  'OPEN',
  'ACKNOWLEDGED',
  'RESOLVED',
  'FALSE_POSITIVE',
];

export interface AnomalyDetection {
  id: number;
  deviceId: number;
  deviceName: string;
  title: string;
  description: string | null;
  anomalyType: AnomalyType;
  severity: AnomalySeverity;
  status: AnomalyDetectionStatus;
  detectedAt: string;
  resolvedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AnomalyDetectionRequest {
  deviceId: number;
  title: string;
  description?: string | null;
  anomalyType: AnomalyType;
  severity: AnomalySeverity;
  status: AnomalyDetectionStatus;
  detectedAt: string;
  resolvedAt?: string | null;
  notes?: string | null;
}

export interface AnomalyDetectionPage {
  content: AnomalyDetection[];
  totalElements: number;
}

export interface AnomalyDetectionListParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  status?: AnomalyDetectionStatus;
  severity?: AnomalySeverity;
}
