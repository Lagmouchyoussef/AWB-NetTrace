import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Intervention,
  InterventionListParams,
  InterventionPage,
  InterventionRequest,
} from '../../roles/super-admin/pages/interventions/intervention.model';
import { createScopedCrudService } from './scoped-crud.factory';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/dc-admin/interventions`;

@Injectable({ providedIn: 'root' })
export class DcAdminInterventionService {
  private readonly http = inject(HttpClient);

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

  getApprovalQueue(params: { page: number; size: number }): Promise<InterventionPage> {
    return firstValueFrom(
      this.http.get<InterventionPage>(`${BASE_URL}/approval-queue`, { params }),
    );
  }

  approve(id: number): Promise<Intervention> {
    return firstValueFrom(this.http.post<Intervention>(`${BASE_URL}/${id}/approve`, {}));
  }

  reject(id: number, comment: string): Promise<Intervention> {
    return firstValueFrom(
      this.http.post<Intervention>(`${BASE_URL}/${id}/reject`, { comment }),
    );
  }
}
