export type RealTimeDashboardStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED';

export const REAL_TIME_DASHBOARD_STATUSES: RealTimeDashboardStatus[] = [
  'ACTIVE',
  'DRAFT',
  'ARCHIVED',
];

export interface RealTimeDashboard {
  id: number;
  name: string;
  code: string;
  description: string | null;
  refreshIntervalSeconds: number;
  widgetCount: number;
  status: RealTimeDashboardStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RealTimeDashboardRequest {
  name: string;
  code: string;
  description?: string | null;
  refreshIntervalSeconds: number;
  widgetCount: number;
  status: RealTimeDashboardStatus;
  notes?: string | null;
}

export interface RealTimeDashboardPage {
  content: RealTimeDashboard[];
  totalElements: number;
}

export interface RealTimeDashboardListParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  status?: RealTimeDashboardStatus;
}
