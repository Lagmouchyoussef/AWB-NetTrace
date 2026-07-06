import { Role } from '../users/user.model';

export interface MyAccount {
  id: number;
  username: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  matricule: string | null;
  profilePhoto: string | null;
  role: Role;
  enabled: boolean;
  ipRestrictionEnabled: boolean;
  createdAt: string;
}

export interface MyAccountUpdateRequest {
  username: string;
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  matricule?: string | null;
  profilePhoto?: string | null;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AllowedIp {
  id: number;
  ipAddress: string;
  createdAt: string;
}

export interface AllowedIpRequest {
  ipAddress: string;
}
