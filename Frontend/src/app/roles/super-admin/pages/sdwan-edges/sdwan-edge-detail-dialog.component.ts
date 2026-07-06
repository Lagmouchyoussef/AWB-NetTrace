import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { SdwanEdge } from './sdwan-edge.model';

@Component({
  selector: 'app-sdwan-edge-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './sdwan-edge-detail-dialog.component.html',
  styleUrl: './sdwan-edge-detail-dialog.component.css',
})
export class SdwanEdgeDetailDialogComponent {
  protected readonly data = inject<SdwanEdge>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<SdwanEdgeDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
