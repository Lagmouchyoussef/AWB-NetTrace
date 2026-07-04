import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

export interface ConfirmDialogData {
  titleKey: string;
  messageKey: string;
  messageParams?: Record<string, unknown>;
  confirmKey?: string;
  cancelKey?: string;
  danger?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css',
})
export class ConfirmDialogComponent {
  protected readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent, boolean>);

  // Resolved here rather than with `data.x ?? 'default' | translate` in the template: Angular's
  // pipe binds tighter than `??`, so that expression only falls back to the translated default
  // when data.x is absent — when it IS set (e.g. confirmKey: 'common.delete'), it would render
  // the raw key untranslated. Prettier also silently strips the disambiguating parens.
  protected readonly cancelKey = this.data.cancelKey ?? 'common.cancel';
  protected readonly confirmKey = this.data.confirmKey ?? 'common.confirm';

  protected confirm(): void {
    this.dialogRef.close(true);
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
