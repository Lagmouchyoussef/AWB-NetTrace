export type DeviceType =
  | 'SERVER'
  | 'GPU_AI_NODE'
  | 'SWITCH'
  | 'ROUTER'
  | 'FIREWALL'
  | 'LOAD_BALANCER'
  | 'STORAGE_ARRAY'
  | 'PDU'
  | 'UPS'
  | 'COOLING_UNIT'
  | 'OTHER';

export type DeviceStatus = 'ACTIVE' | 'MAINTENANCE' | 'DECOMMISSIONED' | 'SPARE';

export const DEVICE_TYPES: DeviceType[] = [
  'SERVER',
  'GPU_AI_NODE',
  'SWITCH',
  'ROUTER',
  'FIREWALL',
  'LOAD_BALANCER',
  'STORAGE_ARRAY',
  'PDU',
  'UPS',
  'COOLING_UNIT',
  'OTHER',
];

export const DEVICE_STATUSES: DeviceStatus[] = ['ACTIVE', 'MAINTENANCE', 'DECOMMISSIONED', 'SPARE'];

export interface Device {
  id: number;
  rackId: number;
  rackName: string;
  name: string;
  deviceType: DeviceType;
  manufacturer: string | null;
  model: string | null;
  serialNumber: string;
  positionUStart: number;
  heightU: number;
  powerConsumptionW: number | null;
  managementIp: string | null;
  status: DeviceStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceRequest {
  rackId: number;
  name: string;
  deviceType: DeviceType;
  manufacturer?: string | null;
  model?: string | null;
  serialNumber: string;
  positionUStart: number;
  heightU: number;
  powerConsumptionW?: number | null;
  managementIp?: string | null;
  status: DeviceStatus;
  notes?: string | null;
}

export interface DevicePage {
  content: Device[];
  totalElements: number;
}

export interface DeviceListParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  status?: DeviceStatus;
  rackId?: number;
}
