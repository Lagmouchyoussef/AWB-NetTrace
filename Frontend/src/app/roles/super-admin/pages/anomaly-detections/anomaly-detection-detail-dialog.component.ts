import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { AnomalyDetection } from './anomaly-detection.model';

@Component({
  selector: 'app-anomaly-detection-detail-dialog',
  standalone: true,
  imports: [DatePipe, MatDialogModule, TranslatePipe],
  templateUrl: './anomaly-detection-detail-dialog.component.html',
  styleUrl: './anomaly-detection-detail-dialog.component.css',
})
export class AnomalyDetectionDetailDialogComponent {
  protected readonly data = inject<AnomalyDetection>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<AnomalyDetectionDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
