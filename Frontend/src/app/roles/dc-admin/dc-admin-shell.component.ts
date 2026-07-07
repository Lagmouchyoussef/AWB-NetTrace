import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppShellComponent } from '../../core/components/app-shell/app-shell.component';
import { DcAdminScopeService } from '../../core/services/dc-admin-scope.service';
import { DC_ADMIN_NAV } from './dc-admin-nav.config';

@Component({
  selector: 'app-dc-admin-shell',
  standalone: true,
  imports: [AppShellComponent, RouterOutlet],
  template: `
    <app-app-shell [sections]="sections" roleLabelKey="roles.dcAdmin" [scopeLabel]="scopeLabel()">
      <router-outlet />
    </app-app-shell>
  `,
})
export class DcAdminShellComponent {
  private readonly scopeService = inject(DcAdminScopeService);

  protected readonly sections = DC_ADMIN_NAV;
  protected readonly scopeLabel = this.scopeService.scopeLabel;
}
