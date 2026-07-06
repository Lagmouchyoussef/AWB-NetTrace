export type SystemSettingCategory =
  'GENERAL' | 'SECURITY' | 'NOTIFICATIONS' | 'INTEGRATIONS' | 'MONITORING';

export type SystemSettingDataType = 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';

export const SYSTEM_SETTING_CATEGORIES: SystemSettingCategory[] = [
  'GENERAL',
  'SECURITY',
  'NOTIFICATIONS',
  'INTEGRATIONS',
  'MONITORING',
];

export const SYSTEM_SETTING_DATA_TYPES: SystemSettingDataType[] = [
  'STRING',
  'NUMBER',
  'BOOLEAN',
  'JSON',
];

export interface SystemSetting {
  id: number;
  settingKey: string;
  settingValue: string | null;
  category: SystemSettingCategory;
  dataType: SystemSettingDataType;
  description: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SystemSettingRequest {
  settingKey: string;
  settingValue?: string | null;
  category: SystemSettingCategory;
  dataType: SystemSettingDataType;
  description?: string | null;
  notes?: string | null;
}

export interface SystemSettingPage {
  content: SystemSetting[];
  totalElements: number;
}

export interface SystemSettingListParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  category?: SystemSettingCategory;
}
