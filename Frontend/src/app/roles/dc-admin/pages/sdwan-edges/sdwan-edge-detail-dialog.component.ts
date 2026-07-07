import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { SdwanEdge } from '../../../super-admin/pages/sdwan-edges/sdwan-edge.model';

@Component({
  selector: 'app-dc-admin-sdwan-edge-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './sdwan-edge-detail-dialog.component.html',
  styleUrl: './sdwan-edge-detail-dialog.component.css',
})
export class DcAdminSdwanEdgeDetailDialogComponent {
  protected readonly data = inject<SdwanEdge>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<DcAdminSdwanEdgeDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
