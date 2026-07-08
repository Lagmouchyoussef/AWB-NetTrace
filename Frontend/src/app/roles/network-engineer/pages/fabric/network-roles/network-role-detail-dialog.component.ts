import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { NetworkRole } from '../../../../super-admin/pages/network-roles/network-role.model';

@Component({
  selector: 'app-ne-network-role-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './network-role-detail-dialog.component.html',
  styleUrl: './network-role-detail-dialog.component.css',
})
export class NeNetworkRoleDetailDialogComponent {
  protected readonly data = inject<NetworkRole>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<NeNetworkRoleDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
