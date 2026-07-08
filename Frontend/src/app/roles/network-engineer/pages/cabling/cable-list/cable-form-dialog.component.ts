import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { NetworkEngineerDeviceService } from '../../../../../core/services/network-engineer-device.service';
import { NetworkEngineerCableService } from '../../../../../core/services/network-engineer-cable.service';
import { NetworkEngineerConnectorService } from '../../../../../core/services/network-engineer-connector.service';
import { Device } from '../../../../super-admin/pages/devices/device.model';
import { Connector } from '../../../../super-admin/pages/connectors/connector.model';
import {
  CABLE_STATUSES,
  CABLE_TYPES,
  Cable,
  CableStatus,
  CableType,
} from '../../../../super-admin/pages/cables/cable.model';

// Port picker (create mode only): free/occupied is read straight off Connector.status (SPARE =
// free) since Cable links devices, not specific connectors - there's no live cable->port
// reference to derive occupancy from otherwise. Picking a free port doesn't change what's sent
// to the Cable API (it has no port fields); instead, once the cable is created, that connector
// is flipped to ACTIVE so occupancy stays meaningful for the *next* cable created through this
// form. Editing an existing cable keeps the plain device-only flow, since which port an old
// cable used was never recorded.
@Component({
  selector: 'app-ne-cable-form-dialog',
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
export class NeCableFormDialogComponent implements OnInit {
  private readonly cableService = inject(NetworkEngineerCableService);
  private readonly deviceService = inject(NetworkEngineerDeviceService);
  private readonly connectorService = inject(NetworkEngineerConnectorService);
  private readonly dialogRef = inject(MatDialogRef<NeCableFormDialogComponent, boolean>);
  protected readonly data = inject<Cable | null>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data !== null;
  protected readonly cableTypes = CABLE_TYPES;
  protected readonly statuses = CABLE_STATUSES;
  protected readonly saving = signal(false);
  protected readonly errorKey = signal<string | null>(null);
  protected readonly devices = signal<Device[]>([]);
  protected readonly allConnectors = signal<Connector[]>([]);

  protected readonly selectedSourcePortId = signal<number | null>(null);
  protected readonly selectedTargetPortId = signal<number | null>(null);

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

  private readonly sourceDeviceIdSignal = toSignal(this.form.controls.sourceDeviceId.valueChanges, {
    initialValue: this.form.controls.sourceDeviceId.value,
  });
  private readonly targetDeviceIdSignal = toSignal(this.form.controls.targetDeviceId.valueChanges, {
    initialValue: this.form.controls.targetDeviceId.value,
  });

  protected readonly sourcePorts = computed(() => {
    const deviceId = this.sourceDeviceIdSignal();
    return deviceId === null ? [] : this.allConnectors().filter((c) => c.deviceId === deviceId);
  });

  protected readonly targetPorts = computed(() => {
    const deviceId = this.targetDeviceIdSignal();
    return deviceId === null ? [] : this.allConnectors().filter((c) => c.deviceId === deviceId);
  });

  async ngOnInit(): Promise<void> {
    const devicesResult = await this.deviceService.list({ page: 0, size: 1000 });
    this.devices.set(devicesResult.content);

    if (!this.isEdit) {
      const connectorsResult = await this.connectorService.list({ page: 0, size: 1000 });
      this.allConnectors.set(connectorsResult.content);
    }
  }

  protected onSourceDeviceChange(): void {
    this.selectedSourcePortId.set(null);
  }

  protected onTargetDeviceChange(): void {
    this.selectedTargetPortId.set(null);
  }

  protected selectSourcePort(port: Connector): void {
    if (port.status === 'SPARE') {
      this.selectedSourcePortId.set(port.id);
    }
  }

  protected selectTargetPort(port: Connector): void {
    if (port.status === 'SPARE') {
      this.selectedTargetPortId.set(port.id);
    }
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
        await this.markPortInUse(this.selectedSourcePortId(), this.sourcePorts());
        await this.markPortInUse(this.selectedTargetPortId(), this.targetPorts());
      }
      this.dialogRef.close(true);
    } catch {
      this.errorKey.set('cables.saveError');
    } finally {
      this.saving.set(false);
    }
  }

  private async markPortInUse(portId: number | null, candidates: Connector[]): Promise<void> {
    if (portId === null) {
      return;
    }
    const port = candidates.find((c) => c.id === portId);
    if (!port) {
      return;
    }
    await this.connectorService.update(port.id, {
      deviceId: port.deviceId,
      name: port.name,
      code: port.code,
      formFactor: port.formFactor,
      connectorType: port.connectorType,
      speedGbps: port.speedGbps,
      wavelengthNm: port.wavelengthNm,
      status: 'ACTIVE',
      notes: port.notes,
    });
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
