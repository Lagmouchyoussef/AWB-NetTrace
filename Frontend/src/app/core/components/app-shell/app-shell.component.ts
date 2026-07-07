import { Component, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { AiChatWidgetComponent } from '../ai-chat-widget/ai-chat-widget.component';
import { NavSection } from '../../types/nav';

@Component({
  selector: 'app-app-shell',
  standalone: true,
  imports: [
    MatSidenavModule,
    SidebarComponent,
    TopbarComponent,
    BreadcrumbsComponent,
    AiChatWidgetComponent,
  ],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.css',
})
export class AppShellComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly sections = input.required<NavSection[]>();
  readonly roleLabelKey = input.required<string>();
  readonly scopeLabel = input<string | null>(null);

  private readonly isHandset = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  protected readonly sidenavMode = computed<'over' | 'side'>(() =>
    this.isHandset() ? 'over' : 'side',
  );
  protected readonly sidenavOpened = computed(() => !this.isHandset());

  protected readonly collapsed = signal(false);

  protected onMenuToggle(drawer: { toggle(): void }): void {
    if (this.isHandset()) {
      drawer.toggle();
    } else {
      this.collapsed.update((value) => !value);
    }
  }
}
