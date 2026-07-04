import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Room,
  RoomListParams,
  RoomPage,
  RoomRequest,
} from '../../roles/super-admin/pages/rooms/room.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/rooms`;

@Injectable({ providedIn: 'root' })
export class RoomService {
  private readonly http = inject(HttpClient);

  list(params: RoomListParams): Promise<RoomPage> {
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
    if (params.datacenterId) {
      httpParams = httpParams.set('datacenterId', params.datacenterId);
    }
    return firstValueFrom(this.http.get<RoomPage>(BASE_URL, { params: httpParams }));
  }

  getById(id: number): Promise<Room> {
    return firstValueFrom(this.http.get<Room>(`${BASE_URL}/${id}`));
  }

  create(request: RoomRequest): Promise<Room> {
    return firstValueFrom(this.http.post<Room>(BASE_URL, request));
  }

  update(id: number, request: RoomRequest): Promise<Room> {
    return firstValueFrom(this.http.put<Room>(`${BASE_URL}/${id}`, request));
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/${id}`));
  }
}
