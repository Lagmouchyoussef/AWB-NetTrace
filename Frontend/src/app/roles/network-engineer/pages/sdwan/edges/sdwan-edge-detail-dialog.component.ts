import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { SdwanEdge } from '../../../../super-admin/pages/sdwan-edges/sdwan-edge.model';

@Component({
  selector: 'app-ne-sdwan-edge-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './sdwan-edge-detail-dialog.component.html',
  styleUrl: './sdwan-edge-detail-dialog.component.css',
})
export class NeSdwanEdgeDetailDialogComponent {
  protected readonly data = inject<SdwanEdge>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<NeSdwanEdgeDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
