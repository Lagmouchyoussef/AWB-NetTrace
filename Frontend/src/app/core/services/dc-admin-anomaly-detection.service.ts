import { Injectable } from '@angular/core';
import {
  AnomalyDetection,
  AnomalyDetectionListParams,
  AnomalyDetectionPage,
  AnomalyDetectionRequest,
} from '../../roles/super-admin/pages/anomaly-detections/anomaly-detection.model';
import { createScopedCrudService } from './scoped-crud.factory';

@Injectable({ providedIn: 'root' })
export class DcAdminAnomalyDetectionService {
  private readonly crud = createScopedCrudService<
    AnomalyDetection,
    AnomalyDetectionRequest,
    AnomalyDetectionListParams
  >('/api/roles/dc-admin/anomaly-detections');

  list(params: AnomalyDetectionListParams): Promise<AnomalyDetectionPage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<AnomalyDetection> {
    return this.crud.getById(id);
  }

  create(request: AnomalyDetectionRequest): Promise<AnomalyDetection> {
    return this.crud.create(request);
  }

  update(id: number, request: AnomalyDetectionRequest): Promise<AnomalyDetection> {
    return this.crud.update(id, request);
  }

  delete(id: number): Promise<void> {
    return this.crud.delete(id);
  }
}
