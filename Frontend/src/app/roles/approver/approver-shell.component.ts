import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppShellComponent } from '../../core/components/app-shell/app-shell.component';
import { APPROVER_NAV } from './approver-nav.config';

@Component({
  selector: 'app-approver-shell',
  standalone: true,
  imports: [AppShellComponent, RouterOutlet],
  template: `
    <app-app-shell [sections]="sections" roleLabelKey="roles.approver">
      <router-outlet />
    </app-app-shell>
  `,
})
export class ApproverShellComponent {
  protected readonly sections = APPROVER_NAV;
}
