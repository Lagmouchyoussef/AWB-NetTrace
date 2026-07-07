import { Injectable } from '@angular/core';
import {
  Datacenter,
  DatacenterListParams,
  DatacenterPage,
  DatacenterRequest,
} from '../../roles/super-admin/pages/datacenters/datacenter.model';
import { createScopedCrudService } from './scoped-crud.factory';

@Injectable({ providedIn: 'root' })
export class DcAdminDatacenterService {
  private readonly crud = createScopedCrudService<Datacenter, DatacenterRequest, DatacenterListParams>(
    '/api/roles/dc-admin/datacenters',
  );

  list(params: DatacenterListParams): Promise<DatacenterPage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<Datacenter> {
    return this.crud.getById(id);
  }

  create(request: DatacenterRequest): Promise<Datacenter> {
    return this.crud.create(request);
  }

  update(id: number, request: DatacenterRequest): Promise<Datacenter> {
    return this.crud.update(id, request);
  }

  delete(id: number): Promise<void> {
    return this.crud.delete(id);
  }
}
