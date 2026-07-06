import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { DeviceService } from '../../../../core/services/device.service';
import { TelemetryConnectorService } from '../../../../core/services/telemetry-connector.service';
import { Device } from '../devices/device.model';
import {
  TELEMETRY_CONNECTOR_STATUSES,
  TELEMETRY_PROTOCOLS,
  TelemetryConnector,
  TelemetryConnectorStatus,
  TelemetryProtocol,
} from './telemetry-connector.model';

@Component({
  selector: 'app-telemetry-connector-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './telemetry-connector-form-dialog.component.html',
  styleUrl: './telemetry-connector-form-dialog.component.css',
})
export class TelemetryConnectorFormDialogComponent implements OnInit {
  private readonly telemetryConnectorService = inject(TelemetryConnectorService);
  private readonly deviceService = inject(DeviceService);
  private readonly dialogRef = inject(MatDialogRef<TelemetryConnectorFormDialogComponent, boolean>);
  protected readonly data = inject<TelemetryConnector | null>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data !== null;
  protected readonly protocols = TELEMETRY_PROTOCOLS;
  protected readonly statuses = TELEMETRY_CONNECTOR_STATUSES;
  protected readonly saving = signal(false);
  protected readonly errorKey = signal<string | null>(null);
  protected readonly devices = signal<Device[]>([]);

  protected readonly form = new FormGroup({
    deviceId: new FormControl<number | null>(this.data?.deviceId ?? null, {
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
    protocol: new FormControl<TelemetryProtocol>(this.data?.protocol ?? 'SNMP_V2C', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    pollIntervalSeconds: new FormControl<number | null>(this.data?.pollIntervalSeconds ?? null),
    status: new FormControl<TelemetryConnectorStatus>(this.data?.status ?? 'ACTIVE', {
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
        await this.telemetryConnectorService.update(this.data.id, {
          ...value,
          deviceId: value.deviceId!,
        });
      } else {
        await this.telemetryConnectorService.create({ ...value, deviceId: value.deviceId! });
      }
      this.dialogRef.close(true);
    } catch {
      this.errorKey.set('telemetryConnectors.saveError');
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
