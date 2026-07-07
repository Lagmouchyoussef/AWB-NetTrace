import { Injectable } from '@angular/core';
import { PathTrace, PathTraceListParams, PathTracePage, PathTraceRequest } from '../../roles/super-admin/pages/path-traces/path-trace.model';
import { createScopedCrudService } from './scoped-crud.factory';

@Injectable({ providedIn: 'root' })
export class DcAdminPathTraceService {
  private readonly crud = createScopedCrudService<PathTrace, PathTraceRequest, PathTraceListParams>(
    '/api/roles/dc-admin/path-traces',
  );

  list(params: PathTraceListParams): Promise<PathTracePage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<PathTrace> {
    return this.crud.getById(id);
  }

  create(request: PathTraceRequest): Promise<PathTrace> {
    return this.crud.create(request);
  }

  update(id: number, request: PathTraceRequest): Promise<PathTrace> {
    return this.crud.update(id, request);
  }

  delete(id: number): Promise<void> {
    return this.crud.delete(id);
  }
}
