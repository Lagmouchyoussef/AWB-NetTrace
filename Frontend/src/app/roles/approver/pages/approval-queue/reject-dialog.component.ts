import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';

export interface RejectDialogData {
  title: string;
}

// Small standalone dialog, duplicated from DC Admin's RejectInterventionDialogComponent rather
// than imported cross-role - rejection requires a mandatory free-text reason, which
// ConfirmDialogComponent has no field for.
@Component({
  selector: 'app-approver-reject-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, TranslatePipe],
  templateUrl: './reject-dialog.component.html',
  styleUrl: './reject-dialog.component.css',
})
export class RejectDialogComponent {
  protected readonly data = inject<RejectDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<RejectDialogComponent, string>);

  protected readonly submitted = signal(false);

  protected readonly form = new FormGroup({
    comment: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  protected confirm(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.getRawValue().comment);
  }

  protected cancel(): void {
    this.dialogRef.close(undefined);
  }
}
