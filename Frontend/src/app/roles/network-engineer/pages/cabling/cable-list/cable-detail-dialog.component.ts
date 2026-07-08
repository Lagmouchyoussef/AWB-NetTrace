import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Cable } from '../../../../super-admin/pages/cables/cable.model';

@Component({
  selector: 'app-ne-cable-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './cable-detail-dialog.component.html',
  styleUrl: './cable-detail-dialog.component.css',
})
export class NeCableDetailDialogComponent {
  protected readonly data = inject<Cable>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<NeCableDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
