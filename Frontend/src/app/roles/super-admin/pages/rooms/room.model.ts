export type RoomType =
  | 'SERVER_ROOM'
  | 'NETWORK_ROOM'
  | 'STORAGE_ROOM'
  | 'UPS_ROOM'
  | 'COOLING_PLANT'
  | 'ELECTRICAL_ROOM';

export type CoolingType =
  | 'CRAC'
  | 'CRAH'
  | 'IN_ROW'
  | 'REAR_DOOR_HEAT_EXCHANGER'
  | 'DIRECT_LIQUID_COOLING'
  | 'IMMERSION_COOLING';

export type RoomStatus = 'ACTIVE' | 'MAINTENANCE' | 'DECOMMISSIONED';

export const ROOM_TYPES: RoomType[] = [
  'SERVER_ROOM',
  'NETWORK_ROOM',
  'STORAGE_ROOM',
  'UPS_ROOM',
  'COOLING_PLANT',
  'ELECTRICAL_ROOM',
];

export const COOLING_TYPES: CoolingType[] = [
  'CRAC',
  'CRAH',
  'IN_ROW',
  'REAR_DOOR_HEAT_EXCHANGER',
  'DIRECT_LIQUID_COOLING',
  'IMMERSION_COOLING',
];

export const ROOM_STATUSES: RoomStatus[] = ['ACTIVE', 'MAINTENANCE', 'DECOMMISSIONED'];

export interface Room {
  id: number;
  datacenterId: number;
  datacenterName: string;
  name: string;
  code: string;
  roomType: RoomType;
  floor: string | null;
  areaSqm: number | null;
  maxPowerKw: number | null;
  coolingType: CoolingType;
  status: RoomStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RoomRequest {
  datacenterId: number;
  name: string;
  code: string;
  roomType: RoomType;
  floor?: string | null;
  areaSqm?: number | null;
  maxPowerKw?: number | null;
  coolingType: CoolingType;
  status: RoomStatus;
  notes?: string | null;
}

export interface RoomPage {
  content: Room[];
  totalElements: number;
}

export interface RoomListParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  status?: RoomStatus;
  datacenterId?: number;
}
