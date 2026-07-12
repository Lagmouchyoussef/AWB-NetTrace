import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApprovalStatus,
  Intervention,
  InterventionListParams,
  InterventionPage,
  InterventionRequest,
} from '../../roles/super-admin/pages/interventions/intervention.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/approver/interventions`;

@Injectable({ providedIn: 'root' })
export class ApproverInterventionService {
  private readonly http = inject(HttpClient);

  getApprovalQueue(params: { page: number; size: number }): Promise<InterventionPage> {
    return firstValueFrom(
      this.http.get<InterventionPage>(`${BASE_URL}/approval-queue`, { params }),
    );
  }

  approve(id: number): Promise<Intervention> {
    return firstValueFrom(this.http.post<Intervention>(`${BASE_URL}/${id}/approve`, {}));
  }

  reject(id: number, comment: string): Promise<Intervention> {
    return firstValueFrom(this.http.post<Intervention>(`${BASE_URL}/${id}/reject`, { comment }));
  }

  // Unscoped, every intervention regardless of status/decision - "All Interventions" and
  // "Validated Calendar" (params.approvalStatus = 'APPROVED') screens.
  list(params: InterventionListParams): Promise<InterventionPage> {
    return firstValueFrom(this.http.get<InterventionPage>(BASE_URL, { params: toHttpParams(params) }));
  }

  // This approver's own past decisions - approvalStatus omitted returns both APPROVED+REJECTED.
  listDecisions(params: {
    page: number;
    size: number;
    sort?: string;
    approvalStatus?: ApprovalStatus;
  }): Promise<InterventionPage> {
    return firstValueFrom(
      this.http.get<InterventionPage>(`${BASE_URL}/decisions`, { params: toHttpParams(params) }),
    );
  }

  // Approver acting as a requester (My Requests) - separate from the approval-only methods above.
  listMyRequests(params: InterventionListParams): Promise<InterventionPage> {
    return firstValueFrom(
      this.http.get<InterventionPage>(`${BASE_URL}/my-requests`, { params: toHttpParams(params) }),
    );
  }

  createRequest(request: InterventionRequest): Promise<Intervention> {
    return firstValueFrom(this.http.post<Intervention>(`${BASE_URL}/my-requests`, request));
  }

  // Withdraw one of your own requests - server-side only allows this while still PENDING (see
  // ApproverInterventionController.deleteMyRequest).
  deleteMyRequest(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/my-requests/${id}`));
  }
}

function toHttpParams(params: object): Record<string, string | number> {
  const result: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
    if (value !== undefined && value !== null && value !== '') {
      result[key] = value as string | number;
    }
  }
  return result;
}
