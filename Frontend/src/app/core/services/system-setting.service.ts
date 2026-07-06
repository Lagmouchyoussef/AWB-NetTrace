import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  SystemSetting,
  SystemSettingListParams,
  SystemSettingPage,
  SystemSettingRequest,
} from '../../roles/super-admin/pages/system-settings/system-setting.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/system-settings`;

@Injectable({ providedIn: 'root' })
export class SystemSettingService {
  private readonly http = inject(HttpClient);

  list(params: SystemSettingListParams): Promise<SystemSettingPage> {
    let httpParams = new HttpParams().set('page', params.page).set('size', params.size);
    if (params.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }
    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.category) {
      httpParams = httpParams.set('category', params.category);
    }
    return firstValueFrom(this.http.get<SystemSettingPage>(BASE_URL, { params: httpParams }));
  }

  getById(id: number): Promise<SystemSetting> {
    return firstValueFrom(this.http.get<SystemSetting>(`${BASE_URL}/${id}`));
  }

  create(request: SystemSettingRequest): Promise<SystemSetting> {
    return firstValueFrom(this.http.post<SystemSetting>(BASE_URL, request));
  }

  update(id: number, request: SystemSettingRequest): Promise<SystemSetting> {
    return firstValueFrom(this.http.put<SystemSetting>(`${BASE_URL}/${id}`, request));
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/${id}`));
  }
}
