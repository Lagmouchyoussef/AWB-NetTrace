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
import { RequesterInterventionService } from './requester-intervention.service';
import { InterventionPage } from '../../roles/super-admin/pages/interventions/intervention.model';

const POLL_INTERVAL_MS = 30000;
const PAGE_SIZE = 100;

// Same live-refresh shape as ApproverDashboardService (30s poll + instant triggerRefresh() from
// NotificationService on any relevant SSE event) - a single shared stream over this requester's
// own request history, consumed by Dashboard, My Requests, Calendar and Reports via toSignal, so
// every screen updates together the moment an Approver/DC Admin decides on one of these requests.
@Injectable({ providedIn: 'root' })
export class RequesterDashboardService {
  private readonly interventionService = inject(RequesterInterventionService);

  private readonly manualRefresh$ = new Subject<void>();

  readonly requests$: Observable<InterventionPage> = merge(
    interval(POLL_INTERVAL_MS).pipe(startWith(0)),
    this.manualRefresh$,
  ).pipe(
    switchMap(() =>
      from(this.interventionService.list({ page: 0, size: PAGE_SIZE, sort: 'createdAt,desc' })),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  triggerRefresh(): void {
    this.manualRefresh$.next();
  }
}
