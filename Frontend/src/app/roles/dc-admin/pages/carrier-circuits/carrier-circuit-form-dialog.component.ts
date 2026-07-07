import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { DcAdminSdwanEdgeService } from '../../../../core/services/dc-admin-sdwan-edge.service';
import { DcAdminCarrierCircuitService } from '../../../../core/services/dc-admin-carrier-circuit.service';
import { SdwanEdge } from '../../../super-admin/pages/sdwan-edges/sdwan-edge.model';
import {
  CARRIER_CIRCUIT_STATUSES,
  CARRIER_CIRCUIT_TYPES,
  CarrierCircuit,
  CarrierCircuitStatus,
  CarrierCircuitType,
} from '../../../super-admin/pages/carrier-circuits/carrier-circuit.model';

@Component({
  selector: 'app-dc-admin-carrier-circuit-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './carrier-circuit-form-dialog.component.html',
  styleUrl: './carrier-circuit-form-dialog.component.css',
})
export class DcAdminCarrierCircuitFormDialogComponent implements OnInit {
  private readonly carrierCircuitService = inject(DcAdminCarrierCircuitService);
  private readonly sdwanEdgeService = inject(DcAdminSdwanEdgeService);
  private readonly dialogRef = inject(
    MatDialogRef<DcAdminCarrierCircuitFormDialogComponent, boolean>,
  );
  protected readonly data = inject<CarrierCircuit | null>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data !== null;
  protected readonly circuitTypes = CARRIER_CIRCUIT_TYPES;
  protected readonly statuses = CARRIER_CIRCUIT_STATUSES;
  protected readonly saving = signal(false);
  protected readonly errorKey = signal<string | null>(null);
  protected readonly edges = signal<SdwanEdge[]>([]);

  protected readonly form = new FormGroup({
    edgeId: new FormControl<number | null>(this.data?.edgeId ?? null, {
      validators: [Validators.required],
    }),
    name: new FormControl(this.data?.name ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    code: new FormControl(this.data?.code ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    circuitType: new FormControl<CarrierCircuitType>(this.data?.circuitType ?? 'MPLS', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    provider: new FormControl(this.data?.provider ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    bandwidthMbps: new FormControl<number | null>(this.data?.bandwidthMbps ?? 100, {
      validators: [Validators.required],
    }),
    status: new FormControl<CarrierCircuitStatus>(this.data?.status ?? 'ACTIVE', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    notes: new FormControl(this.data?.notes ?? ''),
  });

  async ngOnInit(): Promise<void> {
    const result = await this.sdwanEdgeService.list({ page: 0, size: 1000 });
    this.edges.set(result.content);
  }

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorKey.set(null);
    const value = this.form.getRawValue();
    try {
      if (this.data) {
        await this.carrierCircuitService.update(this.data.id, {
          ...value,
          edgeId: value.edgeId!,
          bandwidthMbps: value.bandwidthMbps!,
        });
      } else {
        await this.carrierCircuitService.create({
          ...value,
          edgeId: value.edgeId!,
          bandwidthMbps: value.bandwidthMbps!,
        });
      }
      this.dialogRef.close(true);
    } catch {
      this.errorKey.set('carrierCircuits.saveError');
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
