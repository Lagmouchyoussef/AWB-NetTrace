import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { OverlayNetwork } from '../../../../super-admin/pages/overlay-networks/overlay-network.model';

@Component({
  selector: 'app-ne-overlay-network-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './overlay-network-detail-dialog.component.html',
  styleUrl: './overlay-network-detail-dialog.component.css',
})
export class NeOverlayNetworkDetailDialogComponent {
  protected readonly data = inject<OverlayNetwork>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<NeOverlayNetworkDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
