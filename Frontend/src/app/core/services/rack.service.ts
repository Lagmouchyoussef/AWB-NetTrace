import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Rack,
  RackListParams,
  RackPage,
  RackRequest,
} from '../../roles/super-admin/pages/racks/rack.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/racks`;

@Injectable({ providedIn: 'root' })
export class RackService {
  private readonly http = inject(HttpClient);

  list(params: RackListParams): Promise<RackPage> {
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
    if (params.roomId) {
      httpParams = httpParams.set('roomId', params.roomId);
    }
    return firstValueFrom(this.http.get<RackPage>(BASE_URL, { params: httpParams }));
  }

  getById(id: number): Promise<Rack> {
    return firstValueFrom(this.http.get<Rack>(`${BASE_URL}/${id}`));
  }

  create(request: RackRequest): Promise<Rack> {
    return firstValueFrom(this.http.post<Rack>(BASE_URL, request));
  }

  update(id: number, request: RackRequest): Promise<Rack> {
    return firstValueFrom(this.http.put<Rack>(`${BASE_URL}/${id}`, request));
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/${id}`));
  }
}
