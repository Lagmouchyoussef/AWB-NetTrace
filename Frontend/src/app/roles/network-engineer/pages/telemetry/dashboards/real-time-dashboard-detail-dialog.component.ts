import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { RealTimeDashboard } from '../../../../super-admin/pages/real-time-dashboards/real-time-dashboard.model';

@Component({
  selector: 'app-ne-real-time-dashboard-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './real-time-dashboard-detail-dialog.component.html',
  styleUrl: './real-time-dashboard-detail-dialog.component.css',
})
export class NeRealTimeDashboardDetailDialogComponent {
  protected readonly data = inject<RealTimeDashboard>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<NeRealTimeDashboardDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
