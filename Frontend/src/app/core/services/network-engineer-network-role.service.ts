import { Injectable } from '@angular/core';
import {
  NetworkRole,
  NetworkRoleListParams,
  NetworkRolePage,
  NetworkRoleRequest,
} from '../../roles/super-admin/pages/network-roles/network-role.model';
import { createScopedCrudService } from './scoped-crud.factory';

// No delete() - decommission via status. See NetworkEngineerNetworkRoleController.
@Injectable({ providedIn: 'root' })
export class NetworkEngineerNetworkRoleService {
  private readonly crud = createScopedCrudService<
    NetworkRole,
    NetworkRoleRequest,
    NetworkRoleListParams
  >('/api/roles/network-engineer/network-roles');

  list(params: NetworkRoleListParams): Promise<NetworkRolePage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<NetworkRole> {
    return this.crud.getById(id);
  }

  create(request: NetworkRoleRequest): Promise<NetworkRole> {
    return this.crud.create(request);
  }

  update(id: number, request: NetworkRoleRequest): Promise<NetworkRole> {
    return this.crud.update(id, request);
  }
}
