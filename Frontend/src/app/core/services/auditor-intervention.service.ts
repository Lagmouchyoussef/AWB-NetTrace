import { Injectable } from '@angular/core';
import {
  Intervention,
  InterventionListParams,
  InterventionPage,
} from '../../roles/super-admin/pages/interventions/intervention.model';
import { createScopedCrudService } from './scoped-crud.factory';

// Read-only, unscoped trail across every intervention regardless of status/decision - the
// backend controller has no create/update/delete mapping at all (see
// AuditorInterventionController).
@Injectable({ providedIn: 'root' })
export class AuditorInterventionService {
  private readonly crud = createScopedCrudService<Intervention, never, InterventionListParams>(
    '/api/roles/auditor/interventions',
  );

  list(params: InterventionListParams): Promise<InterventionPage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<Intervention> {
    return this.crud.getById(id);
  }
}
