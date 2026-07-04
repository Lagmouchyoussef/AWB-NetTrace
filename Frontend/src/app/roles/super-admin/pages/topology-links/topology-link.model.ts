export type TopologyLinkType =
  'FABRIC_UPLINK' | 'FABRIC_DOWNLINK' | 'INTER_POD' | 'DCI' | 'PEER_LINK';

export type TopologyLinkStatus = 'UP' | 'DOWN' | 'DEGRADED' | 'PLANNED';

export const TOPOLOGY_LINK_TYPES: TopologyLinkType[] = [
  'FABRIC_UPLINK',
  'FABRIC_DOWNLINK',
  'INTER_POD',
  'DCI',
  'PEER_LINK',
];

export const TOPOLOGY_LINK_STATUSES: TopologyLinkStatus[] = ['UP', 'DOWN', 'DEGRADED', 'PLANNED'];

export interface TopologyLink {
  id: number;
  name: string;
  code: string;
  sourceRoleId: number;
  sourceRoleName: string;
  targetRoleId: number;
  targetRoleName: string;
  linkType: TopologyLinkType;
  speedGbps: number;
  status: TopologyLinkStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TopologyLinkRequest {
  name: string;
  code: string;
  sourceRoleId: number;
  targetRoleId: number;
  linkType: TopologyLinkType;
  speedGbps: number;
  status: TopologyLinkStatus;
  notes?: string | null;
}

export interface TopologyLinkPage {
  content: TopologyLink[];
  totalElements: number;
}

export interface TopologyLinkListParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  status?: TopologyLinkStatus;
}
