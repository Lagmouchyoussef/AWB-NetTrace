import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { NetworkEngineerDeviceService } from '../../../../core/services/network-engineer-device.service';
import { NetworkEngineerInterventionService } from '../../../../core/services/network-engineer-intervention.service';
import { Device } from '../../../super-admin/pages/devices/device.model';
import {
  INTERVENTION_PRIORITIES,
  INTERVENTION_TYPES,
  InterventionPriority,
  InterventionType,
} from '../../../super-admin/pages/interventions/intervention.model';

function fromDateTimeLocal(local: string): string {
  return new Date(local).toISOString();
}

// Create-only: this role submits requests, it doesn't set operational status, assign a
// technician, or mark completion - those fields are hardcoded (status: SCHEDULED) and left off
// this form entirely.
@Component({
  selector: 'app-ne-intervention-request-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './intervention-request-form-dialog.component.html',
  styleUrl: './intervention-request-form-dialog.component.css',
})
export class NeInterventionRequestFormDialogComponent implements OnInit {
  private readonly interventionService = inject(NetworkEngineerInterventionService);
  private readonly deviceService = inject(NetworkEngineerDeviceService);
  private readonly dialogRef = inject(
    MatDialogRef<NeInterventionRequestFormDialogComponent, boolean>,
  );

  protected readonly interventionTypes = INTERVENTION_TYPES;
  protected readonly priorities = INTERVENTION_PRIORITIES;
  protected readonly saving = signal(false);
  protected readonly errorKey = signal<string | null>(null);
  protected readonly devices = signal<Device[]>([]);

  protected readonly form = new FormGroup({
    deviceId: new FormControl<number | null>(null, { validators: [Validators.required] }),
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl(''),
    interventionType: new FormControl<InterventionType>('CORRECTIVE_MAINTENANCE', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    priority: new FormControl<InterventionPriority>('MEDIUM', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    scheduledAt: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
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
      await this.interventionService.create({
        deviceId: value.deviceId!,
        title: value.title,
        description: value.description || null,
        interventionType: value.interventionType,
        priority: value.priority,
        status: 'SCHEDULED',
        scheduledAt: fromDateTimeLocal(value.scheduledAt),
      });
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
