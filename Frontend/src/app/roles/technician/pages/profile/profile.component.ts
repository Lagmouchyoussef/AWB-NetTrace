import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../../core/services/auth.service';

// Name, role badge and a large, easy-to-find logout button (per the brief - technicians need to
// switch accounts/devices quickly between shifts). No photo/datacenter-assignment fields: unlike
// DC Admin, this role isn't scoped to specific datacenters, and there's no profile-photo upload
// endpoint for this role's account type, so nothing is faked here that the API doesn't provide.
@Component({
  selector: 'app-technician-profile',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class TechnicianProfileComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly username = computed(() => this.authService.username() ?? '');
  protected readonly initials = computed(() => {
    const name = this.username();
    return name ? name.slice(0, 2).toUpperCase() : '?';
  });

  protected onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
