import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppShellComponent } from '../../core/components/app-shell/app-shell.component';
import { TECHNICIAN_NAV } from './technician-nav.config';

@Component({
  selector: 'app-technician-shell',
  standalone: true,
  imports: [AppShellComponent, RouterOutlet],
  template: `
    <app-app-shell [sections]="sections" roleLabelKey="roles.technician">
      <router-outlet />
    </app-app-shell>
  `,
})
export class TechnicianShellComponent {
  protected readonly sections = TECHNICIAN_NAV;
}
