import { Injectable } from '@angular/core';
import { Connector, ConnectorListParams, ConnectorPage, ConnectorRequest } from '../../roles/super-admin/pages/connectors/connector.model';
import { createScopedCrudService } from './scoped-crud.factory';

@Injectable({ providedIn: 'root' })
export class DcAdminConnectorService {
  private readonly crud = createScopedCrudService<Connector, ConnectorRequest, ConnectorListParams>(
    '/api/roles/dc-admin/connectors',
  );

  list(params: ConnectorListParams): Promise<ConnectorPage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<Connector> {
    return this.crud.getById(id);
  }

  create(request: ConnectorRequest): Promise<Connector> {
    return this.crud.create(request);
  }

  update(id: number, request: ConnectorRequest): Promise<Connector> {
    return this.crud.update(id, request);
  }

  delete(id: number): Promise<void> {
    return this.crud.delete(id);
  }
}
