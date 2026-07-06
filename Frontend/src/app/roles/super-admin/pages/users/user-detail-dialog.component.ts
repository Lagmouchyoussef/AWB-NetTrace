import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { AppUser } from './user.model';

@Component({
  selector: 'app-user-detail-dialog',
  standalone: true,
  imports: [DatePipe, MatDialogModule, TranslatePipe],
  templateUrl: './user-detail-dialog.component.html',
  styleUrl: './user-detail-dialog.component.css',
})
export class UserDetailDialogComponent {
  protected readonly data = inject<AppUser>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<UserDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
