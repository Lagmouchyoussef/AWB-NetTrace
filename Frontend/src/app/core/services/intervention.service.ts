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

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/interventions`;

@Injectable({ providedIn: 'root' })
export class InterventionService {
  private readonly http = inject(HttpClient);

  list(params: InterventionListParams): Promise<InterventionPage> {
    let httpParams = new HttpParams().set('page', params.page).set('size', params.size);
    if (params.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }
    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }
    if (params.priority) {
      httpParams = httpParams.set('priority', params.priority);
    }
    return firstValueFrom(this.http.get<InterventionPage>(BASE_URL, { params: httpParams }));
  }

  getById(id: number): Promise<Intervention> {
    return firstValueFrom(this.http.get<Intervention>(`${BASE_URL}/${id}`));
  }

  create(request: InterventionRequest): Promise<Intervention> {
    return firstValueFrom(this.http.post<Intervention>(BASE_URL, request));
  }

  update(id: number, request: InterventionRequest): Promise<Intervention> {
    return firstValueFrom(this.http.put<Intervention>(`${BASE_URL}/${id}`, request));
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/${id}`));
  }
}
