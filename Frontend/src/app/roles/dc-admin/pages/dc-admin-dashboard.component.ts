import { Component } from '@angular/core';

@Component({
  selector: 'app-dc-admin-dashboard',
  standalone: true,
  template: `
    <div style="padding: 2rem; font-family: sans-serif">
      <h1>Datacenter Administrator Space</h1>
      <p>Welcome — this space is reserved for the Datacenter Administrator role.</p>
    </div>
  `,
})
export class DcAdminDashboardComponent {}
