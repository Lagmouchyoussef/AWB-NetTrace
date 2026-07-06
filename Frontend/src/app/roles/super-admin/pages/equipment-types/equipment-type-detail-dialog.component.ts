import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { EquipmentType } from './equipment-type.model';

@Component({
  selector: 'app-equipment-type-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './equipment-type-detail-dialog.component.html',
  styleUrl: './equipment-type-detail-dialog.component.css',
})
export class EquipmentTypeDetailDialogComponent {
  protected readonly data = inject<EquipmentType>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<EquipmentTypeDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
