import { Injectable } from '@angular/core';
import {
  EquipmentType,
  EquipmentTypeListParams,
  EquipmentTypePage,
  EquipmentTypeRequest,
} from '../../roles/super-admin/pages/equipment-types/equipment-type.model';
import { createScopedCrudService } from './scoped-crud.factory';

@Injectable({ providedIn: 'root' })
export class DcAdminEquipmentTypeService {
  private readonly crud = createScopedCrudService<
    EquipmentType,
    EquipmentTypeRequest,
    EquipmentTypeListParams
  >('/api/roles/dc-admin/equipment-types');

  list(params: EquipmentTypeListParams): Promise<EquipmentTypePage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<EquipmentType> {
    return this.crud.getById(id);
  }

  create(request: EquipmentTypeRequest): Promise<EquipmentType> {
    return this.crud.create(request);
  }

  update(id: number, request: EquipmentTypeRequest): Promise<EquipmentType> {
    return this.crud.update(id, request);
  }

  delete(id: number): Promise<void> {
    return this.crud.delete(id);
  }
}
