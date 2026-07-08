import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { DcAdminDeviceService } from '../../../../core/services/dc-admin-device.service';
import { DcAdminCableService } from '../../../../core/services/dc-admin-cable.service';
import { Device } from '../../../super-admin/pages/devices/device.model';
import {
  CABLE_STATUSES,
  CABLE_TYPES,
  Cable,
  CableStatus,
  CableType,
} from '../../../super-admin/pages/cables/cable.model';

@Component({
  selector: 'app-dc-admin-cable-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './cable-form-dialog.component.html',
  styleUrl: './cable-form-dialog.component.css',
})
export class DcAdminCableFormDialogComponent implements OnInit {
  private readonly cableService = inject(DcAdminCableService);
  private readonly deviceService = inject(DcAdminDeviceService);
  private readonly dialogRef = inject(MatDialogRef<DcAdminCableFormDialogComponent, boolean>);
  protected readonly data = inject<Cable | null>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data !== null;
  protected readonly cableTypes = CABLE_TYPES;
  protected readonly statuses = CABLE_STATUSES;
  protected readonly saving = signal(false);
  protected readonly errorKey = signal<string | null>(null);
  protected readonly devices = signal<Device[]>([]);

  protected readonly form = new FormGroup({
    sourceDeviceId: new FormControl<number | null>(this.data?.sourceDeviceId ?? null, {
      validators: [Validators.required],
    }),
    targetDeviceId: new FormControl<number | null>(this.data?.targetDeviceId ?? null, {
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
    cableType: new FormControl<CableType>(this.data?.cableType ?? 'FIBER_OM4', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lengthMeters: new FormControl<number | null>(this.data?.lengthMeters ?? null, {
      validators: [Validators.required],
    }),
    status: new FormControl<CableStatus>(this.data?.status ?? 'CONNECTED', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    notes: new FormControl(this.data?.notes ?? ''),
  });

  async ngOnInit(): Promise<void> {
    const result = await this.deviceService.list({ page: 0, size: 1000 });
    this.devices.set(result.content);
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
        await this.cableService.update(this.data.id, {
          ...value,
          sourceDeviceId: value.sourceDeviceId!,
          targetDeviceId: value.targetDeviceId!,
          lengthMeters: value.lengthMeters!,
        });
      } else {
        await this.cableService.create({
          ...value,
          sourceDeviceId: value.sourceDeviceId!,
          targetDeviceId: value.targetDeviceId!,
          lengthMeters: value.lengthMeters!,
        });
      }
      this.dialogRef.close(true);
    } catch {
      this.errorKey.set('cables.saveError');
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
