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

// Carrier Circuits (Meet-Me-Room): a circuit optionally terminates at a physical Connector (a
// port on a device/patch-panel) rather than an SD-WAN edge - SD-WAN was removed from scope.
export interface CarrierCircuitConnectorRef {
  id: number;
  name: string;
}

export interface CarrierCircuit {
  id: number;
  name: string;
  code: string;
  circuitType: CarrierCircuitType;
  provider: string;
  terminatesAtConnector: CarrierCircuitConnectorRef | null;
  status: CarrierCircuitStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CarrierCircuitRequest {
  name: string;
  code: string;
  circuitType: CarrierCircuitType;
  provider: string;
  terminatesAtConnectorId?: number | null;
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
}
