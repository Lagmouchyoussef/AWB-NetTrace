import { Injectable } from '@angular/core';
import {
  OverlayTunnel,
  OverlayTunnelListParams,
  OverlayTunnelPage,
  OverlayTunnelRequest,
} from '../../roles/super-admin/pages/overlay-tunnels/overlay-tunnel.model';
import { createScopedCrudService } from './scoped-crud.factory';

// No delete() - decommission via status. See NetworkEngineerOverlayTunnelController.
@Injectable({ providedIn: 'root' })
export class NetworkEngineerOverlayTunnelService {
  private readonly crud = createScopedCrudService<
    OverlayTunnel,
    OverlayTunnelRequest,
    OverlayTunnelListParams
  >('/api/roles/network-engineer/overlay-tunnels');

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
}
