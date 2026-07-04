export type NetworkRoleType =
  'SUPER_SPINE' | 'SPINE' | 'LEAF' | 'BORDER_LEAF' | 'TOR_SWITCH' | 'ROUTE_REFLECTOR';

export type NetworkRoleStatus = 'ACTIVE' | 'MAINTENANCE' | 'DECOMMISSIONED' | 'PLANNED';

export const NETWORK_ROLE_TYPES: NetworkRoleType[] = [
  'SUPER_SPINE',
  'SPINE',
  'LEAF',
  'BORDER_LEAF',
  'TOR_SWITCH',
  'ROUTE_REFLECTOR',
];

export const NETWORK_ROLE_STATUSES: NetworkRoleStatus[] = [
  'ACTIVE',
  'MAINTENANCE',
  'DECOMMISSIONED',
  'PLANNED',
];

export interface NetworkRole {
  id: number;
  deviceId: number;
  deviceName: string;
  name: string;
  code: string;
  roleType: NetworkRoleType;
  asn: number | null;
  loopbackIp: string | null;
  podNumber: number | null;
  status: NetworkRoleStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NetworkRoleRequest {
  deviceId: number;
  name: string;
  code: string;
  roleType: NetworkRoleType;
  asn?: number | null;
  loopbackIp?: string | null;
  podNumber?: number | null;
  status: NetworkRoleStatus;
  notes?: string | null;
}

export interface NetworkRolePage {
  content: NetworkRole[];
  totalElements: number;
}

export interface NetworkRoleListParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  status?: NetworkRoleStatus;
}
