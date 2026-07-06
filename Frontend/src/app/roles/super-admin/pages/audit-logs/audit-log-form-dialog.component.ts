import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { AuditLogService } from '../../../../core/services/audit-log.service';
import { AUDIT_ACTIONS, AuditAction, AuditLog } from './audit-log.model';

function toDateTimeLocal(iso: string | null): string {
  if (!iso) {
    return '';
  }
  const date = new Date(iso);
  const offsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function fromDateTimeLocal(local: string): string | null {
  if (!local) {
    return null;
  }
  return new Date(local).toISOString();
}

@Component({
  selector: 'app-audit-log-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './audit-log-form-dialog.component.html',
  styleUrl: './audit-log-form-dialog.component.css',
})
export class AuditLogFormDialogComponent {
  private readonly auditLogService = inject(AuditLogService);
  private readonly dialogRef = inject(MatDialogRef<AuditLogFormDialogComponent, boolean>);
  protected readonly data = inject<AuditLog | null>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data !== null;
  protected readonly actions = AUDIT_ACTIONS;
  protected readonly saving = signal(false);
  protected readonly errorKey = signal<string | null>(null);

  protected readonly form = new FormGroup({
    actorUsername: new FormControl(this.data?.actorUsername ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    action: new FormControl<AuditAction>(this.data?.action ?? 'CREATE', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    entityType: new FormControl(this.data?.entityType ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    entityReference: new FormControl(this.data?.entityReference ?? ''),
    description: new FormControl(this.data?.description ?? ''),
    ipAddress: new FormControl(this.data?.ipAddress ?? ''),
    occurredAt: new FormControl(toDateTimeLocal(this.data?.occurredAt ?? null), {
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
    const request = { ...value, occurredAt: fromDateTimeLocal(value.occurredAt)! };
    try {
      if (this.data) {
        await this.auditLogService.update(this.data.id, request);
      } else {
        await this.auditLogService.create(request);
      }
      this.dialogRef.close(true);
    } catch {
      this.errorKey.set('auditLogs.saveError');
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
