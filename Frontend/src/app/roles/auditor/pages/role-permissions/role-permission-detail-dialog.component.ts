import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { RolePermission } from '../../../super-admin/pages/role-permissions/role-permission.model';

@Component({
  selector: 'app-auditor-role-permission-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './role-permission-detail-dialog.component.html',
  styleUrl: './role-permission-detail-dialog.component.css',
})
export class AuditorRolePermissionDetailDialogComponent {
  protected readonly data = inject<RolePermission>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<AuditorRolePermissionDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
