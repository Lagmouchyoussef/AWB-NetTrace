import { Injectable } from '@angular/core';
import {
  RolePermission,
  RolePermissionListParams,
  RolePermissionPage,
} from '../../roles/super-admin/pages/role-permissions/role-permission.model';
import { createScopedCrudService } from './scoped-crud.factory';

// Privilege review - read-only, no create/update/delete mapping on the backend (see
// AuditorRolePermissionController).
@Injectable({ providedIn: 'root' })
export class AuditorRolePermissionService {
  private readonly crud = createScopedCrudService<
    RolePermission,
    never,
    RolePermissionListParams
  >('/api/roles/auditor/role-permissions');

  list(params: RolePermissionListParams): Promise<RolePermissionPage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<RolePermission> {
    return this.crud.getById(id);
  }
}
