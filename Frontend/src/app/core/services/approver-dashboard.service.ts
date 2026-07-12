import { Injectable, inject } from '@angular/core';
import {
  Observable,
  Subject,
  from,
  interval,
  merge,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import { ApproverInterventionService } from './approver-intervention.service';
import { InterventionPage } from '../../roles/super-admin/pages/interventions/intervention.model';

const POLL_INTERVAL_MS = 30000;
const PAGE_SIZE = 100;

// Same live-refresh shape as DashboardService/DcAdminDashboardService (30s poll + instant
// triggerRefresh() from NotificationService on any relevant SSE event), but wrapping the
// approval-queue fetch directly instead of a dedicated backend aggregation endpoint - Approver's
// dashboard/queue screens don't need one, they're both just views over the same pending list.
@Injectable({ providedIn: 'root' })
export class ApproverDashboardService {
  private readonly interventionService = inject(ApproverInterventionService);

  private readonly manualRefresh$ = new Subject<void>();

  readonly queue$: Observable<InterventionPage> = merge(
    interval(POLL_INTERVAL_MS).pipe(startWith(0)),
    this.manualRefresh$,
  ).pipe(
    switchMap(() =>
      from(this.interventionService.getApprovalQueue({ page: 0, size: PAGE_SIZE })),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  triggerRefresh(): void {
    this.manualRefresh$.next();
  }
}
