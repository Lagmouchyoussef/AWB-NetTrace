export type SdwanEdgeStatus = 'ACTIVE' | 'MAINTENANCE' | 'DECOMMISSIONED' | 'PROVISIONING';

export const SDWAN_EDGE_STATUSES: SdwanEdgeStatus[] = [
  'ACTIVE',
  'MAINTENANCE',
  'DECOMMISSIONED',
  'PROVISIONING',
];

export interface SdwanEdge {
  id: number;
  datacenterId: number;
  datacenterName: string;
  name: string;
  code: string;
  vendor: string;
  model: string | null;
  wanLinkCount: number;
  managementIp: string | null;
  status: SdwanEdgeStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SdwanEdgeRequest {
  datacenterId: number;
  name: string;
  code: string;
  vendor: string;
  model?: string | null;
  wanLinkCount: number;
  managementIp?: string | null;
  status: SdwanEdgeStatus;
  notes?: string | null;
}

export interface SdwanEdgePage {
  content: SdwanEdge[];
  totalElements: number;
}

export interface SdwanEdgeListParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  status?: SdwanEdgeStatus;
  datacenterId?: number;
}
