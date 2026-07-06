import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { UserManagementService } from '../../../../core/services/user-management.service';
import { AppUser, ROLES, Role } from './user.model';

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    TranslatePipe,
  ],
  templateUrl: './user-form-dialog.component.html',
  styleUrl: './user-form-dialog.component.css',
})
export class UserFormDialogComponent {
  private readonly userManagementService = inject(UserManagementService);
  private readonly dialogRef = inject(MatDialogRef<UserFormDialogComponent, boolean>);
  protected readonly data = inject<AppUser | null>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data !== null;
  protected readonly roles = ROLES;
  protected readonly saving = signal(false);
  protected readonly errorKey = signal<string | null>(null);

  protected readonly form = new FormGroup({
    username: new FormControl(this.data?.username ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: this.isEdit ? [] : [Validators.required],
    }),
    role: new FormControl<Role>(this.data?.role ?? 'TECHNICIAN', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    enabled: new FormControl(this.data?.enabled ?? true, { nonNullable: true }),
    ipRestrictionEnabled: new FormControl(this.data?.ipRestrictionEnabled ?? false, {
      nonNullable: true,
    }),
  });

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorKey.set(null);
    const value = this.form.getRawValue();
    const request = {
      ...value,
      password: value.password || null,
    };
    try {
      if (this.data) {
        await this.userManagementService.update(this.data.id, request);
      } else {
        await this.userManagementService.create(request);
      }
      this.dialogRef.close(true);
    } catch {
      this.errorKey.set('users.saveError');
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
