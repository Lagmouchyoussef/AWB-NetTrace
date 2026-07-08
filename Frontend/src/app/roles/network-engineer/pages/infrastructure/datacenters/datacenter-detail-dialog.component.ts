import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Datacenter } from '../../../../super-admin/pages/datacenters/datacenter.model';

@Component({
  selector: 'app-ne-datacenter-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './datacenter-detail-dialog.component.html',
  styleUrl: './datacenter-detail-dialog.component.css',
})
export class NeDatacenterDetailDialogComponent {
  protected readonly data = inject<Datacenter>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<NeDatacenterDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
