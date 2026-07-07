import { Injectable } from '@angular/core';
import {
  OverlayNetwork,
  OverlayNetworkListParams,
  OverlayNetworkPage,
  OverlayNetworkRequest,
} from '../../roles/super-admin/pages/overlay-networks/overlay-network.model';
import { createScopedCrudService } from './scoped-crud.factory';

@Injectable({ providedIn: 'root' })
export class DcAdminOverlayNetworkService {
  private readonly crud = createScopedCrudService<
    OverlayNetwork,
    OverlayNetworkRequest,
    OverlayNetworkListParams
  >('/api/roles/dc-admin/overlay-networks');

  list(params: OverlayNetworkListParams): Promise<OverlayNetworkPage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<OverlayNetwork> {
    return this.crud.getById(id);
  }

  create(request: OverlayNetworkRequest): Promise<OverlayNetwork> {
    return this.crud.create(request);
  }

  update(id: number, request: OverlayNetworkRequest): Promise<OverlayNetwork> {
    return this.crud.update(id, request);
  }

  delete(id: number): Promise<void> {
    return this.crud.delete(id);
  }
}
