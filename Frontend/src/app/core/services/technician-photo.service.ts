import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  InterventionPhotoMeta,
  PhotoPhase,
} from '../../roles/technician/technician-execution.model';

const baseUrl = (interventionId: number): string =>
  `${environment.apiBaseUrl}/api/roles/technician/interventions/${interventionId}/photos`;

@Injectable({ providedIn: 'root' })
export class TechnicianPhotoService {
  private readonly http = inject(HttpClient);

  list(interventionId: number): Promise<InterventionPhotoMeta[]> {
    return firstValueFrom(this.http.get<InterventionPhotoMeta[]>(baseUrl(interventionId)));
  }

  upload(interventionId: number, phase: PhotoPhase, file: Blob): Promise<InterventionPhotoMeta> {
    const formData = new FormData();
    formData.append('file', file, `${phase.toLowerCase()}.jpg`);
    return firstValueFrom(
      this.http.post<InterventionPhotoMeta>(baseUrl(interventionId), formData, {
        params: { phase },
      }),
    );
  }

  delete(interventionId: number, photoId: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${baseUrl(interventionId)}/${photoId}`));
  }

  // A plain <img src> would bypass the auth interceptor (the endpoint is protected, like every
  // other API route), so the file is fetched as a blob through HttpClient and handed back as an
  // object URL the caller can bind directly and must revoke when done.
  async fetchObjectUrl(interventionId: number, photoId: number): Promise<string> {
    const blob = await firstValueFrom(
      this.http.get(`${baseUrl(interventionId)}/${photoId}/file`, { responseType: 'blob' }),
    );
    return URL.createObjectURL(blob);
  }
}
