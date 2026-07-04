import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  PathTrace,
  PathTraceListParams,
  PathTracePage,
  PathTraceRequest,
} from '../../roles/super-admin/pages/path-traces/path-trace.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/path-traces`;

@Injectable({ providedIn: 'root' })
export class PathTraceService {
  private readonly http = inject(HttpClient);

  list(params: PathTraceListParams): Promise<PathTracePage> {
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
    return firstValueFrom(this.http.get<PathTracePage>(BASE_URL, { params: httpParams }));
  }

  getById(id: number): Promise<PathTrace> {
    return firstValueFrom(this.http.get<PathTrace>(`${BASE_URL}/${id}`));
  }

  create(request: PathTraceRequest): Promise<PathTrace> {
    return firstValueFrom(this.http.post<PathTrace>(BASE_URL, request));
  }

  update(id: number, request: PathTraceRequest): Promise<PathTrace> {
    return firstValueFrom(this.http.put<PathTrace>(`${BASE_URL}/${id}`, request));
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/${id}`));
  }
}
