import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { RealTimeDashboardService } from '../../../../core/services/real-time-dashboard.service';
import {
  REAL_TIME_DASHBOARD_STATUSES,
  RealTimeDashboard,
  RealTimeDashboardStatus,
} from './real-time-dashboard.model';

@Component({
  selector: 'app-real-time-dashboard-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './real-time-dashboard-form-dialog.component.html',
  styleUrl: './real-time-dashboard-form-dialog.component.css',
})
export class RealTimeDashboardFormDialogComponent {
  private readonly realTimeDashboardService = inject(RealTimeDashboardService);
  private readonly dialogRef = inject(MatDialogRef<RealTimeDashboardFormDialogComponent, boolean>);
  protected readonly data = inject<RealTimeDashboard | null>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data !== null;
  protected readonly statuses = REAL_TIME_DASHBOARD_STATUSES;
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
    description: new FormControl(this.data?.description ?? ''),
    refreshIntervalSeconds: new FormControl(this.data?.refreshIntervalSeconds ?? 30, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    widgetCount: new FormControl(this.data?.widgetCount ?? 1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    status: new FormControl<RealTimeDashboardStatus>(this.data?.status ?? 'DRAFT', {
      nonNullable: true,
      validators: [Validators.required],
    }),
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
    try {
      if (this.data) {
        await this.realTimeDashboardService.update(this.data.id, value);
      } else {
        await this.realTimeDashboardService.create(value);
      }
      this.dialogRef.close(true);
    } catch {
      this.errorKey.set('realTimeDashboards.saveError');
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
