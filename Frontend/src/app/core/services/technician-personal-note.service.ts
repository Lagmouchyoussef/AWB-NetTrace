import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  PersonalNote,
  PersonalNoteRequest,
} from '../../roles/technician/pages/notes/personal-note.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/technician/personal-notes`;

@Injectable({ providedIn: 'root' })
export class TechnicianPersonalNoteService {
  private readonly http = inject(HttpClient);

  list(): Promise<PersonalNote[]> {
    return firstValueFrom(this.http.get<PersonalNote[]>(BASE_URL));
  }

  create(request: PersonalNoteRequest): Promise<PersonalNote> {
    return firstValueFrom(this.http.post<PersonalNote>(BASE_URL, request));
  }

  update(noteId: number, request: PersonalNoteRequest): Promise<PersonalNote> {
    return firstValueFrom(this.http.put<PersonalNote>(`${BASE_URL}/${noteId}`, request));
  }

  delete(noteId: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/${noteId}`));
  }
}
