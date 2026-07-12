import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { SystemSetting } from '../../../super-admin/pages/system-settings/system-setting.model';

@Component({
  selector: 'app-auditor-system-setting-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './system-setting-detail-dialog.component.html',
  styleUrl: './system-setting-detail-dialog.component.css',
})
export class AuditorSystemSettingDetailDialogComponent {
  protected readonly data = inject<SystemSetting>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<AuditorSystemSettingDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
