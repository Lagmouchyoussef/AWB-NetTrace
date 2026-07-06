import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  RealTimeDashboard,
  RealTimeDashboardListParams,
  RealTimeDashboardPage,
  RealTimeDashboardRequest,
} from '../../roles/super-admin/pages/real-time-dashboards/real-time-dashboard.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/real-time-dashboards`;

@Injectable({ providedIn: 'root' })
export class RealTimeDashboardService {
  private readonly http = inject(HttpClient);

  list(params: RealTimeDashboardListParams): Promise<RealTimeDashboardPage> {
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
    return firstValueFrom(this.http.get<RealTimeDashboardPage>(BASE_URL, { params: httpParams }));
  }

  getById(id: number): Promise<RealTimeDashboard> {
    return firstValueFrom(this.http.get<RealTimeDashboard>(`${BASE_URL}/${id}`));
  }

  create(request: RealTimeDashboardRequest): Promise<RealTimeDashboard> {
    return firstValueFrom(this.http.post<RealTimeDashboard>(BASE_URL, request));
  }

  update(id: number, request: RealTimeDashboardRequest): Promise<RealTimeDashboard> {
    return firstValueFrom(this.http.put<RealTimeDashboard>(`${BASE_URL}/${id}`, request));
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/${id}`));
  }
}
