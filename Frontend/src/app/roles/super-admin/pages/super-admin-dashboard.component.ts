import { Component } from '@angular/core';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  template: `
    <div style="padding: 2rem; font-family: sans-serif">
      <h1>Super Administrator Space</h1>
      <p>Welcome — this space is reserved for the Super Administrator role.</p>
    </div>
  `,
})
export class SuperAdminDashboardComponent {}
