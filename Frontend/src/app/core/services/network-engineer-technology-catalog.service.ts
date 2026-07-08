import { Injectable } from '@angular/core';
import {
  TechnologyCatalogEntry,
  TechnologyCatalogListParams,
  TechnologyCatalogPage,
  TechnologyCatalogRequest,
} from '../../roles/super-admin/pages/technology-catalog/technology-catalog-entry.model';
import { createScopedCrudService } from './scoped-crud.factory';

// No delete() - decommission via status. See NetworkEngineerTechnologyCatalogController.
@Injectable({ providedIn: 'root' })
export class NetworkEngineerTechnologyCatalogService {
  private readonly crud = createScopedCrudService<
    TechnologyCatalogEntry,
    TechnologyCatalogRequest,
    TechnologyCatalogListParams
  >('/api/roles/network-engineer/technology-catalog');

  list(params: TechnologyCatalogListParams): Promise<TechnologyCatalogPage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<TechnologyCatalogEntry> {
    return this.crud.getById(id);
  }

  create(request: TechnologyCatalogRequest): Promise<TechnologyCatalogEntry> {
    return this.crud.create(request);
  }

  update(id: number, request: TechnologyCatalogRequest): Promise<TechnologyCatalogEntry> {
    return this.crud.update(id, request);
  }
}
