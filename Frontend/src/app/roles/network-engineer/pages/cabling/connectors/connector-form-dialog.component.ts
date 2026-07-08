import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { NetworkEngineerDeviceService } from '../../../../../core/services/network-engineer-device.service';
import { NetworkEngineerConnectorService } from '../../../../../core/services/network-engineer-connector.service';
import { Device } from '../../../../super-admin/pages/devices/device.model';
import {
  CONNECTOR_FORM_FACTORS,
  CONNECTOR_STATUSES,
  CONNECTOR_TYPES,
  Connector,
  ConnectorFormFactor,
  ConnectorStatus,
  ConnectorType,
} from '../../../../super-admin/pages/connectors/connector.model';

@Component({
  selector: 'app-ne-connector-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './connector-form-dialog.component.html',
  styleUrl: './connector-form-dialog.component.css',
})
export class NeConnectorFormDialogComponent implements OnInit {
  private readonly connectorService = inject(NetworkEngineerConnectorService);
  private readonly deviceService = inject(NetworkEngineerDeviceService);
  private readonly dialogRef = inject(MatDialogRef<NeConnectorFormDialogComponent, boolean>);
  protected readonly data = inject<Connector | null>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data !== null;
  protected readonly formFactors = CONNECTOR_FORM_FACTORS;
  protected readonly connectorTypes = CONNECTOR_TYPES;
  protected readonly statuses = CONNECTOR_STATUSES;
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
    formFactor: new FormControl<ConnectorFormFactor>(this.data?.formFactor ?? 'SFP28', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    connectorType: new FormControl<ConnectorType>(this.data?.connectorType ?? 'LC', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    speedGbps: new FormControl<number | null>(this.data?.speedGbps ?? 25, {
      validators: [Validators.required],
    }),
    wavelengthNm: new FormControl<number | null>(this.data?.wavelengthNm ?? null),
    status: new FormControl<ConnectorStatus>(this.data?.status ?? 'ACTIVE', {
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
        await this.connectorService.update(this.data.id, {
          ...value,
          deviceId: value.deviceId!,
          speedGbps: value.speedGbps!,
        });
      } else {
        await this.connectorService.create({
          ...value,
          deviceId: value.deviceId!,
          speedGbps: value.speedGbps!,
        });
      }
      this.dialogRef.close(true);
    } catch {
      this.errorKey.set('connectors.saveError');
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
