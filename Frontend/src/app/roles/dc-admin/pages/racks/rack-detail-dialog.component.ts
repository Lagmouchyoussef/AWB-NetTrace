import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Rack } from '../../../super-admin/pages/racks/rack.model';

@Component({
  selector: 'app-dc-admin-rack-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './rack-detail-dialog.component.html',
  styleUrl: './rack-detail-dialog.component.css',
})
export class DcAdminRackDetailDialogComponent {
  protected readonly data = inject<Rack>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<DcAdminRackDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
