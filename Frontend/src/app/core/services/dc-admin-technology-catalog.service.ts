import { Injectable } from '@angular/core';
import {
  TechnologyCatalogEntry,
  TechnologyCatalogListParams,
  TechnologyCatalogPage,
  TechnologyCatalogRequest,
} from '../../roles/super-admin/pages/technology-catalog/technology-catalog-entry.model';
import { createScopedCrudService } from './scoped-crud.factory';

@Injectable({ providedIn: 'root' })
export class DcAdminTechnologyCatalogService {
  private readonly crud = createScopedCrudService<
    TechnologyCatalogEntry,
    TechnologyCatalogRequest,
    TechnologyCatalogListParams
  >('/api/roles/dc-admin/technology-catalog');

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

  delete(id: number): Promise<void> {
    return this.crud.delete(id);
  }
}
