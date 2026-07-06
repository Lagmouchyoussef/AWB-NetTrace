export type ReportType =
  'INVENTORY' | 'CAPACITY' | 'COMPLIANCE' | 'AVAILABILITY' | 'SECURITY' | 'CUSTOM';

export type ReportFormat = 'PDF' | 'CSV' | 'XLSX';

export type ReportSchedule = 'ON_DEMAND' | 'DAILY' | 'WEEKLY' | 'MONTHLY';

export type ReportStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED';

export const REPORT_TYPES: ReportType[] = [
  'INVENTORY',
  'CAPACITY',
  'COMPLIANCE',
  'AVAILABILITY',
  'SECURITY',
  'CUSTOM',
];

export const REPORT_FORMATS: ReportFormat[] = ['PDF', 'CSV', 'XLSX'];

export const REPORT_SCHEDULES: ReportSchedule[] = ['ON_DEMAND', 'DAILY', 'WEEKLY', 'MONTHLY'];

export const REPORT_STATUSES: ReportStatus[] = ['ACTIVE', 'DRAFT', 'ARCHIVED'];

export interface Report {
  id: number;
  name: string;
  code: string;
  reportType: ReportType;
  format: ReportFormat;
  schedule: ReportSchedule;
  status: ReportStatus;
  lastGeneratedAt: string | null;
  description: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReportRequest {
  name: string;
  code: string;
  reportType: ReportType;
  format: ReportFormat;
  schedule: ReportSchedule;
  status: ReportStatus;
  lastGeneratedAt?: string | null;
  description?: string | null;
  notes?: string | null;
}

export interface ReportPage {
  content: Report[];
  totalElements: number;
}

export interface ReportListParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  status?: ReportStatus;
  reportType?: ReportType;
}
