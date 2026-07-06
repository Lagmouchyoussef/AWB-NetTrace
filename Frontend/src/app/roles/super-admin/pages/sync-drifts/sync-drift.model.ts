export type DriftType =
  'CONFIG_MISMATCH' | 'FIRMWARE_VERSION' | 'ACL_CHANGE' | 'VLAN_CHANGE' | 'UNAUTHORIZED_CHANGE';

export type DriftSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type SyncDriftStatus = 'DETECTED' | 'ACKNOWLEDGED' | 'REMEDIATED' | 'IGNORED';

export const DRIFT_TYPES: DriftType[] = [
  'CONFIG_MISMATCH',
  'FIRMWARE_VERSION',
  'ACL_CHANGE',
  'VLAN_CHANGE',
  'UNAUTHORIZED_CHANGE',
];

export const DRIFT_SEVERITIES: DriftSeverity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

export const SYNC_DRIFT_STATUSES: SyncDriftStatus[] = [
  'DETECTED',
  'ACKNOWLEDGED',
  'REMEDIATED',
  'IGNORED',
];

export interface SyncDrift {
  id: number;
  deviceId: number;
  deviceName: string;
  title: string;
  description: string | null;
  driftType: DriftType;
  severity: DriftSeverity;
  status: SyncDriftStatus;
  detectedAt: string;
  remediatedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SyncDriftRequest {
  deviceId: number;
  title: string;
  description?: string | null;
  driftType: DriftType;
  severity: DriftSeverity;
  status: SyncDriftStatus;
  detectedAt: string;
  remediatedAt?: string | null;
  notes?: string | null;
}

export interface SyncDriftPage {
  content: SyncDrift[];
  totalElements: number;
}

export interface SyncDriftListParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  status?: SyncDriftStatus;
  severity?: DriftSeverity;
}
