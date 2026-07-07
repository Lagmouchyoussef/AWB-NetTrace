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

const BASE_URL = `${environment.apiBaseUrl}/api/roles/dc-admin/dashboard`;
const POLL_INTERVAL_MS = 30000;
const DEFAULT_DAYS = 14;

// Mirrors DashboardService (Super Admin) exactly, pointed at the DC Admin-gated endpoint that
// delegates to the same backend DashboardService - identical live data, different role gate.
@Injectable({ providedIn: 'root' })
export class DcAdminDashboardService {
  private readonly http = inject(HttpClient);

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
