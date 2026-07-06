import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { DeviceService } from '../../../../core/services/device.service';
import { AnomalyDetectionService } from '../../../../core/services/anomaly-detection.service';
import { Device } from '../devices/device.model';
import {
  ANOMALY_DETECTION_STATUSES,
  ANOMALY_SEVERITIES,
  ANOMALY_TYPES,
  AnomalyDetection,
  AnomalyDetectionStatus,
  AnomalySeverity,
  AnomalyType,
} from './anomaly-detection.model';

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
  selector: 'app-anomaly-detection-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './anomaly-detection-form-dialog.component.html',
  styleUrl: './anomaly-detection-form-dialog.component.css',
})
export class AnomalyDetectionFormDialogComponent implements OnInit {
  private readonly anomalyDetectionService = inject(AnomalyDetectionService);
  private readonly deviceService = inject(DeviceService);
  private readonly dialogRef = inject(MatDialogRef<AnomalyDetectionFormDialogComponent, boolean>);
  protected readonly data = inject<AnomalyDetection | null>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data !== null;
  protected readonly anomalyTypes = ANOMALY_TYPES;
  protected readonly severities = ANOMALY_SEVERITIES;
  protected readonly statuses = ANOMALY_DETECTION_STATUSES;
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
    anomalyType: new FormControl<AnomalyType>(this.data?.anomalyType ?? 'THRESHOLD_BREACH', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    severity: new FormControl<AnomalySeverity>(this.data?.severity ?? 'MEDIUM', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    status: new FormControl<AnomalyDetectionStatus>(this.data?.status ?? 'OPEN', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    detectedAt: new FormControl(toDateTimeLocal(this.data?.detectedAt ?? null), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    resolvedAt: new FormControl(toDateTimeLocal(this.data?.resolvedAt ?? null)),
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
      detectedAt: fromDateTimeLocal(value.detectedAt)!,
      resolvedAt: fromDateTimeLocal(value.resolvedAt),
    };
    try {
      if (this.data) {
        await this.anomalyDetectionService.update(this.data.id, request);
      } else {
        await this.anomalyDetectionService.create(request);
      }
      this.dialogRef.close(true);
    } catch {
      this.errorKey.set('anomalyDetections.saveError');
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
