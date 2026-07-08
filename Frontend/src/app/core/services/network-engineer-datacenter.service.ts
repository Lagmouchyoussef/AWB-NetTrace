import { Injectable } from '@angular/core';
import {
  Datacenter,
  DatacenterListParams,
  DatacenterPage,
} from '../../roles/super-admin/pages/datacenters/datacenter.model';
import { createScopedCrudService } from './scoped-crud.factory';

// Read-only for Network Engineer (this role places devices, it doesn't create sites) - only
// list/getById are exposed even though the underlying endpoint supports full CRUD.
@Injectable({ providedIn: 'root' })
export class NetworkEngineerDatacenterService {
  private readonly crud = createScopedCrudService<Datacenter, unknown, DatacenterListParams>(
    '/api/roles/network-engineer/datacenters',
  );

  list(params: DatacenterListParams): Promise<DatacenterPage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<Datacenter> {
    return this.crud.getById(id);
  }
}
