import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChecklistItem } from '../../roles/technician/technician-execution.model';

const baseUrl = (interventionId: number): string =>
  `${environment.apiBaseUrl}/api/roles/technician/interventions/${interventionId}/checklist`;

@Injectable({ providedIn: 'root' })
export class TechnicianChecklistService {
  private readonly http = inject(HttpClient);

  list(interventionId: number): Promise<ChecklistItem[]> {
    return firstValueFrom(this.http.get<ChecklistItem[]>(baseUrl(interventionId)));
  }

  toggle(interventionId: number, itemId: number, completed: boolean): Promise<ChecklistItem> {
    return firstValueFrom(
      this.http.patch<ChecklistItem>(`${baseUrl(interventionId)}/${itemId}`, { completed }),
    );
  }
}
