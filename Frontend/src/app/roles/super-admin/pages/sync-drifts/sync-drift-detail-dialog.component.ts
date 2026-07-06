import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { SyncDrift } from './sync-drift.model';

@Component({
  selector: 'app-sync-drift-detail-dialog',
  standalone: true,
  imports: [DatePipe, MatDialogModule, TranslatePipe],
  templateUrl: './sync-drift-detail-dialog.component.html',
  styleUrl: './sync-drift-detail-dialog.component.css',
})
export class SyncDriftDetailDialogComponent {
  protected readonly data = inject<SyncDrift>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<SyncDriftDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
