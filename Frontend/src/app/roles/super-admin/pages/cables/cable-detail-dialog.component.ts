import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Cable } from './cable.model';

@Component({
  selector: 'app-cable-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './cable-detail-dialog.component.html',
  styleUrl: './cable-detail-dialog.component.css',
})
export class CableDetailDialogComponent {
  protected readonly data = inject<Cable>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<CableDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
