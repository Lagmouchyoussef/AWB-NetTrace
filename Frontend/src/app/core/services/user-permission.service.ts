import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PermissionModule } from '../../roles/super-admin/pages/role-permissions/permission.model';
import {
  EffectiveModulePermission,
  UserPermissionOverrideRequest,
} from '../../roles/super-admin/pages/users/user-permission.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/users`;

@Injectable({ providedIn: 'root' })
export class UserPermissionService {
  private readonly http = inject(HttpClient);

  getEffectivePermissions(userId: number): Promise<EffectiveModulePermission[]> {
    return firstValueFrom(
      this.http.get<EffectiveModulePermission[]>(`${BASE_URL}/${userId}/permissions`),
    );
  }

  setOverride(
    userId: number,
    module: PermissionModule,
    request: UserPermissionOverrideRequest,
  ): Promise<EffectiveModulePermission> {
    return firstValueFrom(
      this.http.put<EffectiveModulePermission>(
        `${BASE_URL}/${userId}/permissions/${module}`,
        request,
      ),
    );
  }

  clearOverride(userId: number, module: PermissionModule): Promise<EffectiveModulePermission> {
    return firstValueFrom(
      this.http.delete<EffectiveModulePermission>(`${BASE_URL}/${userId}/permissions/${module}`),
    );
  }
}
