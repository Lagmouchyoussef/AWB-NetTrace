import { Injectable } from '@angular/core';
import { Rack, RackListParams, RackPage, RackRequest } from '../../roles/super-admin/pages/racks/rack.model';
import { createScopedCrudService } from './scoped-crud.factory';

@Injectable({ providedIn: 'root' })
export class DcAdminRackService {
  private readonly crud = createScopedCrudService<Rack, RackRequest, RackListParams>(
    '/api/roles/dc-admin/racks',
  );

  list(params: RackListParams): Promise<RackPage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<Rack> {
    return this.crud.getById(id);
  }

  create(request: RackRequest): Promise<Rack> {
    return this.crud.create(request);
  }

  update(id: number, request: RackRequest): Promise<Rack> {
    return this.crud.update(id, request);
  }

  delete(id: number): Promise<void> {
    return this.crud.delete(id);
  }
}
