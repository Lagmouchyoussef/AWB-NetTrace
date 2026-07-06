import { Role } from '../users/user.model';

export interface RolePermission {
  id: number;
  role: Role;
  permissionId: number;
  permissionCode: string;
  permissionName: string;
  granted: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RolePermissionRequest {
  role: Role;
  permissionId: number;
  granted: boolean;
  notes?: string | null;
}

export interface RolePermissionPage {
  content: RolePermission[];
  totalElements: number;
}

export interface RolePermissionListParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  role?: Role;
}
