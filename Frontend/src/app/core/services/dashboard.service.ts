import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  Observable,
  Subject,
  firstValueFrom,
  interval,
  merge,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardSummary } from '../models/dashboard-summary.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/dashboard`;
const POLL_INTERVAL_MS = 30000;
const DEFAULT_DAYS = 14;

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  // Refreshed by the 30s poll as a fallback, and instantly by triggerRefresh() whenever a
  // live notification arrives (see NotificationService) - so the dashboard reacts in real time
  // instead of waiting for the next tick. The date-range control fetches separately via
  // getSummary() instead of feeding into this stream, so the two don't fight over "days".
  private readonly manualRefresh$ = new Subject<void>();

  readonly summary$: Observable<DashboardSummary> = merge(
    interval(POLL_INTERVAL_MS).pipe(startWith(0)),
    this.manualRefresh$,
  ).pipe(
    switchMap(() => this.getSummary(DEFAULT_DAYS)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  getSummary(days = DEFAULT_DAYS): Promise<DashboardSummary> {
    return firstValueFrom(
      this.http.get<DashboardSummary>(`${BASE_URL}/summary`, { params: { days } }),
    );
  }

  triggerRefresh(): void {
    this.manualRefresh$.next();
  }
}
