export type Role =
  | 'SUPER_ADMIN'
  | 'DC_ADMIN'
  | 'NETWORK_ENGINEER'
  | 'TECHNICIAN'
  | 'APPROVER'
  | 'REQUESTER'
  | 'AUDITOR';

export const ROLES: Role[] = [
  'SUPER_ADMIN',
  'DC_ADMIN',
  'NETWORK_ENGINEER',
  'TECHNICIAN',
  'APPROVER',
  'REQUESTER',
  'AUDITOR',
];

export interface AppUser {
  id: number;
  username: string;
  role: Role;
  enabled: boolean;
  ipRestrictionEnabled: boolean;
  createdAt: string;
}

export interface AppUserRequest {
  username: string;
  password?: string | null;
  role: Role;
  enabled: boolean;
  ipRestrictionEnabled: boolean;
}

export interface AppUserPage {
  content: AppUser[];
  totalElements: number;
}

export interface AppUserListParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  role?: Role;
}
