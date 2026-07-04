export type PathTraceStatus = 'TRACED' | 'PENDING' | 'FAILED';

export const PATH_TRACE_STATUSES: PathTraceStatus[] = ['TRACED', 'PENDING', 'FAILED'];

export interface PathTrace {
  id: number;
  name: string;
  code: string;
  sourceDeviceId: number;
  sourceDeviceName: string;
  targetDeviceId: number;
  targetDeviceName: string;
  hopCount: number;
  totalLengthMeters: number | null;
  status: PathTraceStatus;
  tracedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PathTraceRequest {
  name: string;
  code: string;
  sourceDeviceId: number;
  targetDeviceId: number;
  hopCount: number;
  totalLengthMeters?: number | null;
  status: PathTraceStatus;
  tracedAt?: string | null;
  notes?: string | null;
}

export interface PathTracePage {
  content: PathTrace[];
  totalElements: number;
}

export interface PathTraceListParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  status?: PathTraceStatus;
}
