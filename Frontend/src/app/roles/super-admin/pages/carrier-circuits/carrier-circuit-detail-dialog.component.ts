import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { CarrierCircuit } from './carrier-circuit.model';

@Component({
  selector: 'app-carrier-circuit-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './carrier-circuit-detail-dialog.component.html',
  styleUrl: './carrier-circuit-detail-dialog.component.css',
})
export class CarrierCircuitDetailDialogComponent {
  protected readonly data = inject<CarrierCircuit>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<CarrierCircuitDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
