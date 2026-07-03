import { Component } from '@angular/core';

@Component({
  selector: 'app-requester-dashboard',
  standalone: true,
  template: `
    <div style="padding: 2rem; font-family: sans-serif">
      <h1>Requester Space</h1>
      <p>Welcome — this space is reserved for the Requester role.</p>
    </div>
  `,
})
export class RequesterDashboardComponent {}
