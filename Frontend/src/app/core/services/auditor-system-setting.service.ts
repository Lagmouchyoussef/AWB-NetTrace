import { Injectable } from '@angular/core';
import {
  SystemSetting,
  SystemSettingListParams,
  SystemSettingPage,
} from '../../roles/super-admin/pages/system-settings/system-setting.model';
import { createScopedCrudService } from './scoped-crud.factory';

// Configuration review - read-only, no create/update/delete mapping on the backend (see
// AuditorSystemSettingController).
@Injectable({ providedIn: 'root' })
export class AuditorSystemSettingService {
  private readonly crud = createScopedCrudService<
    SystemSetting,
    never,
    SystemSettingListParams
  >('/api/roles/auditor/system-settings');

  list(params: SystemSettingListParams): Promise<SystemSettingPage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<SystemSetting> {
    return this.crud.getById(id);
  }
}
