import { Injectable } from '@angular/core';
import {
  AnomalyDetection,
  AnomalyDetectionListParams,
  AnomalyDetectionPage,
} from '../../roles/super-admin/pages/anomaly-detections/anomaly-detection.model';
import { createScopedCrudService } from './scoped-crud.factory';

// Read-only - see AuditorAuditLogService; the backend controller has no write mapping at all.
@Injectable({ providedIn: 'root' })
export class AuditorAnomalyDetectionService {
  private readonly crud = createScopedCrudService<
    AnomalyDetection,
    never,
    AnomalyDetectionListParams
  >('/api/roles/auditor/anomaly-detections');

  list(params: AnomalyDetectionListParams): Promise<AnomalyDetectionPage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<AnomalyDetection> {
    return this.crud.getById(id);
  }
}
