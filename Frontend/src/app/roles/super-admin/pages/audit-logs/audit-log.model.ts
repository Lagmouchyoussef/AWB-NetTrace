export type AuditAction =
  'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'EXPORT' | 'CONFIG_CHANGE';

export const AUDIT_ACTIONS: AuditAction[] = [
  'CREATE',
  'UPDATE',
  'DELETE',
  'LOGIN',
  'LOGOUT',
  'EXPORT',
  'CONFIG_CHANGE',
];

export interface AuditLog {
  id: number;
  actorUsername: string;
  action: AuditAction;
  entityType: string;
  entityReference: string | null;
  description: string | null;
  ipAddress: string | null;
  occurredAt: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogRequest {
  actorUsername: string;
  action: AuditAction;
  entityType: string;
  entityReference?: string | null;
  description?: string | null;
  ipAddress?: string | null;
  occurredAt: string;
  notes?: string | null;
}

export interface AuditLogPage {
  content: AuditLog[];
  totalElements: number;
}

export interface AuditLogListParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  action?: AuditAction;
}
