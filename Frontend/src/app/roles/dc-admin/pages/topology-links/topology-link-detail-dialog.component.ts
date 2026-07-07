import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { TopologyLink } from '../../../super-admin/pages/topology-links/topology-link.model';

@Component({
  selector: 'app-dc-admin-topology-link-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './topology-link-detail-dialog.component.html',
  styleUrl: './topology-link-detail-dialog.component.css',
})
export class DcAdminTopologyLinkDetailDialogComponent {
  protected readonly data = inject<TopologyLink>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<DcAdminTopologyLinkDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
