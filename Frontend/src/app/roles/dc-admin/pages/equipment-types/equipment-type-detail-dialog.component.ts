import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { EquipmentType } from '../../../super-admin/pages/equipment-types/equipment-type.model';

@Component({
  selector: 'app-dc-admin-equipment-type-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './equipment-type-detail-dialog.component.html',
  styleUrl: './equipment-type-detail-dialog.component.css',
})
export class DcAdminEquipmentTypeDetailDialogComponent {
  protected readonly data = inject<EquipmentType>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<DcAdminEquipmentTypeDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
