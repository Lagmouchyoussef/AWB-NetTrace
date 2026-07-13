import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppShellComponent } from '../../core/components/app-shell/app-shell.component';
import { REQUESTER_NAV } from './requester-nav.config';

@Component({
  selector: 'app-requester-shell',
  standalone: true,
  imports: [AppShellComponent, RouterOutlet],
  template: `
    <app-app-shell [sections]="sections" roleLabelKey="roles.requester">
      <router-outlet />
    </app-app-shell>
  `,
})
export class RequesterShellComponent {
  protected readonly sections = REQUESTER_NAV;
}
