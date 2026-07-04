import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';

interface PingResponse {
  message: string;
  role: string;
  user: string;
}

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <div style="padding: 2rem; font-family: sans-serif; color: var(--awb-on-surface)">
      <h1>{{ 'dashboard.title' | translate }}</h1>
      @if (response()) {
        <p>
          {{ 'dashboard.welcome' | translate: { user: response()!.user, role: response()!.role } }}
        </p>
      } @else if (error()) {
        <p style="color: light-dark(#c62828, #ff6b6b)">{{ error() | translate }}</p>
      } @else {
        <p>{{ 'dashboard.loading' | translate }}</p>
      }
    </div>
  `,
})
export class SuperAdminDashboardComponent implements OnInit {
  private readonly http = inject(HttpClient);
  protected readonly response = signal<PingResponse | null>(null);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.http.get<PingResponse>(`${environment.apiBaseUrl}/api/roles/super-admin/ping`).subscribe({
      next: (res) => this.response.set(res),
      error: () => this.error.set('dashboard.unableToReach'),
    });
  }
}
