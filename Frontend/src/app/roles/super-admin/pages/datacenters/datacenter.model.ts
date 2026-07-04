export type DatacenterTier = 'TIER_I' | 'TIER_II' | 'TIER_III' | 'TIER_IV';

export type DatacenterStatus = 'ACTIVE' | 'MAINTENANCE' | 'DECOMMISSIONED';

export const DATACENTER_TIERS: DatacenterTier[] = ['TIER_I', 'TIER_II', 'TIER_III', 'TIER_IV'];

export const DATACENTER_STATUSES: DatacenterStatus[] = ['ACTIVE', 'MAINTENANCE', 'DECOMMISSIONED'];

export interface Datacenter {
  id: number;
  name: string;
  code: string;
  city: string;
  country: string;
  address: string | null;
  tier: DatacenterTier;
  status: DatacenterStatus;
  totalPowerKw: number | null;
  totalSpaceSqm: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DatacenterRequest {
  name: string;
  code: string;
  city: string;
  country: string;
  address?: string | null;
  tier: DatacenterTier;
  status: DatacenterStatus;
  totalPowerKw?: number | null;
  totalSpaceSqm?: number | null;
  notes?: string | null;
}

export interface DatacenterPage {
  content: Datacenter[];
  totalElements: number;
}

export interface DatacenterListParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  status?: DatacenterStatus;
  tier?: DatacenterTier;
}
