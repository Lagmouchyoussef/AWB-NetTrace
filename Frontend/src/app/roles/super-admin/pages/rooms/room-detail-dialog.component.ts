import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Room } from './room.model';

@Component({
  selector: 'app-room-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './room-detail-dialog.component.html',
  styleUrl: './room-detail-dialog.component.css',
})
export class RoomDetailDialogComponent {
  protected readonly data = inject<Room>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<RoomDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
