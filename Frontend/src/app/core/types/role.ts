export type Role =
  | 'SUPER_ADMIN'
  | 'DC_ADMIN'
  | 'NETWORK_ENGINEER'
  | 'TECHNICIAN'
  | 'APPROVER'
  | 'REQUESTER'
  | 'AUDITOR';

export const ROLE_SLUGS: Record<Role, string> = {
  SUPER_ADMIN: 'super-admin',
  DC_ADMIN: 'dc-admin',
  NETWORK_ENGINEER: 'network-engineer',
  TECHNICIAN: 'technician',
  APPROVER: 'approver',
  REQUESTER: 'requester',
  AUDITOR: 'auditor',
};

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: 'Super Admin',
  DC_ADMIN: 'DC Admin',
  NETWORK_ENGINEER: 'Network Engineer',
  TECHNICIAN: 'Technician',
  APPROVER: 'Approver',
  REQUESTER: 'Requester',
  AUDITOR: 'Auditor',
};
