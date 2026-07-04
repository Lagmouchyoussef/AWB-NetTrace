export type RackContainment = 'HOT_AISLE' | 'COLD_AISLE' | 'NONE';

export type RackStatus = 'ACTIVE' | 'MAINTENANCE' | 'DECOMMISSIONED' | 'RESERVED';

export const RACK_CONTAINMENTS: RackContainment[] = ['HOT_AISLE', 'COLD_AISLE', 'NONE'];

export const RACK_STATUSES: RackStatus[] = ['ACTIVE', 'MAINTENANCE', 'DECOMMISSIONED', 'RESERVED'];

export interface Rack {
  id: number;
  roomId: number;
  roomName: string;
  name: string;
  code: string;
  heightU: number;
  powerCapacityKw: number;
  currentPowerDrawKw: number | null;
  maxWeightKg: number | null;
  containment: RackContainment;
  status: RackStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RackRequest {
  roomId: number;
  name: string;
  code: string;
  heightU: number;
  powerCapacityKw: number;
  currentPowerDrawKw?: number | null;
  maxWeightKg?: number | null;
  containment: RackContainment;
  status: RackStatus;
  notes?: string | null;
}

export interface RackPage {
  content: Rack[];
  totalElements: number;
}

export interface RackListParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  status?: RackStatus;
  roomId?: number;
}
