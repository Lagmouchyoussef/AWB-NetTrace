export type CableType =
  'FIBER_OM3' | 'FIBER_OM4' | 'FIBER_OM5' | 'FIBER_OS2' | 'COPPER_CAT6A' | 'DAC_COPPER' | 'AOC';

export type CableStatus = 'CONNECTED' | 'DISCONNECTED' | 'FAULTY' | 'PLANNED';

export const CABLE_TYPES: CableType[] = [
  'FIBER_OM3',
  'FIBER_OM4',
  'FIBER_OM5',
  'FIBER_OS2',
  'COPPER_CAT6A',
  'DAC_COPPER',
  'AOC',
];

export const CABLE_STATUSES: CableStatus[] = ['CONNECTED', 'DISCONNECTED', 'FAULTY', 'PLANNED'];

export interface Cable {
  id: number;
  name: string;
  code: string;
  sourceDeviceId: number;
  sourceDeviceName: string;
  targetDeviceId: number;
  targetDeviceName: string;
  cableType: CableType;
  lengthMeters: number;
  status: CableStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CableRequest {
  name: string;
  code: string;
  sourceDeviceId: number;
  targetDeviceId: number;
  cableType: CableType;
  lengthMeters: number;
  status: CableStatus;
  notes?: string | null;
}

export interface CablePage {
  content: Cable[];
  totalElements: number;
}

export interface CableListParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  status?: CableStatus;
}
