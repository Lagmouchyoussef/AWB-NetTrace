export type EquipmentCategory =
  'SERVER' | 'NETWORKING' | 'STORAGE' | 'POWER' | 'COOLING' | 'SECURITY';

export type EquipmentTypeStatus = 'ACTIVE' | 'DEPRECATED';

export const EQUIPMENT_CATEGORIES: EquipmentCategory[] = [
  'SERVER',
  'NETWORKING',
  'STORAGE',
  'POWER',
  'COOLING',
  'SECURITY',
];

export const EQUIPMENT_TYPE_STATUSES: EquipmentTypeStatus[] = ['ACTIVE', 'DEPRECATED'];

export interface EquipmentType {
  id: number;
  name: string;
  code: string;
  category: EquipmentCategory;
  manufacturer: string | null;
  defaultRackUnits: number | null;
  defaultPowerWatts: number | null;
  status: EquipmentTypeStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentTypeRequest {
  name: string;
  code: string;
  category: EquipmentCategory;
  manufacturer?: string | null;
  defaultRackUnits?: number | null;
  defaultPowerWatts?: number | null;
  status: EquipmentTypeStatus;
  notes?: string | null;
}

export interface EquipmentTypePage {
  content: EquipmentType[];
  totalElements: number;
}

export interface EquipmentTypeListParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  status?: EquipmentTypeStatus;
  category?: EquipmentCategory;
}
