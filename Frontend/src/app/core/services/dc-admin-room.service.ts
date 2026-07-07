import { Injectable } from '@angular/core';
import { Room, RoomListParams, RoomPage, RoomRequest } from '../../roles/super-admin/pages/rooms/room.model';
import { createScopedCrudService } from './scoped-crud.factory';

@Injectable({ providedIn: 'root' })
export class DcAdminRoomService {
  private readonly crud = createScopedCrudService<Room, RoomRequest, RoomListParams>(
    '/api/roles/dc-admin/rooms',
  );

  list(params: RoomListParams): Promise<RoomPage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<Room> {
    return this.crud.getById(id);
  }

  create(request: RoomRequest): Promise<Room> {
    return this.crud.create(request);
  }

  update(id: number, request: RoomRequest): Promise<Room> {
    return this.crud.update(id, request);
  }

  delete(id: number): Promise<void> {
    return this.crud.delete(id);
  }
}
