import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { NetworkEngineerEquipmentTypeService } from '../../../../../core/services/network-engineer-equipment-type.service';
import {
  EQUIPMENT_CATEGORIES,
  EQUIPMENT_TYPE_STATUSES,
  EquipmentCategory,
  EquipmentType,
  EquipmentTypeStatus,
} from '../../../../super-admin/pages/equipment-types/equipment-type.model';

@Component({
  selector: 'app-ne-equipment-type-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './equipment-type-form-dialog.component.html',
  styleUrl: './equipment-type-form-dialog.component.css',
})
export class NeEquipmentTypeFormDialogComponent {
  private readonly equipmentTypeService = inject(NetworkEngineerEquipmentTypeService);
  private readonly dialogRef = inject(MatDialogRef<NeEquipmentTypeFormDialogComponent, boolean>);
  protected readonly data = inject<EquipmentType | null>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data !== null;
  protected readonly categories = EQUIPMENT_CATEGORIES;
  protected readonly statuses = EQUIPMENT_TYPE_STATUSES;
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
    category: new FormControl<EquipmentCategory>(this.data?.category ?? 'NETWORKING', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    manufacturer: new FormControl(this.data?.manufacturer ?? ''),
    defaultRackUnits: new FormControl<number | null>(this.data?.defaultRackUnits ?? null),
    defaultPowerWatts: new FormControl<number | null>(this.data?.defaultPowerWatts ?? null),
    status: new FormControl<EquipmentTypeStatus>(this.data?.status ?? 'ACTIVE', {
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
        await this.equipmentTypeService.update(this.data.id, value);
      } else {
        await this.equipmentTypeService.create(value);
      }
      this.dialogRef.close(true);
    } catch {
      this.errorKey.set('equipmentTypes.saveError');
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
