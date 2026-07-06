import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { ReportService } from '../../../../core/services/report.service';
import {
  REPORT_FORMATS,
  REPORT_SCHEDULES,
  REPORT_STATUSES,
  REPORT_TYPES,
  Report,
  ReportFormat,
  ReportSchedule,
  ReportStatus,
  ReportType,
} from './report.model';

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
  selector: 'app-report-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './report-form-dialog.component.html',
  styleUrl: './report-form-dialog.component.css',
})
export class ReportFormDialogComponent {
  private readonly reportService = inject(ReportService);
  private readonly dialogRef = inject(MatDialogRef<ReportFormDialogComponent, boolean>);
  protected readonly data = inject<Report | null>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data !== null;
  protected readonly reportTypes = REPORT_TYPES;
  protected readonly formats = REPORT_FORMATS;
  protected readonly schedules = REPORT_SCHEDULES;
  protected readonly statuses = REPORT_STATUSES;
  protected readonly saving = signal(false);
  protected readonly errorKey = signal<string | null>(null);

  protected readonly form = new FormGroup({
    name: new FormControl(this.data?.name ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    code: new FormControl(this.data?.code ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    reportType: new FormControl<ReportType>(this.data?.reportType ?? 'INVENTORY', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    format: new FormControl<ReportFormat>(this.data?.format ?? 'PDF', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    schedule: new FormControl<ReportSchedule>(this.data?.schedule ?? 'ON_DEMAND', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    status: new FormControl<ReportStatus>(this.data?.status ?? 'DRAFT', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastGeneratedAt: new FormControl(toDateTimeLocal(this.data?.lastGeneratedAt ?? null)),
    description: new FormControl(this.data?.description ?? ''),
    notes: new FormControl(this.data?.notes ?? ''),
  });

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorKey.set(null);
    const value = this.form.getRawValue();
    const request = { ...value, lastGeneratedAt: fromDateTimeLocal(value.lastGeneratedAt) };
    try {
      if (this.data) {
        await this.reportService.update(this.data.id, request);
      } else {
        await this.reportService.create(request);
      }
      this.dialogRef.close(true);
    } catch {
      this.errorKey.set('reports.saveError');
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
