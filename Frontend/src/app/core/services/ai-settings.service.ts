import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AiSettings, AiSettingsUpdateRequest } from '../models/ai-settings.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/ai/settings`;

@Injectable({ providedIn: 'root' })
export class AiSettingsService {
  private readonly http = inject(HttpClient);

  get(): Promise<AiSettings> {
    return firstValueFrom(this.http.get<AiSettings>(BASE_URL));
  }

  update(request: AiSettingsUpdateRequest): Promise<AiSettings> {
    return firstValueFrom(this.http.put<AiSettings>(BASE_URL, request));
  }
}
