import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ChangePasswordRequest,
  MyAccount,
  MyAccountUpdateRequest,
} from '../../roles/super-admin/pages/my-account/my-account.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/technician/my-account`;

@Injectable({ providedIn: 'root' })
export class TechnicianMyAccountService {
  private readonly http = inject(HttpClient);

  get(): Promise<MyAccount> {
    return firstValueFrom(this.http.get<MyAccount>(BASE_URL));
  }

  update(request: MyAccountUpdateRequest): Promise<MyAccount> {
    return firstValueFrom(this.http.put<MyAccount>(BASE_URL, request));
  }

  changePassword(request: ChangePasswordRequest): Promise<void> {
    return firstValueFrom(this.http.put<void>(`${BASE_URL}/password`, request));
  }
}
