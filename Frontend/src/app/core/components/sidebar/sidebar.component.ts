import { Component, inject, input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { NavSection } from '../../types/nav';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    TranslatePipe,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private readonly router = inject(Router);

  readonly sections = input.required<NavSection[]>();
  readonly roleLabelKey = input.required<string>();
  readonly collapsed = input<boolean>(false);

  protected isGroupActive(section: NavSection): boolean {
    return (section.children ?? []).some((leaf) => this.router.url.includes(`/${leaf.path}`));
  }

  // An empty-string routerLink command resolves to the app's absolute root instead of staying
  // relative to the current route (a documented Angular Router quirk) — '.' is the correct way
  // to link to the shell's own index route (Dashboard).
  protected resolveLink(path: string): string {
    return path === '' ? '.' : path;
  }
}
