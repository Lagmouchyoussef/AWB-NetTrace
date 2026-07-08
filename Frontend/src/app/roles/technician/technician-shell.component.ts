import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';

interface BottomNavItem {
  path: string;
  icon: string;
  labelKey: string;
}

// A bottom navigation bar, not the desktop AppShellComponent/SidebarComponent used by the other
// three roles - this is a field interface used on a tablet/phone, so the layout is inverted on
// purpose: fewer, larger touch targets instead of a dense sidebar, per the role's design brief.
@Component({
  selector: 'app-technician-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './technician-shell.component.html',
  styleUrl: './technician-shell.component.css',
})
export class TechnicianShellComponent {
  private readonly authService = inject(AuthService);

  protected readonly navItems: BottomNavItem[] = [
    { path: 'home', icon: 'home', labelKey: 'technician.nav.home' },
    { path: 'my-interventions', icon: 'checklist', labelKey: 'technician.nav.myInterventions' },
    { path: 'schedule', icon: 'calendar_month', labelKey: 'technician.nav.schedule' },
    { path: 'notifications', icon: 'notifications', labelKey: 'technician.nav.notifications' },
    { path: 'profile', icon: 'person', labelKey: 'technician.nav.profile' },
  ];

  protected readonly username = computed(() => this.authService.username() ?? '');
}
