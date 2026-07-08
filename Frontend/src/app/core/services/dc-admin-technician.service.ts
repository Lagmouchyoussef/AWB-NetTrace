import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppUserPage } from '../../roles/super-admin/pages/users/user.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/dc-admin/technicians`;

// Read-only technician lookup for the intervention form's assignee picker - DC Admin has no user
// management screen of its own, this exists purely to populate that dropdown.
@Injectable({ providedIn: 'root' })
export class DcAdminTechnicianService {
  private readonly http = inject(HttpClient);

  list(): Promise<AppUserPage> {
    const params = new HttpParams().set('page', 0).set('size', 1000);
    return firstValueFrom(this.http.get<AppUserPage>(BASE_URL, { params }));
  }
}
