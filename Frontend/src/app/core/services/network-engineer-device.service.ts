import { Injectable } from '@angular/core';
import {
  Device,
  DeviceListParams,
  DevicePage,
  DeviceRequest,
} from '../../roles/super-admin/pages/devices/device.model';
import { createScopedCrudService } from './scoped-crud.factory';

// No delete() - this role decommissions a device via its status field (update), never a hard
// delete. See NetworkEngineerDeviceController.
@Injectable({ providedIn: 'root' })
export class NetworkEngineerDeviceService {
  private readonly crud = createScopedCrudService<Device, DeviceRequest, DeviceListParams>(
    '/api/roles/network-engineer/devices',
  );

  list(params: DeviceListParams): Promise<DevicePage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<Device> {
    return this.crud.getById(id);
  }

  create(request: DeviceRequest): Promise<Device> {
    return this.crud.create(request);
  }

  update(id: number, request: DeviceRequest): Promise<Device> {
    return this.crud.update(id, request);
  }
}
