import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  SdwanEdge,
  SdwanEdgeListParams,
  SdwanEdgePage,
  SdwanEdgeRequest,
} from '../../roles/super-admin/pages/sdwan-edges/sdwan-edge.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/sdwan-edges`;

@Injectable({ providedIn: 'root' })
export class SdwanEdgeService {
  private readonly http = inject(HttpClient);

  list(params: SdwanEdgeListParams): Promise<SdwanEdgePage> {
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
    if (params.datacenterId) {
      httpParams = httpParams.set('datacenterId', params.datacenterId);
    }
    return firstValueFrom(this.http.get<SdwanEdgePage>(BASE_URL, { params: httpParams }));
  }

  getById(id: number): Promise<SdwanEdge> {
    return firstValueFrom(this.http.get<SdwanEdge>(`${BASE_URL}/${id}`));
  }

  create(request: SdwanEdgeRequest): Promise<SdwanEdge> {
    return firstValueFrom(this.http.post<SdwanEdge>(BASE_URL, request));
  }

  update(id: number, request: SdwanEdgeRequest): Promise<SdwanEdge> {
    return firstValueFrom(this.http.put<SdwanEdge>(`${BASE_URL}/${id}`, request));
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/${id}`));
  }
}
