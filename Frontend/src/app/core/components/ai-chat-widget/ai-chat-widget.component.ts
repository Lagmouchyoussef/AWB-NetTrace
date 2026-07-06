import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AiChatMessage } from '../../models/ai-chat.model';
import { AiChatService } from '../../services/ai-chat.service';
import { AiSettingsService } from '../../services/ai-settings.service';

@Component({
  selector: 'app-ai-chat-widget',
  standalone: true,
  imports: [FormsModule, MatIconModule, TranslatePipe],
  templateUrl: './ai-chat-widget.component.html',
  styleUrl: './ai-chat-widget.component.css',
})
export class AiChatWidgetComponent implements OnInit {
  private readonly aiChatService = inject(AiChatService);
  private readonly aiSettingsService = inject(AiSettingsService);
  private readonly translateService = inject(TranslateService);

  protected readonly open = signal(false);
  protected readonly messages = signal<AiChatMessage[]>([]);
  protected readonly draft = signal('');
  protected readonly loading = signal(false);
  protected readonly assistantAvailable = signal(false);
  protected readonly toolCallSummaries = signal<string[]>([]);

  async ngOnInit(): Promise<void> {
    try {
      const settings = await this.aiSettingsService.get();
      this.assistantAvailable.set(settings.assistantEnabled && settings.apiKeyConfigured);
    } catch {
      this.assistantAvailable.set(false);
    }
  }

  protected toggleOpen(): void {
    this.open.update((value) => !value);
  }

  protected onDraftChange(value: string): void {
    this.draft.set(value);
  }

  protected async onSend(): Promise<void> {
    const text = this.draft().trim();
    if (!text || this.loading()) {
      return;
    }
    const userMessage: AiChatMessage = { role: 'user', content: text };
    this.messages.update((list) => [...list, userMessage]);
    this.draft.set('');
    this.loading.set(true);
    this.toolCallSummaries.set([]);
    try {
      const response = await this.aiChatService.sendMessage(this.messages());
      this.messages.update((list) => [...list, { role: 'assistant', content: response.reply }]);
      this.toolCallSummaries.set(response.toolCallSummaries ?? []);
    } catch {
      this.messages.update((list) => [
        ...list,
        { role: 'assistant', content: this.translateService.instant('aiChat.error') },
      ]);
    } finally {
      this.loading.set(false);
    }
  }
}
