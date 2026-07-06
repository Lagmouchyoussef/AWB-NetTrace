import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  TelemetryConnector,
  TelemetryConnectorListParams,
  TelemetryConnectorPage,
  TelemetryConnectorRequest,
} from '../../roles/super-admin/pages/telemetry-connectors/telemetry-connector.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/telemetry-connectors`;

@Injectable({ providedIn: 'root' })
export class TelemetryConnectorService {
  private readonly http = inject(HttpClient);

  list(params: TelemetryConnectorListParams): Promise<TelemetryConnectorPage> {
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
    return firstValueFrom(this.http.get<TelemetryConnectorPage>(BASE_URL, { params: httpParams }));
  }

  getById(id: number): Promise<TelemetryConnector> {
    return firstValueFrom(this.http.get<TelemetryConnector>(`${BASE_URL}/${id}`));
  }

  create(request: TelemetryConnectorRequest): Promise<TelemetryConnector> {
    return firstValueFrom(this.http.post<TelemetryConnector>(BASE_URL, request));
  }

  update(id: number, request: TelemetryConnectorRequest): Promise<TelemetryConnector> {
    return firstValueFrom(this.http.put<TelemetryConnector>(`${BASE_URL}/${id}`, request));
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/${id}`));
  }
}
