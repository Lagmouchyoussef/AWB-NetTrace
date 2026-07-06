import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuditLog,
  AuditLogListParams,
  AuditLogPage,
  AuditLogRequest,
} from '../../roles/super-admin/pages/audit-logs/audit-log.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/audit-logs`;

@Injectable({ providedIn: 'root' })
export class AuditLogService {
  private readonly http = inject(HttpClient);

  list(params: AuditLogListParams): Promise<AuditLogPage> {
    let httpParams = new HttpParams().set('page', params.page).set('size', params.size);
    if (params.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }
    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.action) {
      httpParams = httpParams.set('action', params.action);
    }
    return firstValueFrom(this.http.get<AuditLogPage>(BASE_URL, { params: httpParams }));
  }

  getById(id: number): Promise<AuditLog> {
    return firstValueFrom(this.http.get<AuditLog>(`${BASE_URL}/${id}`));
  }

  create(request: AuditLogRequest): Promise<AuditLog> {
    return firstValueFrom(this.http.post<AuditLog>(BASE_URL, request));
  }

  update(id: number, request: AuditLogRequest): Promise<AuditLog> {
    return firstValueFrom(this.http.put<AuditLog>(`${BASE_URL}/${id}`, request));
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/${id}`));
  }
}
