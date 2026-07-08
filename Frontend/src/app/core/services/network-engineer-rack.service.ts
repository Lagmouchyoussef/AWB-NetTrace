import { Injectable } from '@angular/core';
import { Rack, RackListParams, RackPage } from '../../roles/super-admin/pages/racks/rack.model';
import { createScopedCrudService } from './scoped-crud.factory';

// Read-only for Network Engineer - see NetworkEngineerDatacenterService.
@Injectable({ providedIn: 'root' })
export class NetworkEngineerRackService {
  private readonly crud = createScopedCrudService<Rack, unknown, RackListParams>(
    '/api/roles/network-engineer/racks',
  );

  list(params: RackListParams): Promise<RackPage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<Rack> {
    return this.crud.getById(id);
  }
}
