export type InterventionType =
  | 'PREVENTIVE_MAINTENANCE'
  | 'CORRECTIVE_MAINTENANCE'
  | 'INCIDENT_RESPONSE'
  | 'INSTALLATION'
  | 'DECOMMISSIONING'
  | 'INSPECTION';

export type InterventionPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type InterventionStatus =
  'SCHEDULED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';

export const INTERVENTION_TYPES: InterventionType[] = [
  'PREVENTIVE_MAINTENANCE',
  'CORRECTIVE_MAINTENANCE',
  'INCIDENT_RESPONSE',
  'INSTALLATION',
  'DECOMMISSIONING',
  'INSPECTION',
];

export const INTERVENTION_PRIORITIES: InterventionPriority[] = [
  'CRITICAL',
  'HIGH',
  'MEDIUM',
  'LOW',
];

export const INTERVENTION_STATUSES: InterventionStatus[] = [
  'SCHEDULED',
  'IN_PROGRESS',
  'ON_HOLD',
  'COMPLETED',
  'CANCELLED',
];

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Intervention {
  id: number;
  deviceId: number;
  deviceName: string;
  title: string;
  description: string | null;
  interventionType: InterventionType;
  priority: InterventionPriority;
  status: InterventionStatus;
  assignedTechnicianId: number | null;
  assignedTechnicianUsername: string | null;
  scheduledAt: string;
  completedAt: string | null;
  notes: string | null;
  requestedById: number | null;
  requestedByUsername: string | null;
  approvedById: number | null;
  approvedByUsername: string | null;
  approvalStatus: ApprovalStatus;
  approvalComment: string | null;
  decidedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InterventionRequest {
  deviceId: number;
  title: string;
  description?: string | null;
  interventionType: InterventionType;
  priority: InterventionPriority;
  status: InterventionStatus;
  assignedTechnicianId?: number | null;
  scheduledAt: string;
  completedAt?: string | null;
  notes?: string | null;
}

export interface InterventionPage {
  content: Intervention[];
  totalElements: number;
}

export interface InterventionListParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  status?: InterventionStatus;
  priority?: InterventionPriority;
}
