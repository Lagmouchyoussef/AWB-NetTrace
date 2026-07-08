import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

export interface ConfirmDialogData {
  titleKey: string;
  messageKey: string;
  messageParams?: Record<string, unknown>;
  confirmKey?: string;
  cancelKey?: string;
  danger?: boolean;
  // When set, a required reason textarea is shown and the dialog closes with the reason string
  // instead of `true` on confirm - used by decommission-style flows (e.g. Network Engineer
  // removing a cable) that must record why, not just that. Existing callers are unaffected: they
  // only ever check the closed value for truthiness, and a non-empty string is truthy too.
  requireReason?: boolean;
  reasonLabelKey?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe, FormsModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css',
})
export class ConfirmDialogComponent {
  protected readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent, boolean | string>);

  // Resolved here rather than with `data.x ?? 'default' | translate` in the template: Angular's
  // pipe binds tighter than `??`, so that expression only falls back to the translated default
  // when data.x is absent — when it IS set (e.g. confirmKey: 'common.delete'), it would render
  // the raw key untranslated. Prettier also silently strips the disambiguating parens.
  protected readonly cancelKey = this.data.cancelKey ?? 'common.cancel';
  protected readonly confirmKey = this.data.confirmKey ?? 'common.confirm';
  protected readonly requireReason = this.data.requireReason ?? false;
  protected readonly reasonLabelKey = this.data.reasonLabelKey ?? 'common.reason';

  protected readonly reason = signal('');

  protected confirm(): void {
    if (this.requireReason) {
      const trimmed = this.reason().trim();
      if (!trimmed) {
        return;
      }
      this.dialogRef.close(trimmed);
      return;
    }
    this.dialogRef.close(true);
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
