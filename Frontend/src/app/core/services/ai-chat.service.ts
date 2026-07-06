import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AiChatMessage, AiChatResponse } from '../models/ai-chat.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/ai/chat`;

@Injectable({ providedIn: 'root' })
export class AiChatService {
  private readonly http = inject(HttpClient);

  sendMessage(messages: AiChatMessage[]): Promise<AiChatResponse> {
    return firstValueFrom(this.http.post<AiChatResponse>(`${BASE_URL}/messages`, { messages }));
  }
}
