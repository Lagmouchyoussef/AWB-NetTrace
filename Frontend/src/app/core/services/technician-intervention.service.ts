import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Intervention,
  InterventionListParams,
  InterventionPage,
} from '../../roles/super-admin/pages/interventions/intervention.model';
import { RackElevation } from '../../roles/technician/technician-execution.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/technician/interventions`;

// Read (hard-scoped server-side to interventions assigned to the caller; getById 404s rather
// than 403s on someone else's record) plus the two status transitions this role is allowed to
// make: start (SCHEDULED -> IN_PROGRESS) and complete (IN_PROGRESS -> COMPLETED, server-rejected
// unless every checklist step is done). No create/update/delete/approve - a technician executes
// assigned work, they don't manage the intervention record itself. See
// TechnicianInterventionController.
@Injectable({ providedIn: 'root' })
export class TechnicianInterventionService {
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

  getById(id: number): Promise<Intervention> {
    return firstValueFrom(this.http.get<Intervention>(`${BASE_URL}/${id}`));
  }

  getRackElevation(id: number): Promise<RackElevation> {
    return firstValueFrom(this.http.get<RackElevation>(`${BASE_URL}/${id}/rack-elevation`));
  }

  start(id: number): Promise<Intervention> {
    return firstValueFrom(this.http.patch<Intervention>(`${BASE_URL}/${id}/start`, {}));
  }

  complete(id: number): Promise<Intervention> {
    return firstValueFrom(this.http.patch<Intervention>(`${BASE_URL}/${id}/complete`, {}));
  }
}
