import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AppUser,
  AppUserListParams,
  AppUserPage,
  AppUserRequest,
} from '../../roles/super-admin/pages/users/user.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/users`;

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private readonly http = inject(HttpClient);

  list(params: AppUserListParams): Promise<AppUserPage> {
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
    return firstValueFrom(this.http.get<AppUserPage>(BASE_URL, { params: httpParams }));
  }

  getById(id: number): Promise<AppUser> {
    return firstValueFrom(this.http.get<AppUser>(`${BASE_URL}/${id}`));
  }

  create(request: AppUserRequest): Promise<AppUser> {
    return firstValueFrom(this.http.post<AppUser>(BASE_URL, request));
  }

  update(id: number, request: AppUserRequest): Promise<AppUser> {
    return firstValueFrom(this.http.put<AppUser>(`${BASE_URL}/${id}`, request));
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/${id}`));
  }
}
