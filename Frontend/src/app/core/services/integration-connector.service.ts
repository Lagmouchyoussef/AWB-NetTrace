import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  IntegrationConnector,
  IntegrationConnectorListParams,
  IntegrationConnectorPage,
  IntegrationConnectorRequest,
} from '../../roles/super-admin/pages/integration-connectors/integration-connector.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/integration-connectors`;

@Injectable({ providedIn: 'root' })
export class IntegrationConnectorService {
  private readonly http = inject(HttpClient);

  list(params: IntegrationConnectorListParams): Promise<IntegrationConnectorPage> {
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
    return firstValueFrom(
      this.http.get<IntegrationConnectorPage>(BASE_URL, { params: httpParams }),
    );
  }

  getById(id: number): Promise<IntegrationConnector> {
    return firstValueFrom(this.http.get<IntegrationConnector>(`${BASE_URL}/${id}`));
  }

  create(request: IntegrationConnectorRequest): Promise<IntegrationConnector> {
    return firstValueFrom(this.http.post<IntegrationConnector>(BASE_URL, request));
  }

  update(id: number, request: IntegrationConnectorRequest): Promise<IntegrationConnector> {
    return firstValueFrom(this.http.put<IntegrationConnector>(`${BASE_URL}/${id}`, request));
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/${id}`));
  }
}
