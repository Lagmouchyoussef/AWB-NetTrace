import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Room } from '../../../super-admin/pages/rooms/room.model';

@Component({
  selector: 'app-dc-admin-room-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './room-detail-dialog.component.html',
  styleUrl: './room-detail-dialog.component.css',
})
export class DcAdminRoomDetailDialogComponent {
  protected readonly data = inject<Room>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<DcAdminRoomDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
