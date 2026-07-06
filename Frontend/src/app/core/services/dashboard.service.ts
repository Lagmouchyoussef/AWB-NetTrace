import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom, interval, shareReplay, startWith, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardSummary } from '../models/dashboard-summary.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/dashboard`;
const POLL_INTERVAL_MS = 30000;

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  readonly summary$: Observable<DashboardSummary> = interval(POLL_INTERVAL_MS).pipe(
    startWith(0),
    switchMap(() => this.http.get<DashboardSummary>(`${BASE_URL}/summary`)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  getSummary(): Promise<DashboardSummary> {
    return firstValueFrom(this.http.get<DashboardSummary>(`${BASE_URL}/summary`));
  }
}
