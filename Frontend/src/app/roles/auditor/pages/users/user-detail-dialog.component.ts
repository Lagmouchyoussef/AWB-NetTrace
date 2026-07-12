import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { AppUser } from '../../../super-admin/pages/users/user.model';

@Component({
  selector: 'app-auditor-user-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './user-detail-dialog.component.html',
  styleUrl: './user-detail-dialog.component.css',
})
export class AuditorUserDetailDialogComponent {
  protected readonly data = inject<AppUser>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<AuditorUserDetailDialogComponent>);

  protected formatDate(value: string): string {
    return new Date(value).toLocaleString();
  }

  protected close(): void {
    this.dialogRef.close();
  }
}
