import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Connector,
  ConnectorListParams,
  ConnectorPage,
  ConnectorRequest,
} from '../../roles/super-admin/pages/connectors/connector.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/connectors`;

@Injectable({ providedIn: 'root' })
export class ConnectorService {
  private readonly http = inject(HttpClient);

  list(params: ConnectorListParams): Promise<ConnectorPage> {
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
    return firstValueFrom(this.http.get<ConnectorPage>(BASE_URL, { params: httpParams }));
  }

  getById(id: number): Promise<Connector> {
    return firstValueFrom(this.http.get<Connector>(`${BASE_URL}/${id}`));
  }

  create(request: ConnectorRequest): Promise<Connector> {
    return firstValueFrom(this.http.post<Connector>(BASE_URL, request));
  }

  update(id: number, request: ConnectorRequest): Promise<Connector> {
    return firstValueFrom(this.http.put<Connector>(`${BASE_URL}/${id}`, request));
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/${id}`));
  }
}
