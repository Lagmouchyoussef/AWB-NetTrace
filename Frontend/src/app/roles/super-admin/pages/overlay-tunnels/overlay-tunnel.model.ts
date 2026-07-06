export type OverlayTunnelType = 'IPSEC' | 'GRE' | 'DTLS' | 'VXLAN';

export type OverlayTunnelStatus = 'UP' | 'DOWN' | 'DEGRADED' | 'PLANNED';

export const OVERLAY_TUNNEL_TYPES: OverlayTunnelType[] = ['IPSEC', 'GRE', 'DTLS', 'VXLAN'];

export const OVERLAY_TUNNEL_STATUSES: OverlayTunnelStatus[] = ['UP', 'DOWN', 'DEGRADED', 'PLANNED'];

export interface OverlayTunnel {
  id: number;
  name: string;
  code: string;
  sourceEdgeId: number;
  sourceEdgeName: string;
  targetEdgeId: number;
  targetEdgeName: string;
  tunnelType: OverlayTunnelType;
  bandwidthMbps: number;
  status: OverlayTunnelStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OverlayTunnelRequest {
  name: string;
  code: string;
  sourceEdgeId: number;
  targetEdgeId: number;
  tunnelType: OverlayTunnelType;
  bandwidthMbps: number;
  status: OverlayTunnelStatus;
  notes?: string | null;
}

export interface OverlayTunnelPage {
  content: OverlayTunnel[];
  totalElements: number;
}

export interface OverlayTunnelListParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  status?: OverlayTunnelStatus;
}
