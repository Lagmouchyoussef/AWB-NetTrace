import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  RolePermission,
  RolePermissionListParams,
  RolePermissionPage,
  RolePermissionRequest,
} from '../../roles/super-admin/pages/role-permissions/role-permission.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/role-permissions`;

@Injectable({ providedIn: 'root' })
export class RolePermissionService {
  private readonly http = inject(HttpClient);

  list(params: RolePermissionListParams): Promise<RolePermissionPage> {
    let httpParams = new HttpParams().set('page', params.page).set('size', params.size);
    if (params.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }
    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.role) {
      httpParams = httpParams.set('role', params.role);
    }
    return firstValueFrom(this.http.get<RolePermissionPage>(BASE_URL, { params: httpParams }));
  }

  getById(id: number): Promise<RolePermission> {
    return firstValueFrom(this.http.get<RolePermission>(`${BASE_URL}/${id}`));
  }

  create(request: RolePermissionRequest): Promise<RolePermission> {
    return firstValueFrom(this.http.post<RolePermission>(BASE_URL, request));
  }

  update(id: number, request: RolePermissionRequest): Promise<RolePermission> {
    return firstValueFrom(this.http.put<RolePermission>(`${BASE_URL}/${id}`, request));
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/${id}`));
  }
}
