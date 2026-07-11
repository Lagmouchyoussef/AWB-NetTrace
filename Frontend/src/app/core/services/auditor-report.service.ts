import { Injectable } from '@angular/core';
import {
  Report,
  ReportListParams,
  ReportPage,
} from '../../roles/super-admin/pages/reports/report.model';
import { createScopedCrudService } from './scoped-crud.factory';

// Read-only - see AuditorAuditLogService; the backend controller has no write mapping at all.
@Injectable({ providedIn: 'root' })
export class AuditorReportService {
  private readonly crud = createScopedCrudService<Report, never, ReportListParams>(
    '/api/roles/auditor/reports',
  );

  list(params: ReportListParams): Promise<ReportPage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<Report> {
    return this.crud.getById(id);
  }
}
