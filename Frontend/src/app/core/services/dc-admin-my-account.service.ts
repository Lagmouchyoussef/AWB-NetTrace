import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AllowedIp,
  AllowedIpRequest,
  ChangePasswordRequest,
  MyAccount,
  MyAccountUpdateRequest,
} from '../../roles/super-admin/pages/my-account/my-account.model';

const BASE_URL = `${environment.apiBaseUrl}/api/roles/dc-admin/my-account`;

@Injectable({ providedIn: 'root' })
export class DcAdminMyAccountService {
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

  setIpRestrictionEnabled(ipRestrictionEnabled: boolean): Promise<void> {
    return firstValueFrom(
      this.http.put<void>(`${BASE_URL}/ip-restriction`, { ipRestrictionEnabled }),
    );
  }

  listAllowedIps(): Promise<AllowedIp[]> {
    return firstValueFrom(this.http.get<AllowedIp[]>(`${BASE_URL}/allowed-ips`));
  }

  addAllowedIp(request: AllowedIpRequest): Promise<AllowedIp> {
    return firstValueFrom(this.http.post<AllowedIp>(`${BASE_URL}/allowed-ips`, request));
  }

  deleteAllowedIp(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/allowed-ips/${id}`));
  }
}
