import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppShellComponent } from '../../core/components/app-shell/app-shell.component';
import { SUPER_ADMIN_NAV } from './super-admin-nav.config';

@Component({
  selector: 'app-super-admin-shell',
  standalone: true,
  imports: [AppShellComponent, RouterOutlet],
  template: `
    <app-app-shell [sections]="sections" roleLabelKey="roles.superAdmin">
      <router-outlet />
    </app-app-shell>
  `,
})
export class SuperAdminShellComponent {
  protected readonly sections = SUPER_ADMIN_NAV;
}
