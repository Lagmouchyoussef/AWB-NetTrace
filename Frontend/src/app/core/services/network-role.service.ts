import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  NetworkRole,
  NetworkRoleListParams,
  NetworkRolePage,
  NetworkRoleRequest,
} from '../../roles/super-admin/pages/network-roles/network-role.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/network-roles`;

@Injectable({ providedIn: 'root' })
export class NetworkRoleService {
  private readonly http = inject(HttpClient);

  list(params: NetworkRoleListParams): Promise<NetworkRolePage> {
    let httpParams = new HttpParams().set('page', params.page).set('size', params.size);
    if (params.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }
    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }
    return firstValueFrom(this.http.get<NetworkRolePage>(BASE_URL, { params: httpParams }));
  }

  getById(id: number): Promise<NetworkRole> {
    return firstValueFrom(this.http.get<NetworkRole>(`${BASE_URL}/${id}`));
  }

  create(request: NetworkRoleRequest): Promise<NetworkRole> {
    return firstValueFrom(this.http.post<NetworkRole>(BASE_URL, request));
  }

  update(id: number, request: NetworkRoleRequest): Promise<NetworkRole> {
    return firstValueFrom(this.http.put<NetworkRole>(`${BASE_URL}/${id}`, request));
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/${id}`));
  }
}
