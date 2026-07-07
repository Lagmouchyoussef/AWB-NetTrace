import { Injectable } from '@angular/core';
import {
  TelemetryConnector,
  TelemetryConnectorListParams,
  TelemetryConnectorPage,
  TelemetryConnectorRequest,
} from '../../roles/super-admin/pages/telemetry-connectors/telemetry-connector.model';
import { createScopedCrudService } from './scoped-crud.factory';

@Injectable({ providedIn: 'root' })
export class DcAdminTelemetryConnectorService {
  private readonly crud = createScopedCrudService<
    TelemetryConnector,
    TelemetryConnectorRequest,
    TelemetryConnectorListParams
  >('/api/roles/dc-admin/telemetry-connectors');

  list(params: TelemetryConnectorListParams): Promise<TelemetryConnectorPage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<TelemetryConnector> {
    return this.crud.getById(id);
  }

  create(request: TelemetryConnectorRequest): Promise<TelemetryConnector> {
    return this.crud.create(request);
  }

  update(id: number, request: TelemetryConnectorRequest): Promise<TelemetryConnector> {
    return this.crud.update(id, request);
  }

  delete(id: number): Promise<void> {
    return this.crud.delete(id);
  }
}
