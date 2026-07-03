import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ROLE_SLUGS } from '../../core/types/role';

type BorderState = 'idle' | 'error' | 'success';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected username = '';
  protected password = '';
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly loading = signal(false);
  protected readonly borderState = signal<BorderState>('idle');
  protected readonly showPassword = signal(false);

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  async onSubmit(): Promise<void> {
    this.errorMessage.set(null);
    this.loading.set(true);
    try {
      const role = await this.authService.login(this.username, this.password);
      this.borderState.set('success');
      const slug = ROLE_SLUGS[role];
      await new Promise((resolve) => setTimeout(resolve, 500));
      await this.router.navigate([`/${slug}`]);
    } catch {
      this.borderState.set('error');
      this.errorMessage.set('Incorrect username or password.');
    } finally {
      this.loading.set(false);
    }
  }
}
