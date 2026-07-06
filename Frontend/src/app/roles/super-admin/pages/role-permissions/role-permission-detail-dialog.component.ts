import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { RolePermission } from './role-permission.model';

@Component({
  selector: 'app-role-permission-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './role-permission-detail-dialog.component.html',
  styleUrl: './role-permission-detail-dialog.component.css',
})
export class RolePermissionDetailDialogComponent {
  protected readonly data = inject<RolePermission>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<RolePermissionDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
