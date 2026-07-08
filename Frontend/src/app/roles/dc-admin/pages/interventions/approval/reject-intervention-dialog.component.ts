import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';

export interface RejectInterventionDialogData {
  title: string;
}

// A dedicated small dialog rather than reusing ConfirmDialogComponent: rejection requires a
// mandatory free-text reason, which ConfirmDialogComponent has no field for.
@Component({
  selector: 'app-reject-intervention-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    TranslatePipe,
  ],
  templateUrl: './reject-intervention-dialog.component.html',
  styleUrl: './reject-intervention-dialog.component.css',
})
export class RejectInterventionDialogComponent {
  protected readonly data = inject<RejectInterventionDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<RejectInterventionDialogComponent, string>);

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
