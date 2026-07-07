import { PermissionModule } from '../role-permissions/permission.model';

export interface EffectiveModulePermission {
  module: PermissionModule;
  defaultAllowed: boolean;
  roleGranted: boolean | null;
  userOverrideGranted: boolean | null;
  effective: boolean;
}

export interface UserPermissionOverrideRequest {
  granted: boolean;
  notes?: string | null;
}
