import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TechnicianNote } from '../../roles/technician/technician-execution.model';

const baseUrl = (interventionId: number): string =>
  `${environment.apiBaseUrl}/api/roles/technician/interventions/${interventionId}/notes`;

@Injectable({ providedIn: 'root' })
export class TechnicianNoteService {
  private readonly http = inject(HttpClient);

  list(interventionId: number): Promise<TechnicianNote[]> {
    return firstValueFrom(this.http.get<TechnicianNote[]>(baseUrl(interventionId)));
  }

  create(interventionId: number, body: string): Promise<TechnicianNote> {
    return firstValueFrom(this.http.post<TechnicianNote>(baseUrl(interventionId), { body }));
  }

  update(interventionId: number, noteId: number, body: string): Promise<TechnicianNote> {
    return firstValueFrom(
      this.http.put<TechnicianNote>(`${baseUrl(interventionId)}/${noteId}`, { body }),
    );
  }

  delete(interventionId: number, noteId: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${baseUrl(interventionId)}/${noteId}`));
  }
}
