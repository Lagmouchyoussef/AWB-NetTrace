import { Injectable } from '@angular/core';
import { Room, RoomListParams, RoomPage } from '../../roles/super-admin/pages/rooms/room.model';
import { createScopedCrudService } from './scoped-crud.factory';

// Read-only for Network Engineer - see NetworkEngineerDatacenterService.
@Injectable({ providedIn: 'root' })
export class NetworkEngineerRoomService {
  private readonly crud = createScopedCrudService<Room, unknown, RoomListParams>(
    '/api/roles/network-engineer/rooms',
  );

  list(params: RoomListParams): Promise<RoomPage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<Room> {
    return this.crud.getById(id);
  }
}
