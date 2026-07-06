import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  OverlayTunnel,
  OverlayTunnelListParams,
  OverlayTunnelPage,
  OverlayTunnelRequest,
} from '../../roles/super-admin/pages/overlay-tunnels/overlay-tunnel.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/overlay-tunnels`;

@Injectable({ providedIn: 'root' })
export class OverlayTunnelService {
  private readonly http = inject(HttpClient);

  list(params: OverlayTunnelListParams): Promise<OverlayTunnelPage> {
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
    return firstValueFrom(this.http.get<OverlayTunnelPage>(BASE_URL, { params: httpParams }));
  }

  getById(id: number): Promise<OverlayTunnel> {
    return firstValueFrom(this.http.get<OverlayTunnel>(`${BASE_URL}/${id}`));
  }

  create(request: OverlayTunnelRequest): Promise<OverlayTunnel> {
    return firstValueFrom(this.http.post<OverlayTunnel>(BASE_URL, request));
  }

  update(id: number, request: OverlayTunnelRequest): Promise<OverlayTunnel> {
    return firstValueFrom(this.http.put<OverlayTunnel>(`${BASE_URL}/${id}`, request));
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/${id}`));
  }
}
