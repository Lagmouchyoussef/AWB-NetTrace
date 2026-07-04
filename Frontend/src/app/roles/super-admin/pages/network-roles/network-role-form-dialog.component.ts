import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { DeviceService } from '../../../../core/services/device.service';
import { NetworkRoleService } from '../../../../core/services/network-role.service';
import { Device } from '../devices/device.model';
import {
  NETWORK_ROLE_STATUSES,
  NETWORK_ROLE_TYPES,
  NetworkRole,
  NetworkRoleStatus,
  NetworkRoleType,
} from './network-role.model';

@Component({
  selector: 'app-network-role-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './network-role-form-dialog.component.html',
  styleUrl: './network-role-form-dialog.component.css',
})
export class NetworkRoleFormDialogComponent implements OnInit {
  private readonly networkRoleService = inject(NetworkRoleService);
  private readonly deviceService = inject(DeviceService);
  private readonly dialogRef = inject(MatDialogRef<NetworkRoleFormDialogComponent, boolean>);
  protected readonly data = inject<NetworkRole | null>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data !== null;
  protected readonly roleTypes = NETWORK_ROLE_TYPES;
  protected readonly statuses = NETWORK_ROLE_STATUSES;
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
    roleType: new FormControl<NetworkRoleType>(this.data?.roleType ?? 'LEAF', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    asn: new FormControl<number | null>(this.data?.asn ?? null),
    loopbackIp: new FormControl(this.data?.loopbackIp ?? ''),
    podNumber: new FormControl<number | null>(this.data?.podNumber ?? null),
    status: new FormControl<NetworkRoleStatus>(this.data?.status ?? 'ACTIVE', {
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
        await this.networkRoleService.update(this.data.id, {
          ...value,
          deviceId: value.deviceId!,
        });
      } else {
        await this.networkRoleService.create({ ...value, deviceId: value.deviceId! });
      }
      this.dialogRef.close(true);
    } catch {
      this.errorKey.set('networkRoles.saveError');
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
