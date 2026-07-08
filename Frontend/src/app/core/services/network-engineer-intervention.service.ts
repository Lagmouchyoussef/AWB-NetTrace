import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Intervention,
  InterventionListParams,
  InterventionPage,
  InterventionRequest,
} from '../../roles/super-admin/pages/interventions/intervention.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/network-engineer/interventions`;

// Only list (hard-scoped server-side to the caller's own requests) and create - this role can
// only submit requests and track them personally, never approve/reject/edit/delete. See
// NetworkEngineerInterventionController.
@Injectable({ providedIn: 'root' })
export class NetworkEngineerInterventionService {
  private readonly http = inject(HttpClient);

  list(params: InterventionListParams): Promise<InterventionPage> {
    let httpParams = new HttpParams();
    for (const [key, value] of Object.entries(params as unknown as Record<string, unknown>)) {
      if ((typeof value === 'string' && value !== '') || typeof value === 'number') {
        httpParams = httpParams.set(key, value);
      }
    }
    return firstValueFrom(this.http.get<InterventionPage>(BASE_URL, { params: httpParams }));
  }

  create(request: InterventionRequest): Promise<Intervention> {
    return firstValueFrom(this.http.post<Intervention>(BASE_URL, request));
  }
}
