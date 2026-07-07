import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom, map, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/dc-admin/scope`;

export interface DatacenterScope {
  id: number;
  name: string;
  code: string;
}

// The data-tenancy boundary for the DC Admin role, surfaced in the topbar so the UI never
// silently implies system-wide access. Fetched once per session (assignments rarely change).
@Injectable({ providedIn: 'root' })
export class DcAdminScopeService {
  private readonly http = inject(HttpClient);

  private readonly datacenters$ = this.http
    .get<DatacenterScope[]>(`${BASE_URL}/datacenters`)
    .pipe(shareReplay({ bufferSize: 1, refCount: false }));

  readonly assignedDatacenters = toSignal(this.datacenters$, { initialValue: [] as DatacenterScope[] });

  readonly scopeLabel = toSignal(
    this.datacenters$.pipe(map((list) => (list.length ? list.map((d) => d.name).join(', ') : null))),
    { initialValue: null },
  );

  getAssignedDatacenters(): Promise<DatacenterScope[]> {
    return firstValueFrom(this.datacenters$);
  }
}
