export type CarrierCircuitType = 'MPLS' | 'BROADBAND' | 'LTE_5G' | 'DARK_FIBER' | 'SATELLITE';

export type CarrierCircuitStatus = 'ACTIVE' | 'MAINTENANCE' | 'DECOMMISSIONED' | 'PLANNED';

export const CARRIER_CIRCUIT_TYPES: CarrierCircuitType[] = [
  'MPLS',
  'BROADBAND',
  'LTE_5G',
  'DARK_FIBER',
  'SATELLITE',
];

export const CARRIER_CIRCUIT_STATUSES: CarrierCircuitStatus[] = [
  'ACTIVE',
  'MAINTENANCE',
  'DECOMMISSIONED',
  'PLANNED',
];

export interface CarrierCircuit {
  id: number;
  edgeId: number;
  edgeName: string;
  name: string;
  code: string;
  circuitType: CarrierCircuitType;
  provider: string;
  bandwidthMbps: number;
  status: CarrierCircuitStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CarrierCircuitRequest {
  edgeId: number;
  name: string;
  code: string;
  circuitType: CarrierCircuitType;
  provider: string;
  bandwidthMbps: number;
  status: CarrierCircuitStatus;
  notes?: string | null;
}

export interface CarrierCircuitPage {
  content: CarrierCircuit[];
  totalElements: number;
}

export interface CarrierCircuitListParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  status?: CarrierCircuitStatus;
  edgeId?: number;
}
