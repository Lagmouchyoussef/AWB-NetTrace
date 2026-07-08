import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Device } from '../../../../super-admin/pages/devices/device.model';

@Component({
  selector: 'app-ne-device-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './device-detail-dialog.component.html',
  styleUrl: './device-detail-dialog.component.css',
})
export class NeDeviceDetailDialogComponent {
  protected readonly data = inject<Device>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<NeDeviceDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
