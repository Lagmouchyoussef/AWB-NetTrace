import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  OverlayNetwork,
  OverlayNetworkListParams,
  OverlayNetworkPage,
  OverlayNetworkRequest,
} from '../../roles/super-admin/pages/overlay-networks/overlay-network.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/overlay-networks`;

@Injectable({ providedIn: 'root' })
export class OverlayNetworkService {
  private readonly http = inject(HttpClient);

  list(params: OverlayNetworkListParams): Promise<OverlayNetworkPage> {
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
    return firstValueFrom(this.http.get<OverlayNetworkPage>(BASE_URL, { params: httpParams }));
  }

  getById(id: number): Promise<OverlayNetwork> {
    return firstValueFrom(this.http.get<OverlayNetwork>(`${BASE_URL}/${id}`));
  }

  create(request: OverlayNetworkRequest): Promise<OverlayNetwork> {
    return firstValueFrom(this.http.post<OverlayNetwork>(BASE_URL, request));
  }

  update(id: number, request: OverlayNetworkRequest): Promise<OverlayNetwork> {
    return firstValueFrom(this.http.put<OverlayNetwork>(`${BASE_URL}/${id}`, request));
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/${id}`));
  }
}
