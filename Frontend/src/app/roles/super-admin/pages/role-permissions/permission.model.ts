export type PermissionModule =
  | 'INFRASTRUCTURE'
  | 'FABRIC'
  | 'CABLING'
  | 'SDWAN'
  | 'TELEMETRY'
  | 'LIBRARY'
  | 'ADMINISTRATION'
  | 'INTEGRATIONS'
  | 'AUDIT'
  | 'REPORTS'
  | 'INTERVENTIONS';

export const PERMISSION_MODULES: PermissionModule[] = [
  'INFRASTRUCTURE',
  'FABRIC',
  'CABLING',
  'SDWAN',
  'TELEMETRY',
  'LIBRARY',
  'ADMINISTRATION',
  'INTEGRATIONS',
  'AUDIT',
  'REPORTS',
  'INTERVENTIONS',
];

export interface Permission {
  id: number;
  code: string;
  name: string;
  module: PermissionModule;
  description: string | null;
}
