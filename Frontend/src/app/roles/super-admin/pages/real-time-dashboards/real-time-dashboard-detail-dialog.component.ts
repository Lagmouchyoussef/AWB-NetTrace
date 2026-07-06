import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { RealTimeDashboard } from './real-time-dashboard.model';

@Component({
  selector: 'app-real-time-dashboard-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './real-time-dashboard-detail-dialog.component.html',
  styleUrl: './real-time-dashboard-detail-dialog.component.css',
})
export class RealTimeDashboardDetailDialogComponent {
  protected readonly data = inject<RealTimeDashboard>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<RealTimeDashboardDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
