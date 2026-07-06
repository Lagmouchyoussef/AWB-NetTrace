import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { TelemetryConnector } from './telemetry-connector.model';

@Component({
  selector: 'app-telemetry-connector-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './telemetry-connector-detail-dialog.component.html',
  styleUrl: './telemetry-connector-detail-dialog.component.css',
})
export class TelemetryConnectorDetailDialogComponent {
  protected readonly data = inject<TelemetryConnector>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<TelemetryConnectorDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
