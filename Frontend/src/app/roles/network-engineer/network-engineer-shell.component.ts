import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppShellComponent } from '../../core/components/app-shell/app-shell.component';
import { NETWORK_ENGINEER_NAV } from './network-engineer-nav.config';

@Component({
  selector: 'app-network-engineer-shell',
  standalone: true,
  imports: [AppShellComponent, RouterOutlet],
  template: `
    <app-app-shell [sections]="sections" roleLabelKey="roles.networkEngineer">
      <router-outlet />
    </app-app-shell>
  `,
})
export class NetworkEngineerShellComponent {
  protected readonly sections = NETWORK_ENGINEER_NAV;
}
