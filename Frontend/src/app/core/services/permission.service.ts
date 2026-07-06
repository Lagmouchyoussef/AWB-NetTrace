import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Permission } from '../../roles/super-admin/pages/role-permissions/permission.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/permissions`;

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly http = inject(HttpClient);

  list(): Promise<Permission[]> {
    return firstValueFrom(this.http.get<Permission[]>(BASE_URL));
  }
}
