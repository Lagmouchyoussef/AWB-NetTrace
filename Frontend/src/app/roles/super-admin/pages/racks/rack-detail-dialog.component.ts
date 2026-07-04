import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Rack } from './rack.model';

@Component({
  selector: 'app-rack-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './rack-detail-dialog.component.html',
  styleUrl: './rack-detail-dialog.component.css',
})
export class RackDetailDialogComponent {
  protected readonly data = inject<Rack>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<RackDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
