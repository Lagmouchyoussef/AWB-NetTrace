import { Component, computed, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ThemePreference, ThemeService } from '../../services/theme.service';
import { AppLanguage, LanguageService } from '../../services/language.service';
import { NavSection } from '../../types/nav';
import { Role } from '../../types/role';
import { FlagIconComponent } from '../flag-icon/flag-icon.component';

interface SearchResult {
  label: string;
  path: string;
}

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [MatIconModule, MatMenuModule, MatTooltipModule, TranslatePipe, FlagIconComponent],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
})
export class TopbarComponent {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly themeService = inject(ThemeService);
  private readonly languageService = inject(LanguageService);
  private readonly translateService = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly sections = input.required<NavSection[]>();
  readonly scopeLabel = input<string | null>(null);
  readonly menuToggle = output<void>();

  private readonly currentLang = toSignal(this.translateService.onLangChange, {
    initialValue: null,
  });

  protected readonly searchQuery = signal('');
  protected readonly searchResults = computed<SearchResult[]>(() => {
    this.currentLang(); // recompute translations whenever the active language changes
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) {
      return [];
    }
    const flat: SearchResult[] = [];
    for (const section of this.sections()) {
      if (section.children) {
        for (const leaf of section.children) {
          flat.push({ label: this.translateService.instant(leaf.labelKey), path: leaf.path });
        }
      } else if (section.path !== undefined) {
        flat.push({ label: this.translateService.instant(section.labelKey), path: section.path });
      }
    }
    return flat.filter((item) => item.label.toLowerCase().includes(query)).slice(0, 8);
  });

  protected readonly notifications = toSignal(this.notificationService.getNotifications(), {
    initialValue: [],
  });
  protected readonly unreadCount = computed(
    () => this.notifications().filter((notification) => !notification.read).length,
  );

  protected readonly themePreference = this.themeService.preference;
  protected readonly themeIcon = computed<string>(() => {
    switch (this.themePreference()) {
      case 'light':
        return 'light_mode';
      case 'dark':
        return 'dark_mode';
      default:
        return 'desktop_windows';
    }
  });

  protected readonly language = this.languageService.language;

  protected readonly username = computed(() => this.authService.username() ?? '');
  protected readonly initials = computed(() => {
    const name = this.username();
    return name ? name.slice(0, 2).toUpperCase() : '?';
  });
  protected readonly role = computed(() => {
    this.currentLang(); // recompute the translated label whenever the active language changes
    const role = this.authService.currentRole();
    if (role === 'SUPER_ADMIN') {
      return this.translateService.instant('roles.superAdmin');
    }
    return this.formatRole(role);
  });

  protected onNotifMenuClosed(): void {
    this.notificationService.markAllRead();
  }

  protected onDismissNotification(id: string, event: Event): void {
    event.stopPropagation();
    this.notificationService.dismiss(id);
  }

  protected onClearAllNotifications(event: Event): void {
    event.stopPropagation();
    this.notificationService.clearAll();
  }

  protected onSearchInput(value: string): void {
    this.searchQuery.set(value);
  }

  protected selectResult(result: SearchResult): void {
    this.searchQuery.set('');
    this.router.navigate([result.path], { relativeTo: this.route });
  }

  protected setTheme(preference: ThemePreference): void {
    this.themeService.setPreference(preference);
  }

  protected setLanguage(language: AppLanguage): void {
    this.languageService.setLanguage(language);
  }

  protected readonly myAccountPath = computed(() => {
    const role = this.authService.currentRole();
    if (role === 'SUPER_ADMIN') {
      return '/super-admin/my-account';
    }
    if (role === 'DC_ADMIN') {
      return '/dc-admin/my-account';
    }
    if (role === 'TECHNICIAN') {
      return '/technician/profile';
    }
    if (role === 'NETWORK_ENGINEER') {
      return '/network-engineer/my-account';
    }
    if (role === 'APPROVER') {
      return '/approver/my-account';
    }
    if (role === 'AUDITOR') {
      return '/auditor/my-account';
    }
    if (role === 'REQUESTER') {
      return '/requester/my-account';
    }
    return null;
  });

  // Technician's account page already lives in their own nav as "Profile" - reuse that label here
  // instead of "My Account" so the wording matches what they clicked to get the same screen.
  protected readonly myAccountLabelKey = computed(() =>
    this.authService.currentRole() === 'TECHNICIAN' ? 'technician.nav.profile' : 'topbar.myAccount',
  );

  protected goToMyAccount(path: string): void {
    this.router.navigateByUrl(path);
  }

  protected onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  private formatRole(role: Role | null): string {
    if (!role) {
      return '';
    }
    return role
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
