import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { DeviceService } from '../../../../core/services/device.service';
import { IntegrationConnectorService } from '../../../../core/services/integration-connector.service';
import { Device } from '../devices/device.model';
import {
  AUTOMATION_TYPES,
  AutomationType,
  INTEGRATION_CONNECTOR_STATUSES,
  INTEGRATION_PROTOCOLS,
  IntegrationConnector,
  IntegrationConnectorStatus,
  IntegrationProtocol,
} from './integration-connector.model';

function toDateTimeLocal(iso: string | null): string {
  if (!iso) {
    return '';
  }
  const date = new Date(iso);
  const offsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function fromDateTimeLocal(local: string | null): string | null {
  if (!local) {
    return null;
  }
  return new Date(local).toISOString();
}

@Component({
  selector: 'app-integration-connector-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './integration-connector-form-dialog.component.html',
  styleUrl: './integration-connector-form-dialog.component.css',
})
export class IntegrationConnectorFormDialogComponent implements OnInit {
  private readonly integrationConnectorService = inject(IntegrationConnectorService);
  private readonly deviceService = inject(DeviceService);
  private readonly dialogRef = inject(
    MatDialogRef<IntegrationConnectorFormDialogComponent, boolean>,
  );
  protected readonly data = inject<IntegrationConnector | null>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data !== null;
  protected readonly protocols = INTEGRATION_PROTOCOLS;
  protected readonly automationTypes = AUTOMATION_TYPES;
  protected readonly statuses = INTEGRATION_CONNECTOR_STATUSES;
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
    protocol: new FormControl<IntegrationProtocol>(this.data?.protocol ?? 'SNMP_V2C', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    automationType: new FormControl<AutomationType>(this.data?.automationType ?? 'CONFIG_BACKUP', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    status: new FormControl<IntegrationConnectorStatus>(this.data?.status ?? 'ACTIVE', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastSyncAt: new FormControl(toDateTimeLocal(this.data?.lastSyncAt ?? null)),
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
    const request = {
      ...value,
      deviceId: value.deviceId!,
      lastSyncAt: fromDateTimeLocal(value.lastSyncAt),
    };
    try {
      if (this.data) {
        await this.integrationConnectorService.update(this.data.id, request);
      } else {
        await this.integrationConnectorService.create(request);
      }
      this.dialogRef.close(true);
    } catch {
      this.errorKey.set('integrationConnectors.saveError');
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
