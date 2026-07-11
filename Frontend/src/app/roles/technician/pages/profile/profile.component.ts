import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../../core/services/auth.service';
import { TechnicianMyAccountService } from '../../../../core/services/technician-my-account.service';

const MIN_PASSWORD_LENGTH = 8;

// Deliberately not a regex: the backend DTO applies no email format validation either (plain
// String field), this is purely a client-side sanity nudge - a simple structural check avoids any
// risk of a pathological regex without losing anything meaningful for that purpose.
function looksLikeEmail(value: string): boolean {
  const at = value.indexOf('@');
  if (at <= 0 || at === value.length - 1) {
    return false;
  }
  const domain = value.slice(at + 1);
  const dot = domain.indexOf('.');
  return dot > 0 && dot < domain.length - 1 && !value.includes(' ');
}

// Full editable account (name/email/phone/matricule/photo/password) - the backend MyAccountService
// is already generic (resolves everything from the JWT identity, no role-specific logic) and just
// wasn't exposed under a technician-namespaced route before. See TechnicianMyAccountController.
// Deliberately no IP-restriction/allowed-ips section here: that's an admin/security concern the
// technician nav has never carried (see technician-nav.config.ts).
@Component({
  selector: 'app-technician-profile',
  standalone: true,
  imports: [TranslatePipe, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicianProfileComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly myAccountService = inject(TechnicianMyAccountService);
  private readonly router = inject(Router);

  protected readonly loading = signal(true);
  protected readonly loadErrorKey = signal<string | null>(null);

  protected readonly username = signal('');
  protected readonly fullName = signal('');
  protected readonly email = signal('');
  protected readonly phone = signal('');
  protected readonly matricule = signal('');
  protected readonly photoPreview = signal<string | null>(null);

  protected readonly profileSaving = signal(false);
  protected readonly profileErrorKey = signal<string | null>(null);
  protected readonly profileSavedMessage = signal(false);

  protected readonly currentPassword = signal('');
  protected readonly newPassword = signal('');
  protected readonly confirmPassword = signal('');
  protected readonly passwordSaving = signal(false);
  protected readonly passwordErrorKey = signal<string | null>(null);
  protected readonly passwordSavedMessage = signal(false);

  protected readonly initials = computed(() => {
    const source = this.fullName().trim() || this.username();
    return source ? source.slice(0, 2).toUpperCase() : '?';
  });

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    this.loadErrorKey.set(null);
    try {
      const account = await this.myAccountService.get();
      this.username.set(account.username);
      this.fullName.set(account.fullName ?? '');
      this.email.set(account.email ?? '');
      this.phone.set(account.phone ?? '');
      this.matricule.set(account.matricule ?? '');
      this.photoPreview.set(account.profilePhoto);
    } catch {
      this.loadErrorKey.set('myAccount.loadError');
    } finally {
      this.loading.set(false);
    }
  }

  protected onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => this.photoPreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  protected onRemovePhoto(): void {
    this.photoPreview.set(null);
  }

  protected async onSaveProfile(): Promise<void> {
    const email = this.email().trim();
    if (!this.username().trim() || (email && !looksLikeEmail(email))) {
      this.profileErrorKey.set(
        !this.username().trim() ? 'myAccount.validation.required' : 'myAccount.validation.email',
      );
      return;
    }

    this.profileSaving.set(true);
    this.profileErrorKey.set(null);
    this.profileSavedMessage.set(false);
    try {
      const updated = await this.myAccountService.update({
        username: this.username().trim(),
        fullName: this.fullName().trim() || null,
        email: email || null,
        phone: this.phone().trim() || null,
        matricule: this.matricule().trim() || null,
        profilePhoto: this.photoPreview(),
      });
      this.username.set(updated.username);
      this.fullName.set(updated.fullName ?? '');
      this.email.set(updated.email ?? '');
      this.phone.set(updated.phone ?? '');
      this.matricule.set(updated.matricule ?? '');
      this.profileSavedMessage.set(true);
    } catch {
      this.profileErrorKey.set('myAccount.saveError');
    } finally {
      this.profileSaving.set(false);
    }
  }

  protected async onChangePassword(): Promise<void> {
    this.passwordErrorKey.set(null);
    this.passwordSavedMessage.set(false);

    if (this.newPassword().length < MIN_PASSWORD_LENGTH) {
      this.passwordErrorKey.set('myAccount.validation.passwordLength');
      return;
    }
    if (this.newPassword() !== this.confirmPassword()) {
      this.passwordErrorKey.set('myAccount.passwordMismatch');
      return;
    }

    this.passwordSaving.set(true);
    try {
      await this.myAccountService.changePassword({
        currentPassword: this.currentPassword(),
        newPassword: this.newPassword(),
      });
      this.currentPassword.set('');
      this.newPassword.set('');
      this.confirmPassword.set('');
      this.passwordSavedMessage.set(true);
    } catch {
      this.passwordErrorKey.set('myAccount.passwordError');
    } finally {
      this.passwordSaving.set(false);
    }
  }

  protected onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
