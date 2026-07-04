import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  TopologyLink,
  TopologyLinkListParams,
  TopologyLinkPage,
  TopologyLinkRequest,
} from '../../roles/super-admin/pages/topology-links/topology-link.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/topology-links`;

@Injectable({ providedIn: 'root' })
export class TopologyLinkService {
  private readonly http = inject(HttpClient);

  list(params: TopologyLinkListParams): Promise<TopologyLinkPage> {
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
    return firstValueFrom(this.http.get<TopologyLinkPage>(BASE_URL, { params: httpParams }));
  }

  getById(id: number): Promise<TopologyLink> {
    return firstValueFrom(this.http.get<TopologyLink>(`${BASE_URL}/${id}`));
  }

  create(request: TopologyLinkRequest): Promise<TopologyLink> {
    return firstValueFrom(this.http.post<TopologyLink>(BASE_URL, request));
  }

  update(id: number, request: TopologyLinkRequest): Promise<TopologyLink> {
    return firstValueFrom(this.http.put<TopologyLink>(`${BASE_URL}/${id}`, request));
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/${id}`));
  }
}
