import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { PathTrace } from './path-trace.model';

@Component({
  selector: 'app-path-trace-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './path-trace-detail-dialog.component.html',
  styleUrl: './path-trace-detail-dialog.component.css',
})
export class PathTraceDetailDialogComponent {
  protected readonly data = inject<PathTrace>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<PathTraceDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
