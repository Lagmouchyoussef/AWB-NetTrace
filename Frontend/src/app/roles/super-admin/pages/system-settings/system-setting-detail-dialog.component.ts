import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { SystemSetting } from './system-setting.model';

@Component({
  selector: 'app-system-setting-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './system-setting-detail-dialog.component.html',
  styleUrl: './system-setting-detail-dialog.component.css',
})
export class SystemSettingDetailDialogComponent {
  protected readonly data = inject<SystemSetting>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<SystemSettingDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
