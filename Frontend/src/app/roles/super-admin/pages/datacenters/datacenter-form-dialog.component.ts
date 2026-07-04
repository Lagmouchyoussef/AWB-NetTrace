import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { DatacenterService } from '../../../../core/services/datacenter.service';
import {
  DATACENTER_STATUSES,
  DATACENTER_TIERS,
  Datacenter,
  DatacenterStatus,
  DatacenterTier,
} from './datacenter.model';

@Component({
  selector: 'app-datacenter-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './datacenter-form-dialog.component.html',
  styleUrl: './datacenter-form-dialog.component.css',
})
export class DatacenterFormDialogComponent {
  private readonly datacenterService = inject(DatacenterService);
  private readonly dialogRef = inject(MatDialogRef<DatacenterFormDialogComponent, boolean>);
  protected readonly data = inject<Datacenter | null>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data !== null;
  protected readonly tiers = DATACENTER_TIERS;
  protected readonly statuses = DATACENTER_STATUSES;
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
    city: new FormControl(this.data?.city ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    country: new FormControl(this.data?.country ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    address: new FormControl(this.data?.address ?? ''),
    tier: new FormControl<DatacenterTier>(this.data?.tier ?? 'TIER_III', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    status: new FormControl<DatacenterStatus>(this.data?.status ?? 'ACTIVE', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    totalPowerKw: new FormControl<number | null>(this.data?.totalPowerKw ?? null),
    totalSpaceSqm: new FormControl<number | null>(this.data?.totalSpaceSqm ?? null),
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
        await this.datacenterService.update(this.data.id, value);
      } else {
        await this.datacenterService.create(value);
      }
      this.dialogRef.close(true);
    } catch {
      this.errorKey.set('datacenters.saveError');
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
