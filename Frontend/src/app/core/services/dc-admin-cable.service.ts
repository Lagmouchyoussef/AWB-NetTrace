import { Injectable } from '@angular/core';
import { Cable, CableListParams, CablePage, CableRequest } from '../../roles/super-admin/pages/cables/cable.model';
import { createScopedCrudService } from './scoped-crud.factory';

@Injectable({ providedIn: 'root' })
export class DcAdminCableService {
  private readonly crud = createScopedCrudService<Cable, CableRequest, CableListParams>(
    '/api/roles/dc-admin/cables',
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

  delete(id: number): Promise<void> {
    return this.crud.delete(id);
  }
}
