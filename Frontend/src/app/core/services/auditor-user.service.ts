import { Injectable } from '@angular/core';
import { AppUser, AppUserListParams, AppUserPage } from '../../roles/super-admin/pages/users/user.model';
import { createScopedCrudService } from './scoped-crud.factory';

// Access-review directory - read-only, no create/update/delete mapping on the backend (see
// AuditorUserController).
@Injectable({ providedIn: 'root' })
export class AuditorUserService {
  private readonly crud = createScopedCrudService<AppUser, never, AppUserListParams>(
    '/api/roles/auditor/users',
  );

  list(params: AppUserListParams): Promise<AppUserPage> {
    return this.crud.list(params);
  }

  getById(id: number): Promise<AppUser> {
    return this.crud.getById(id);
  }
}
