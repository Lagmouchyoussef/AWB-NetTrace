import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { AuditLog } from './audit-log.model';

@Component({
  selector: 'app-audit-log-detail-dialog',
  standalone: true,
  imports: [DatePipe, MatDialogModule, TranslatePipe],
  templateUrl: './audit-log-detail-dialog.component.html',
  styleUrl: './audit-log-detail-dialog.component.css',
})
export class AuditLogDetailDialogComponent {
  protected readonly data = inject<AuditLog>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<AuditLogDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
