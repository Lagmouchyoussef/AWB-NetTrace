import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { AiInsightService } from '../../../../core/services/ai-insight.service';
import { AiInsight } from './ai-insight.model';

@Component({
  selector: 'app-ai-insight-detail-dialog',
  standalone: true,
  imports: [DatePipe, MatDialogModule, TranslatePipe],
  templateUrl: './ai-insight-detail-dialog.component.html',
  styleUrl: './ai-insight-detail-dialog.component.css',
})
export class AiInsightDetailDialogComponent {
  private readonly aiInsightService = inject(AiInsightService);
  private readonly dialog = inject(MatDialog);
  private readonly translateService = inject(TranslateService);
  private readonly dialogRef = inject(MatDialogRef<AiInsightDetailDialogComponent, boolean>);

  protected readonly data = signal<AiInsight>(inject<AiInsight>(MAT_DIALOG_DATA));
  protected readonly busy = signal(false);
  protected readonly errorKey = signal<string | null>(null);

  protected canApply(): boolean {
    const insight = this.data();
    return (
      (insight.status === 'NEW' || insight.status === 'ACKNOWLEDGED') &&
      insight.actionDetails !== null &&
      insight.actionDetails.startsWith('PENDING_REMEDIATION')
    );
  }

  protected canAcknowledge(): boolean {
    return this.data().status === 'NEW';
  }

  protected canDismiss(): boolean {
    return this.data().status === 'NEW' || this.data().status === 'ACKNOWLEDGED';
  }

  protected async onAcknowledge(): Promise<void> {
    this.busy.set(true);
    this.errorKey.set(null);
    try {
      const updated = await this.aiInsightService.acknowledge(this.data().id);
      this.data.set(updated);
    } catch {
      this.errorKey.set('aiInsights.actionError');
    } finally {
      this.busy.set(false);
    }
  }

  protected async onDismiss(): Promise<void> {
    const confirmData: ConfirmDialogData = {
      titleKey: 'aiInsights.dismissTitle',
      messageKey: 'aiInsights.dismissMessage',
      messageParams: { title: this.data().title },
      confirmKey: 'aiInsights.dismiss',
      danger: true,
    };
    const ref = this.dialog.open(ConfirmDialogComponent, { width: '420px', data: confirmData });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (!confirmed) {
      return;
    }
    this.busy.set(true);
    this.errorKey.set(null);
    try {
      const updated = await this.aiInsightService.dismiss(this.data().id);
      this.data.set(updated);
      this.dialogRef.close(true);
    } catch {
      this.errorKey.set('aiInsights.actionError');
    } finally {
      this.busy.set(false);
    }
  }

  protected async onApply(): Promise<void> {
    const confirmData: ConfirmDialogData = {
      titleKey: 'aiInsights.applyTitle',
      messageKey: 'aiInsights.applyMessage',
      messageParams: { title: this.data().title },
      confirmKey: 'aiInsights.apply',
      danger: true,
    };
    const ref = this.dialog.open(ConfirmDialogComponent, { width: '420px', data: confirmData });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (!confirmed) {
      return;
    }
    this.busy.set(true);
    this.errorKey.set(null);
    try {
      const updated = await this.aiInsightService.apply(this.data().id);
      this.data.set(updated);
      this.dialogRef.close(true);
    } catch {
      this.errorKey.set('aiInsights.actionError');
    } finally {
      this.busy.set(false);
    }
  }

  protected severityLabel(): string {
    return this.translateService.instant(`aiInsights.severity.${this.data().severity}`);
  }

  protected statusLabel(): string {
    return this.translateService.instant(`aiInsights.status.${this.data().status}`);
  }

  protected close(): void {
    this.dialogRef.close(false);
  }
}
