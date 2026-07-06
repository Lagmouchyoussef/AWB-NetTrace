import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { DeviceService } from '../../../../core/services/device.service';
import { InterventionService } from '../../../../core/services/intervention.service';
import { Device } from '../devices/device.model';
import {
  INTERVENTION_PRIORITIES,
  INTERVENTION_STATUSES,
  INTERVENTION_TYPES,
  Intervention,
  InterventionPriority,
  InterventionStatus,
  InterventionType,
} from './intervention.model';

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
  selector: 'app-intervention-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './intervention-form-dialog.component.html',
  styleUrl: './intervention-form-dialog.component.css',
})
export class InterventionFormDialogComponent implements OnInit {
  private readonly interventionService = inject(InterventionService);
  private readonly deviceService = inject(DeviceService);
  private readonly dialogRef = inject(MatDialogRef<InterventionFormDialogComponent, boolean>);
  protected readonly data = inject<Intervention | null>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data !== null;
  protected readonly interventionTypes = INTERVENTION_TYPES;
  protected readonly priorities = INTERVENTION_PRIORITIES;
  protected readonly statuses = INTERVENTION_STATUSES;
  protected readonly saving = signal(false);
  protected readonly errorKey = signal<string | null>(null);
  protected readonly devices = signal<Device[]>([]);

  protected readonly form = new FormGroup({
    deviceId: new FormControl<number | null>(this.data?.deviceId ?? null, {
      validators: [Validators.required],
    }),
    title: new FormControl(this.data?.title ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl(this.data?.description ?? ''),
    interventionType: new FormControl<InterventionType>(
      this.data?.interventionType ?? 'PREVENTIVE_MAINTENANCE',
      { nonNullable: true, validators: [Validators.required] },
    ),
    priority: new FormControl<InterventionPriority>(this.data?.priority ?? 'MEDIUM', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    status: new FormControl<InterventionStatus>(this.data?.status ?? 'SCHEDULED', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    assignedTechnician: new FormControl(this.data?.assignedTechnician ?? ''),
    scheduledAt: new FormControl(toDateTimeLocal(this.data?.scheduledAt ?? null), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    completedAt: new FormControl(toDateTimeLocal(this.data?.completedAt ?? null)),
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
      scheduledAt: fromDateTimeLocal(value.scheduledAt)!,
      completedAt: fromDateTimeLocal(value.completedAt),
    };
    try {
      if (this.data) {
        await this.interventionService.update(this.data.id, request);
      } else {
        await this.interventionService.create(request);
      }
      this.dialogRef.close(true);
    } catch {
      this.errorKey.set('interventions.saveError');
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
