import { Injectable } from '@angular/core';
import {
  Report,
  ReportListParams,
  ReportPage,
  ReportRequest,
} from '../../roles/super-admin/pages/reports/report.model';
import { createScopedCrudService } from './scoped-crud.factory';

@Injectable({ providedIn: 'root' })
export class DcAdminReportService {
  private readonly crud = createScopedCrudService<Report, ReportRequest, ReportListParams>(
    '/api/roles/dc-admin/reports',
  );

  list(params: ReportListParams): Promise<ReportPage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<Report> {
    return this.crud.getById(id);
  }

  create(request: ReportRequest): Promise<Report> {
    return this.crud.create(request);
  }

  update(id: number, request: ReportRequest): Promise<Report> {
    return this.crud.update(id, request);
  }

  delete(id: number): Promise<void> {
    return this.crud.delete(id);
  }
}
