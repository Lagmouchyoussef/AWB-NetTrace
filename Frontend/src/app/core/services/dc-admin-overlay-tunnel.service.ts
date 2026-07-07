import { Injectable } from '@angular/core';
import {
  OverlayTunnel,
  OverlayTunnelListParams,
  OverlayTunnelPage,
  OverlayTunnelRequest,
} from '../../roles/super-admin/pages/overlay-tunnels/overlay-tunnel.model';
import { createScopedCrudService } from './scoped-crud.factory';

@Injectable({ providedIn: 'root' })
export class DcAdminOverlayTunnelService {
  private readonly crud = createScopedCrudService<
    OverlayTunnel,
    OverlayTunnelRequest,
    OverlayTunnelListParams
  >('/api/roles/dc-admin/overlay-tunnels');

  list(params: OverlayTunnelListParams): Promise<OverlayTunnelPage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<OverlayTunnel> {
    return this.crud.getById(id);
  }

  create(request: OverlayTunnelRequest): Promise<OverlayTunnel> {
    return this.crud.create(request);
  }

  update(id: number, request: OverlayTunnelRequest): Promise<OverlayTunnel> {
    return this.crud.update(id, request);
  }

  delete(id: number): Promise<void> {
    return this.crud.delete(id);
  }
}
