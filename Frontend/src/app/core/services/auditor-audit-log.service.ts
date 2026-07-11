import { Injectable } from '@angular/core';
import {
  AuditLog,
  AuditLogListParams,
  AuditLogPage,
} from '../../roles/super-admin/pages/audit-logs/audit-log.model';
import { createScopedCrudService } from './scoped-crud.factory';

// Read-only - the backend controller itself has no create/update/delete mapping at all (unlike
// the Network Engineer precedent, which leaves write endpoints reachable behind a frontend-only
// gate); only list/getById are exposed here to match.
@Injectable({ providedIn: 'root' })
export class AuditorAuditLogService {
  private readonly crud = createScopedCrudService<AuditLog, never, AuditLogListParams>(
    '/api/roles/auditor/audit-logs',
  );

  list(params: AuditLogListParams): Promise<AuditLogPage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<AuditLog> {
    return this.crud.getById(id);
  }
}
