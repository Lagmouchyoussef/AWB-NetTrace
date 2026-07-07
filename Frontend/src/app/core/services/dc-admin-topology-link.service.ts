import { Injectable } from '@angular/core';
import {
  TopologyLink,
  TopologyLinkListParams,
  TopologyLinkPage,
  TopologyLinkRequest,
} from '../../roles/super-admin/pages/topology-links/topology-link.model';
import { createScopedCrudService } from './scoped-crud.factory';

@Injectable({ providedIn: 'root' })
export class DcAdminTopologyLinkService {
  private readonly crud = createScopedCrudService<
    TopologyLink,
    TopologyLinkRequest,
    TopologyLinkListParams
  >('/api/roles/dc-admin/topology-links');

  list(params: TopologyLinkListParams): Promise<TopologyLinkPage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<TopologyLink> {
    return this.crud.getById(id);
  }

  create(request: TopologyLinkRequest): Promise<TopologyLink> {
    return this.crud.create(request);
  }

  update(id: number, request: TopologyLinkRequest): Promise<TopologyLink> {
    return this.crud.update(id, request);
  }

  delete(id: number): Promise<void> {
    return this.crud.delete(id);
  }
}
