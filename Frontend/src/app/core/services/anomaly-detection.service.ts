import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AnomalyDetection,
  AnomalyDetectionListParams,
  AnomalyDetectionPage,
  AnomalyDetectionRequest,
} from '../../roles/super-admin/pages/anomaly-detections/anomaly-detection.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/anomaly-detections`;

@Injectable({ providedIn: 'root' })
export class AnomalyDetectionService {
  private readonly http = inject(HttpClient);

  list(params: AnomalyDetectionListParams): Promise<AnomalyDetectionPage> {
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
    return firstValueFrom(this.http.get<AnomalyDetectionPage>(BASE_URL, { params: httpParams }));
  }

  getById(id: number): Promise<AnomalyDetection> {
    return firstValueFrom(this.http.get<AnomalyDetection>(`${BASE_URL}/${id}`));
  }

  create(request: AnomalyDetectionRequest): Promise<AnomalyDetection> {
    return firstValueFrom(this.http.post<AnomalyDetection>(BASE_URL, request));
  }

  update(id: number, request: AnomalyDetectionRequest): Promise<AnomalyDetection> {
    return firstValueFrom(this.http.put<AnomalyDetection>(`${BASE_URL}/${id}`, request));
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/${id}`));
  }
}
