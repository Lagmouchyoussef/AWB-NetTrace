import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppShellComponent } from '../../core/components/app-shell/app-shell.component';
import { AUDITOR_NAV } from './auditor-nav.config';

@Component({
  selector: 'app-auditor-shell',
  standalone: true,
  imports: [AppShellComponent, RouterOutlet],
  template: `
    <app-app-shell [sections]="sections" roleLabelKey="roles.auditor">
      <router-outlet />
    </app-app-shell>
  `,
})
export class AuditorShellComponent {
  protected readonly sections = AUDITOR_NAV;
}
