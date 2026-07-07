import { Component, OnInit, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { UserPermissionService } from '../../../../core/services/user-permission.service';
import { AppUser } from './user.model';
import { EffectiveModulePermission } from './user-permission.model';

type OverrideMode = 'INHERIT' | 'GRANT' | 'BLOCK';

// Super Admin's real control surface for this feature: grant or block any individual module for
// this one user, including modules outside their normal role territory (enforced server-side by
// ModulePermissionFilter - this dialog is just the UI for it).
@Component({
  selector: 'app-user-permissions-dialog',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule, TranslatePipe],
  templateUrl: './user-permissions-dialog.component.html',
  styleUrl: './user-permissions-dialog.component.css',
})
export class UserPermissionsDialogComponent implements OnInit {
  private readonly permissionService = inject(UserPermissionService);
  protected readonly data = inject<AppUser>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<UserPermissionsDialogComponent>);

  protected readonly rows = signal<EffectiveModulePermission[]>([]);
  protected readonly loading = signal(false);
  protected readonly savingModules = signal<Set<string>>(new Set());
  protected readonly errorKey = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  protected modeFor(row: EffectiveModulePermission): OverrideMode {
    if (row.userOverrideGranted === null) {
      return 'INHERIT';
    }
    return row.userOverrideGranted ? 'GRANT' : 'BLOCK';
  }

  protected isSaving(module: string): boolean {
    return this.savingModules().has(module);
  }

  protected async onModeChange(
    row: EffectiveModulePermission,
    event: MatSelectChange,
  ): Promise<void> {
    const mode = event.value as OverrideMode;
    this.setSaving(row.module, true);
    this.errorKey.set(null);
    try {
      const updated =
        mode === 'INHERIT'
          ? await this.permissionService.clearOverride(this.data.id, row.module)
          : await this.permissionService.setOverride(this.data.id, row.module, {
              granted: mode === 'GRANT',
            });
      this.rows.update((list) => list.map((r) => (r.module === row.module ? updated : r)));
    } catch {
      this.errorKey.set('userPermissions.saveError');
    } finally {
      this.setSaving(row.module, false);
    }
  }

  protected close(): void {
    this.dialogRef.close();
  }

  private setSaving(module: string, saving: boolean): void {
    this.savingModules.update((current) => {
      const next = new Set(current);
      if (saving) {
        next.add(module);
      } else {
        next.delete(module);
      }
      return next;
    });
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.permissionService.getEffectivePermissions(this.data.id);
      this.rows.set(result);
    } finally {
      this.loading.set(false);
    }
  }
}
