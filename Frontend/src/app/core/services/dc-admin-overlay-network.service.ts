import { Injectable } from '@angular/core';
import {
  OverlayNetwork,
  OverlayNetworkListParams,
  OverlayNetworkPage,
  OverlayNetworkRequest,
} from '../../roles/super-admin/pages/overlay-networks/overlay-network.model';
import { createScopedCrudService } from './scoped-crud.factory';

// Read-only: the backend controller only exposes GET (list + detail) - POST/PUT/DELETE were
// removed, so no create/update/delete methods here.
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
}
