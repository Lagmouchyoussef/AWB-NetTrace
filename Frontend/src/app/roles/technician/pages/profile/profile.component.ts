import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../../core/services/auth.service';

// Minimal for Step 1 (just enough to log out while the rest of the app is being built) - the
// full profile (name, role badge, assigned datacenters) is the Step 6 build.
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

  protected onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
