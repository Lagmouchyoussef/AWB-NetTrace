import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { SystemSettingService } from '../../../../core/services/system-setting.service';
import {
  SYSTEM_SETTING_CATEGORIES,
  SYSTEM_SETTING_DATA_TYPES,
  SystemSetting,
  SystemSettingCategory,
  SystemSettingDataType,
} from './system-setting.model';

@Component({
  selector: 'app-system-setting-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './system-setting-form-dialog.component.html',
  styleUrl: './system-setting-form-dialog.component.css',
})
export class SystemSettingFormDialogComponent {
  private readonly systemSettingService = inject(SystemSettingService);
  private readonly dialogRef = inject(MatDialogRef<SystemSettingFormDialogComponent, boolean>);
  protected readonly data = inject<SystemSetting | null>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data !== null;
  protected readonly categories = SYSTEM_SETTING_CATEGORIES;
  protected readonly dataTypes = SYSTEM_SETTING_DATA_TYPES;
  protected readonly saving = signal(false);
  protected readonly errorKey = signal<string | null>(null);

  protected readonly form = new FormGroup({
    settingKey: new FormControl(this.data?.settingKey ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    settingValue: new FormControl(this.data?.settingValue ?? ''),
    category: new FormControl<SystemSettingCategory>(this.data?.category ?? 'GENERAL', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    dataType: new FormControl<SystemSettingDataType>(this.data?.dataType ?? 'STRING', {
      nonNullable: true,
      validators: [Validators.required],
    }),
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
    try {
      if (this.data) {
        await this.systemSettingService.update(this.data.id, value);
      } else {
        await this.systemSettingService.create(value);
      }
      this.dialogRef.close(true);
    } catch {
      this.errorKey.set('systemSettings.saveError');
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
