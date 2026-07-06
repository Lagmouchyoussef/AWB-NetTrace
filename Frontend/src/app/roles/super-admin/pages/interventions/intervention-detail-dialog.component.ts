import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Intervention } from './intervention.model';

@Component({
  selector: 'app-intervention-detail-dialog',
  standalone: true,
  imports: [DatePipe, MatDialogModule, TranslatePipe],
  templateUrl: './intervention-detail-dialog.component.html',
  styleUrl: './intervention-detail-dialog.component.css',
})
export class InterventionDetailDialogComponent {
  protected readonly data = inject<Intervention>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<InterventionDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
