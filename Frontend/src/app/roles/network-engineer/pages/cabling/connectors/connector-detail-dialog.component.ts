import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Connector } from '../../../../super-admin/pages/connectors/connector.model';

@Component({
  selector: 'app-ne-connector-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './connector-detail-dialog.component.html',
  styleUrl: './connector-detail-dialog.component.css',
})
export class NeConnectorDetailDialogComponent {
  protected readonly data = inject<Connector>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<NeConnectorDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
