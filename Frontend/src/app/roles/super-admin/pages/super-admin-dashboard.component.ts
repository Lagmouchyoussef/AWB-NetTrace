import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface PingResponse {
  message: string;
  role: string;
  user: string;
}

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  template: `
    <div style="padding: 2rem; font-family: sans-serif">
      <h1>Super Administrator Space</h1>
      @if (response()) {
        <p>Welcome, {{ response()!.user }} — backend confirms role {{ response()!.role }}.</p>
      } @else if (error()) {
        <p style="color: red">{{ error() }}</p>
      } @else {
        <p>Loading...</p>
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
      error: () => this.error.set('Unable to reach the backend for this role.'),
    });
  }
}
