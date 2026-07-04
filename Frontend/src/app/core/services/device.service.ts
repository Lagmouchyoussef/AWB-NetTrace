import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Device,
  DeviceListParams,
  DevicePage,
  DeviceRequest,
} from '../../roles/super-admin/pages/devices/device.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/super-admin/devices`;

@Injectable({ providedIn: 'root' })
export class DeviceService {
  private readonly http = inject(HttpClient);

  list(params: DeviceListParams): Promise<DevicePage> {
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
    if (params.rackId) {
      httpParams = httpParams.set('rackId', params.rackId);
    }
    return firstValueFrom(this.http.get<DevicePage>(BASE_URL, { params: httpParams }));
  }

  getById(id: number): Promise<Device> {
    return firstValueFrom(this.http.get<Device>(`${BASE_URL}/${id}`));
  }

  create(request: DeviceRequest): Promise<Device> {
    return firstValueFrom(this.http.post<Device>(BASE_URL, request));
  }

  update(id: number, request: DeviceRequest): Promise<Device> {
    return firstValueFrom(this.http.put<Device>(`${BASE_URL}/${id}`, request));
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/${id}`));
  }
}
