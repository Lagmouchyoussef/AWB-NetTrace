import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink, TranslatePipe],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  protected username = '';
  protected readonly submitted = signal(false);

  onSubmit(): void {
    // No backend password-reset endpoint exists yet. This intentionally only
    // acknowledges the request instead of pretending to send a real email.
    this.submitted.set(true);
  }
}
