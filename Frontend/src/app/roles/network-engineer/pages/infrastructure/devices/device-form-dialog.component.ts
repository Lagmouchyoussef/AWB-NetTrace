import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { NetworkEngineerRackService } from '../../../../../core/services/network-engineer-rack.service';
import { NetworkEngineerDeviceService } from '../../../../../core/services/network-engineer-device.service';
import { Rack } from '../../../../super-admin/pages/racks/rack.model';
import {
  DEVICE_STATUSES,
  DEVICE_TYPES,
  Device,
  DeviceStatus,
  DeviceType,
} from '../../../../super-admin/pages/devices/device.model';

@Component({
  selector: 'app-ne-device-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './device-form-dialog.component.html',
  styleUrl: './device-form-dialog.component.css',
})
export class NeDeviceFormDialogComponent implements OnInit {
  private readonly deviceService = inject(NetworkEngineerDeviceService);
  private readonly rackService = inject(NetworkEngineerRackService);
  private readonly dialogRef = inject(MatDialogRef<NeDeviceFormDialogComponent, boolean>);
  protected readonly data = inject<Device | null>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data !== null;
  protected readonly deviceTypes = DEVICE_TYPES;
  protected readonly statuses = DEVICE_STATUSES;
  protected readonly saving = signal(false);
  protected readonly errorKey = signal<string | null>(null);
  protected readonly racks = signal<Rack[]>([]);

  protected readonly form = new FormGroup({
    rackId: new FormControl<number | null>(this.data?.rackId ?? null, {
      validators: [Validators.required],
    }),
    name: new FormControl(this.data?.name ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    deviceType: new FormControl<DeviceType>(this.data?.deviceType ?? 'SWITCH', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    manufacturer: new FormControl(this.data?.manufacturer ?? ''),
    model: new FormControl(this.data?.model ?? ''),
    serialNumber: new FormControl(this.data?.serialNumber ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    positionUStart: new FormControl<number | null>(this.data?.positionUStart ?? 1, {
      validators: [Validators.required],
    }),
    heightU: new FormControl<number | null>(this.data?.heightU ?? 1, {
      validators: [Validators.required],
    }),
    powerConsumptionW: new FormControl<number | null>(this.data?.powerConsumptionW ?? null),
    managementIp: new FormControl(this.data?.managementIp ?? ''),
    status: new FormControl<DeviceStatus>(this.data?.status ?? 'ACTIVE', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    notes: new FormControl(this.data?.notes ?? ''),
  });

  async ngOnInit(): Promise<void> {
    const result = await this.rackService.list({ page: 0, size: 1000 });
    this.racks.set(result.content);
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
        await this.deviceService.update(this.data.id, {
          ...value,
          rackId: value.rackId!,
          positionUStart: value.positionUStart!,
          heightU: value.heightU!,
        });
      } else {
        await this.deviceService.create({
          ...value,
          rackId: value.rackId!,
          positionUStart: value.positionUStart!,
          heightU: value.heightU!,
        });
      }
      this.dialogRef.close(true);
    } catch {
      this.errorKey.set('devices.saveError');
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
