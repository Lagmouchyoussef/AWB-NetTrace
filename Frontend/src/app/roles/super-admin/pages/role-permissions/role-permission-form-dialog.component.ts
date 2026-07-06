import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { PermissionService } from '../../../../core/services/permission.service';
import { RolePermissionService } from '../../../../core/services/role-permission.service';
import { ROLES, Role } from '../users/user.model';
import { Permission } from './permission.model';
import { RolePermission } from './role-permission.model';

@Component({
  selector: 'app-role-permission-form-dialog',
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
  templateUrl: './role-permission-form-dialog.component.html',
  styleUrl: './role-permission-form-dialog.component.css',
})
export class RolePermissionFormDialogComponent implements OnInit {
  private readonly rolePermissionService = inject(RolePermissionService);
  private readonly permissionService = inject(PermissionService);
  private readonly dialogRef = inject(MatDialogRef<RolePermissionFormDialogComponent, boolean>);
  protected readonly data = inject<RolePermission | null>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data !== null;
  protected readonly roles = ROLES;
  protected readonly saving = signal(false);
  protected readonly errorKey = signal<string | null>(null);
  protected readonly permissions = signal<Permission[]>([]);

  protected readonly form = new FormGroup({
    role: new FormControl<Role>(this.data?.role ?? 'TECHNICIAN', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    permissionId: new FormControl<number | null>(this.data?.permissionId ?? null, {
      validators: [Validators.required],
    }),
    granted: new FormControl(this.data?.granted ?? true, { nonNullable: true }),
    notes: new FormControl(this.data?.notes ?? ''),
  });

  async ngOnInit(): Promise<void> {
    const result = await this.permissionService.list();
    this.permissions.set(result);
  }

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorKey.set(null);
    const value = this.form.getRawValue();
    const request = { ...value, permissionId: value.permissionId! };
    try {
      if (this.data) {
        await this.rolePermissionService.update(this.data.id, request);
      } else {
        await this.rolePermissionService.create(request);
      }
      this.dialogRef.close(true);
    } catch {
      this.errorKey.set('rolePermissions.saveError');
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
