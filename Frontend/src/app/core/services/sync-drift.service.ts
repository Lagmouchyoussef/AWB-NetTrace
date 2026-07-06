import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  SyncDrift,
  SyncDriftListParams,
  SyncDriftPage,
  SyncDriftRequest,
} from '../../roles/super-admin/pages/sync-drifts/sync-drift.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/sync-drifts`;

@Injectable({ providedIn: 'root' })
export class SyncDriftService {
  private readonly http = inject(HttpClient);

  list(params: SyncDriftListParams): Promise<SyncDriftPage> {
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
    if (params.severity) {
      httpParams = httpParams.set('severity', params.severity);
    }
    return firstValueFrom(this.http.get<SyncDriftPage>(BASE_URL, { params: httpParams }));
  }

  getById(id: number): Promise<SyncDrift> {
    return firstValueFrom(this.http.get<SyncDrift>(`${BASE_URL}/${id}`));
  }

  create(request: SyncDriftRequest): Promise<SyncDrift> {
    return firstValueFrom(this.http.post<SyncDrift>(BASE_URL, request));
  }

  update(id: number, request: SyncDriftRequest): Promise<SyncDrift> {
    return firstValueFrom(this.http.put<SyncDrift>(`${BASE_URL}/${id}`, request));
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/${id}`));
  }
}
