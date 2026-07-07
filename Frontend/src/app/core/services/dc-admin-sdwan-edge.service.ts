import { Injectable } from '@angular/core';
import {
  SdwanEdge,
  SdwanEdgeListParams,
  SdwanEdgePage,
  SdwanEdgeRequest,
} from '../../roles/super-admin/pages/sdwan-edges/sdwan-edge.model';
import { createScopedCrudService } from './scoped-crud.factory';

@Injectable({ providedIn: 'root' })
export class DcAdminSdwanEdgeService {
  private readonly crud = createScopedCrudService<SdwanEdge, SdwanEdgeRequest, SdwanEdgeListParams>(
    '/api/roles/dc-admin/sdwan-edges',
  );

  list(params: SdwanEdgeListParams): Promise<SdwanEdgePage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<SdwanEdge> {
    return this.crud.getById(id);
  }

  create(request: SdwanEdgeRequest): Promise<SdwanEdge> {
    return this.crud.create(request);
  }

  update(id: number, request: SdwanEdgeRequest): Promise<SdwanEdge> {
    return this.crud.update(id, request);
  }

  delete(id: number): Promise<void> {
    return this.crud.delete(id);
  }
}
