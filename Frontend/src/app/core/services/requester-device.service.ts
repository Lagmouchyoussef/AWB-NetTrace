import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DeviceListParams, DevicePage } from '../../roles/super-admin/pages/devices/device.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/requester/devices`;

// Read-only - only used for the device picker on the "My Requests" creation form.
@Injectable({ providedIn: 'root' })
export class RequesterDeviceService {
  private readonly http = inject(HttpClient);

  list(params: DeviceListParams): Promise<DevicePage> {
    return firstValueFrom(this.http.get<DevicePage>(BASE_URL, { params: params as never }));
  }
}
