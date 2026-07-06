import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Report,
  ReportListParams,
  ReportPage,
  ReportRequest,
} from '../../roles/super-admin/pages/reports/report.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/reports`;

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly http = inject(HttpClient);

  list(params: ReportListParams): Promise<ReportPage> {
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
    if (params.reportType) {
      httpParams = httpParams.set('reportType', params.reportType);
    }
    return firstValueFrom(this.http.get<ReportPage>(BASE_URL, { params: httpParams }));
  }

  getById(id: number): Promise<Report> {
    return firstValueFrom(this.http.get<Report>(`${BASE_URL}/${id}`));
  }

  create(request: ReportRequest): Promise<Report> {
    return firstValueFrom(this.http.post<Report>(BASE_URL, request));
  }

  update(id: number, request: ReportRequest): Promise<Report> {
    return firstValueFrom(this.http.put<Report>(`${BASE_URL}/${id}`, request));
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/${id}`));
  }
}
