import { Injectable } from '@angular/core';
import {
  AuditLog,
  AuditLogListParams,
  AuditLogPage,
  AuditLogRequest,
} from '../../roles/super-admin/pages/audit-logs/audit-log.model';
import { createScopedCrudService } from './scoped-crud.factory';

@Injectable({ providedIn: 'root' })
export class DcAdminAuditLogService {
  private readonly crud = createScopedCrudService<AuditLog, AuditLogRequest, AuditLogListParams>(
    '/api/roles/dc-admin/audit-logs',
  );

  list(params: AuditLogListParams): Promise<AuditLogPage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<AuditLog> {
    return this.crud.getById(id);
  }

  create(request: AuditLogRequest): Promise<AuditLog> {
    return this.crud.create(request);
  }

  update(id: number, request: AuditLogRequest): Promise<AuditLog> {
    return this.crud.update(id, request);
  }

  delete(id: number): Promise<void> {
    return this.crud.delete(id);
  }
}
