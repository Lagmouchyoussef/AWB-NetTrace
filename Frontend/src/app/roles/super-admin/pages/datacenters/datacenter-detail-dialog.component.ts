import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Datacenter } from './datacenter.model';

@Component({
  selector: 'app-datacenter-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './datacenter-detail-dialog.component.html',
  styleUrl: './datacenter-detail-dialog.component.css',
})
export class DatacenterDetailDialogComponent {
  protected readonly data = inject<Datacenter>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<DatacenterDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
