export type OverlayType = 'L2_EVPN' | 'L3_EVPN' | 'ANYCAST_GATEWAY';

export type OverlayNetworkStatus = 'ACTIVE' | 'MAINTENANCE' | 'DECOMMISSIONED' | 'PLANNED';

export const OVERLAY_TYPES: OverlayType[] = ['L2_EVPN', 'L3_EVPN', 'ANYCAST_GATEWAY'];

export const OVERLAY_NETWORK_STATUSES: OverlayNetworkStatus[] = [
  'ACTIVE',
  'MAINTENANCE',
  'DECOMMISSIONED',
  'PLANNED',
];

export interface OverlayNetwork {
  id: number;
  datacenterId: number;
  datacenterName: string;
  name: string;
  code: string;
  vni: number;
  overlayType: OverlayType;
  vlanId: number | null;
  vrfName: string | null;
  routeDistinguisher: string | null;
  routeTargets: string | null;
  status: OverlayNetworkStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OverlayNetworkRequest {
  datacenterId: number;
  name: string;
  code: string;
  vni: number;
  overlayType: OverlayType;
  vlanId?: number | null;
  vrfName?: string | null;
  routeDistinguisher?: string | null;
  routeTargets?: string | null;
  status: OverlayNetworkStatus;
  notes?: string | null;
}

export interface OverlayNetworkPage {
  content: OverlayNetwork[];
  totalElements: number;
}

export interface OverlayNetworkListParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  status?: OverlayNetworkStatus;
  datacenterId?: number;
}
