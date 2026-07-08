import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { DcAdminDeviceService } from '../../../../core/services/dc-admin-device.service';
import { DcAdminPathTraceService } from '../../../../core/services/dc-admin-path-trace.service';
import { Device } from '../../../super-admin/pages/devices/device.model';
import {
  PATH_TRACE_STATUSES,
  PathTrace,
  PathTraceStatus,
} from '../../../super-admin/pages/path-traces/path-trace.model';

@Component({
  selector: 'app-dc-admin-path-trace-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './path-trace-form-dialog.component.html',
  styleUrl: './path-trace-form-dialog.component.css',
})
export class DcAdminPathTraceFormDialogComponent implements OnInit {
  private readonly pathTraceService = inject(DcAdminPathTraceService);
  private readonly deviceService = inject(DcAdminDeviceService);
  private readonly dialogRef = inject(MatDialogRef<DcAdminPathTraceFormDialogComponent, boolean>);
  protected readonly data = inject<PathTrace | null>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data !== null;
  protected readonly statuses = PATH_TRACE_STATUSES;
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
    hopCount: new FormControl<number | null>(this.data?.hopCount ?? 1, {
      validators: [Validators.required],
    }),
    totalLengthMeters: new FormControl<number | null>(this.data?.totalLengthMeters ?? null),
    status: new FormControl<PathTraceStatus>(this.data?.status ?? 'PENDING', {
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
        await this.pathTraceService.update(this.data.id, {
          ...value,
          sourceDeviceId: value.sourceDeviceId!,
          targetDeviceId: value.targetDeviceId!,
          hopCount: value.hopCount!,
        });
      } else {
        await this.pathTraceService.create({
          ...value,
          sourceDeviceId: value.sourceDeviceId!,
          targetDeviceId: value.targetDeviceId!,
          hopCount: value.hopCount!,
        });
      }
      this.dialogRef.close(true);
    } catch {
      this.errorKey.set('pathTraces.saveError');
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
