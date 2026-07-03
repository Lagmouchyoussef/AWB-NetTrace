import { Component } from '@angular/core';

@Component({
  selector: 'app-technician-dashboard',
  standalone: true,
  template: `
    <div style="padding: 2rem; font-family: sans-serif">
      <h1>Datacenter Technician Space</h1>
      <p>Welcome — this space is reserved for the Datacenter Technician role.</p>
    </div>
  `,
})
export class TechnicianDashboardComponent {}
