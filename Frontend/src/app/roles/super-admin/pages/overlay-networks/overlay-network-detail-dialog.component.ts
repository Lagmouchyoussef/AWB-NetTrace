import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { OverlayNetwork } from './overlay-network.model';

@Component({
  selector: 'app-overlay-network-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './overlay-network-detail-dialog.component.html',
  styleUrl: './overlay-network-detail-dialog.component.css',
})
export class OverlayNetworkDetailDialogComponent {
  protected readonly data = inject<OverlayNetwork>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<OverlayNetworkDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
