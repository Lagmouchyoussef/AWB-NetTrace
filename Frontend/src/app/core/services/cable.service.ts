import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Cable,
  CableListParams,
  CablePage,
  CableRequest,
} from '../../roles/super-admin/pages/cables/cable.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/cables`;

@Injectable({ providedIn: 'root' })
export class CableService {
  private readonly http = inject(HttpClient);

  list(params: CableListParams): Promise<CablePage> {
    let httpParams = new HttpParams().set('page', params.page).set('size', params.size);
    if (params.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }
    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }
    return firstValueFrom(this.http.get<CablePage>(BASE_URL, { params: httpParams }));
  }

  getById(id: number): Promise<Cable> {
    return firstValueFrom(this.http.get<Cable>(`${BASE_URL}/${id}`));
  }

  create(request: CableRequest): Promise<Cable> {
    return firstValueFrom(this.http.post<Cable>(BASE_URL, request));
  }

  update(id: number, request: CableRequest): Promise<Cable> {
    return firstValueFrom(this.http.put<Cable>(`${BASE_URL}/${id}`, request));
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/${id}`));
  }
}
