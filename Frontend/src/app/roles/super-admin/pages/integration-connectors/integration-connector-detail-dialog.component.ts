import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { IntegrationConnector } from './integration-connector.model';

@Component({
  selector: 'app-integration-connector-detail-dialog',
  standalone: true,
  imports: [DatePipe, MatDialogModule, TranslatePipe],
  templateUrl: './integration-connector-detail-dialog.component.html',
  styleUrl: './integration-connector-detail-dialog.component.css',
})
export class IntegrationConnectorDetailDialogComponent {
  protected readonly data = inject<IntegrationConnector>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<IntegrationConnectorDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
