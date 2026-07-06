import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AiInsight,
  AiInsightActionRequest,
  AiInsightListParams,
  AiInsightPage,
} from '../../roles/super-admin/pages/ai-insights/ai-insight.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/ai/insights`;

@Injectable({ providedIn: 'root' })
export class AiInsightService {
  private readonly http = inject(HttpClient);

  list(params: AiInsightListParams): Promise<AiInsightPage> {
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
    if (params.severity) {
      httpParams = httpParams.set('severity', params.severity);
    }
    return firstValueFrom(this.http.get<AiInsightPage>(BASE_URL, { params: httpParams }));
  }

  getById(id: number): Promise<AiInsight> {
    return firstValueFrom(this.http.get<AiInsight>(`${BASE_URL}/${id}`));
  }

  acknowledge(id: number, request: AiInsightActionRequest = {}): Promise<AiInsight> {
    return firstValueFrom(this.http.patch<AiInsight>(`${BASE_URL}/${id}/acknowledge`, request));
  }

  dismiss(id: number, request: AiInsightActionRequest = {}): Promise<AiInsight> {
    return firstValueFrom(this.http.patch<AiInsight>(`${BASE_URL}/${id}/dismiss`, request));
  }

  apply(id: number, request: AiInsightActionRequest = {}): Promise<AiInsight> {
    return firstValueFrom(this.http.patch<AiInsight>(`${BASE_URL}/${id}/apply`, request));
  }
}
