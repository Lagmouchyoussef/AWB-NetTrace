import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslatePipe } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { AiSettings } from '../../../../core/models/ai-settings.model';
import { AiSettingsService } from '../../../../core/services/ai-settings.service';

@Component({
  selector: 'app-ai-settings',
  standalone: true,
  imports: [MatSlideToggleModule, TranslatePipe],
  templateUrl: './ai-settings.component.html',
  styleUrl: './ai-settings.component.css',
})
export class AiSettingsComponent implements OnInit {
  private readonly aiSettingsService = inject(AiSettingsService);
  private readonly dialog = inject(MatDialog);

  protected readonly settings = signal<AiSettings | null>(null);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly errorKey = signal<string | null>(null);
  protected readonly savedMessage = signal(false);

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      this.settings.set(await this.aiSettingsService.get());
    } catch {
      this.errorKey.set('aiSettings.loadError');
    } finally {
      this.loading.set(false);
    }
  }

  protected async onToggleAssistant(checked: boolean): Promise<void> {
    await this.save({ assistantEnabled: checked });
  }

  protected async onTogglePredictiveAnalysis(checked: boolean): Promise<void> {
    await this.save({ predictiveAnalysisEnabled: checked });
  }

  protected async onToggleAutonomousActions(checked: boolean): Promise<void> {
    if (checked) {
      const confirmData: ConfirmDialogData = {
        titleKey: 'aiSettings.confirmAutonomousTitle',
        messageKey: 'aiSettings.confirmAutonomousMessage',
        confirmKey: 'aiSettings.confirmAutonomousEnable',
        danger: true,
      };
      const ref = this.dialog.open(ConfirmDialogComponent, { width: '460px', data: confirmData });
      const confirmed = await firstValueFrom(ref.afterClosed());
      if (!confirmed) {
        return;
      }
    }
    await this.save({ autonomousActionsEnabled: checked });
  }

  private async save(partial: Partial<AiSettings>): Promise<void> {
    this.saving.set(true);
    this.errorKey.set(null);
    this.savedMessage.set(false);
    try {
      const updated = await this.aiSettingsService.update(partial);
      this.settings.set(updated);
      this.savedMessage.set(true);
    } catch {
      this.errorKey.set('aiSettings.saveError');
      // Re-fetch to revert the toggle's visual state to the actual persisted value.
      this.settings.set(await this.aiSettingsService.get());
    } finally {
      this.saving.set(false);
    }
  }
}
