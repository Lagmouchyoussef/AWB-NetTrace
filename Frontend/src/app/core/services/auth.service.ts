import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Role } from '../types/role';

const TOKEN_KEY = 'awb_auth_token';
const USERNAME_KEY = 'awb_auth_username';
const ROLE_KEY = 'awb_auth_role';

interface LoginResponse {
  token: string;
  expiresAt: string;
}

interface MeResponse {
  username: string;
  role: Role;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  // Rehydrated from sessionStorage so a page refresh doesn't lose the session.
  private readonly currentUsername = signal<string | null>(sessionStorage.getItem(USERNAME_KEY));
  private readonly currentRoleSignal = signal<Role | null>(
    sessionStorage.getItem(ROLE_KEY) as Role | null,
  );

  async login(username: string, password: string, expectedRole?: Role): Promise<Role> {
    const loginResponse = await firstValueFrom(
      this.http.post<LoginResponse>(`${environment.apiBaseUrl}/api/auth/login`, {
        username,
        password,
        expectedRole,
      }),
    );
    sessionStorage.setItem(TOKEN_KEY, loginResponse.token);

    const me = await firstValueFrom(
      this.http.get<MeResponse>(`${environment.apiBaseUrl}/api/auth/me`),
    );
    sessionStorage.setItem(USERNAME_KEY, me.username);
    sessionStorage.setItem(ROLE_KEY, me.role);
    this.currentUsername.set(me.username);
    this.currentRoleSignal.set(me.role);
    return me.role;
  }

  logout(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USERNAME_KEY);
    sessionStorage.removeItem(ROLE_KEY);
    this.currentUsername.set(null);
    this.currentRoleSignal.set(null);
  }

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  currentRole(): Role | null {
    return this.currentRoleSignal();
  }

  username(): string | null {
    return this.currentUsername();
  }
}
