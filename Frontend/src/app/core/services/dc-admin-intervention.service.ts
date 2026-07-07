import { Injectable } from '@angular/core';
import {
  Intervention,
  InterventionListParams,
  InterventionPage,
  InterventionRequest,
} from '../../roles/super-admin/pages/interventions/intervention.model';
import { createScopedCrudService } from './scoped-crud.factory';

@Injectable({ providedIn: 'root' })
export class DcAdminInterventionService {
  private readonly crud = createScopedCrudService<
    Intervention,
    InterventionRequest,
    InterventionListParams
  >('/api/roles/dc-admin/interventions');

  list(params: InterventionListParams): Promise<InterventionPage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<Intervention> {
    return this.crud.getById(id);
  }

  create(request: InterventionRequest): Promise<Intervention> {
    return this.crud.create(request);
  }

  update(id: number, request: InterventionRequest): Promise<Intervention> {
    return this.crud.update(id, request);
  }

  delete(id: number): Promise<void> {
    return this.crud.delete(id);
  }
}
