import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Report } from './report.model';

@Component({
  selector: 'app-report-detail-dialog',
  standalone: true,
  imports: [DatePipe, MatDialogModule, TranslatePipe],
  templateUrl: './report-detail-dialog.component.html',
  styleUrl: './report-detail-dialog.component.css',
})
export class ReportDetailDialogComponent {
  protected readonly data = inject<Report>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ReportDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
