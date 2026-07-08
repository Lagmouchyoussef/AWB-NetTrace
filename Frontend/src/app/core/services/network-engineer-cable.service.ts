import { Injectable } from '@angular/core';
import {
  Cable,
  CableListParams,
  CablePage,
  CableRequest,
} from '../../roles/super-admin/pages/cables/cable.model';
import { createScopedCrudService } from './scoped-crud.factory';

// No delete() - this role "decommissions" a cable via status (DISCONNECTED) with a mandatory
// reason, never a hard delete. See NetworkEngineerCableController.
@Injectable({ providedIn: 'root' })
export class NetworkEngineerCableService {
  private readonly crud = createScopedCrudService<Cable, CableRequest, CableListParams>(
    '/api/roles/network-engineer/cables',
  );

  list(params: CableListParams): Promise<CablePage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<Cable> {
    return this.crud.getById(id);
  }

  create(request: CableRequest): Promise<Cable> {
    return this.crud.create(request);
  }

  update(id: number, request: CableRequest): Promise<Cable> {
    return this.crud.update(id, request);
  }
}
