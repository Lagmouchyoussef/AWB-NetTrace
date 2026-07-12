import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { ApproverDeviceService } from '../../../../core/services/approver-device.service';
import { ApproverInterventionService } from '../../../../core/services/approver-intervention.service';
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

// Create-only, mirrors Network Engineer's NeInterventionRequestFormDialogComponent exactly: this
// role submits requests (acting as a requester here), it doesn't set operational status, assign a
// technician, or mark completion - those are hardcoded/left off entirely. Segregation of duties
// (can't approve your own request) is enforced server-side regardless of what this form allows.
@Component({
  selector: 'app-approver-request-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './request-form-dialog.component.html',
  styleUrl: './request-form-dialog.component.css',
})
export class ApproverRequestFormDialogComponent implements OnInit {
  private readonly interventionService = inject(ApproverInterventionService);
  private readonly deviceService = inject(ApproverDeviceService);
  private readonly dialogRef = inject(MatDialogRef<ApproverRequestFormDialogComponent, boolean>);

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
      await this.interventionService.createRequest({
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
