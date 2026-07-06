import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { OverlayTunnel } from './overlay-tunnel.model';

@Component({
  selector: 'app-overlay-tunnel-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './overlay-tunnel-detail-dialog.component.html',
  styleUrl: './overlay-tunnel-detail-dialog.component.css',
})
export class OverlayTunnelDetailDialogComponent {
  protected readonly data = inject<OverlayTunnel>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<OverlayTunnelDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
