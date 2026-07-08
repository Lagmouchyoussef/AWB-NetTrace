import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { NetworkEngineerTechnologyCatalogService } from '../../../../../core/services/network-engineer-technology-catalog.service';
import {
  TECHNOLOGY_CATALOG_STATUSES,
  TECHNOLOGY_CATEGORIES,
  TechnologyCatalogEntry,
  TechnologyCatalogStatus,
  TechnologyCategory,
} from '../../../../super-admin/pages/technology-catalog/technology-catalog-entry.model';

@Component({
  selector: 'app-ne-technology-catalog-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './technology-catalog-form-dialog.component.html',
  styleUrl: './technology-catalog-form-dialog.component.css',
})
export class NeTechnologyCatalogFormDialogComponent {
  private readonly technologyCatalogService = inject(NetworkEngineerTechnologyCatalogService);
  private readonly dialogRef = inject(
    MatDialogRef<NeTechnologyCatalogFormDialogComponent, boolean>,
  );
  protected readonly data = inject<TechnologyCatalogEntry | null>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data !== null;
  protected readonly categories = TECHNOLOGY_CATEGORIES;
  protected readonly statuses = TECHNOLOGY_CATALOG_STATUSES;
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
    category: new FormControl<TechnologyCategory>(this.data?.category ?? 'NETWORKING_PROTOCOL', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    vendor: new FormControl(this.data?.vendor ?? ''),
    version: new FormControl(this.data?.version ?? ''),
    description: new FormControl(this.data?.description ?? ''),
    status: new FormControl<TechnologyCatalogStatus>(this.data?.status ?? 'EVALUATION', {
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
        await this.technologyCatalogService.update(this.data.id, value);
      } else {
        await this.technologyCatalogService.create(value);
      }
      this.dialogRef.close(true);
    } catch {
      this.errorKey.set('technologyCatalog.saveError');
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
