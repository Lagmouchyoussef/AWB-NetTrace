import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Report } from '../../../super-admin/pages/reports/report.model';

@Component({
  selector: 'app-auditor-report-detail-dialog',
  standalone: true,
  imports: [DatePipe, MatDialogModule, TranslatePipe],
  templateUrl: './report-detail-dialog.component.html',
  styleUrl: './report-detail-dialog.component.css',
})
export class AuditorReportDetailDialogComponent {
  protected readonly data = inject<Report>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<AuditorReportDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
