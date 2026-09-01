import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';

export interface TmsUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private readonly base = `${environment.apiUrl}/auth`;

  // ==========================================
  // ACCESS TOKEN
  // ==========================================

  // Access token remains in memory.
  //
  // We do NOT store the access token in:
  //
  // localStorage
  // sessionStorage

  private accessToken = signal<string | null>(null);

  // ==========================================
  // REFRESH TOKEN
  // ==========================================

  // The refresh token is persisted so that
  // authentication can be restored after a
  // browser refresh.

  private refreshToken = signal<string | null>(sessionStorage.getItem('tms_refresh_token'));

  // ==========================================
  // CURRENT USER
  // ==========================================

  currentUser = signal<TmsUser | null>(null);

  // ==========================================
  // AUTHENTICATION RESTORATION
  // ==========================================

  private restoringSession = signal(false);

  // ==========================================
  // REGISTER
  // ==========================================

  async register(request: RegisterRequest): Promise<string> {
    const response = await firstValueFrom(
      this.http.post<RegisterResponse>(`${this.base}/register`, request),
    );

    return response.message;
  }

  // ==========================================
  // LOGIN
  // ==========================================

  async login(credentials: LoginRequest): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<LoginResponse>(`${this.base}/login`, credentials),
    );

    this.storeTokens(response.accessToken, response.refreshToken);

    this.setCurrentUserFromAccessToken(response.accessToken);
  }

  // ==========================================
  // REFRESH SESSION
  // ==========================================

  async restoreSession(): Promise<boolean> {
    const storedRefreshToken = this.refreshToken();

    if (!storedRefreshToken) {
      return false;
    }

    if (this.restoringSession()) {
      return this.currentUser() !== null;
    }

    this.restoringSession.set(true);

    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(`${this.base}/refresh`, {
          refreshToken: storedRefreshToken,
        }),
      );

      this.storeTokens(response.accessToken, response.refreshToken);

      this.setCurrentUserFromAccessToken(response.accessToken);

      return true;
    } catch {
      this.clearAuthentication();

      return false;
    } finally {
      this.restoringSession.set(false);
    }
  }

  // ==========================================
  // STORE TOKENS
  // ==========================================

  private storeTokens(accessToken: string, refreshToken: string): void {
    this.accessToken.set(accessToken);

    this.refreshToken.set(refreshToken);

    sessionStorage.setItem('tms_refresh_token', refreshToken);
  }

  // ==========================================
  // CREATE USER FROM JWT
  // ==========================================

  private setCurrentUserFromAccessToken(accessToken: string): void {
    const payload = JSON.parse(atob(accessToken.split('.')[1]));

    const userId =
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ??
      payload.sub ??
      '';

    const email =
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ??
      payload.email ??
      '';

    const firstName = payload.FirstName ?? payload.firstName ?? email;

    const role =
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
      payload.role ??
      'Student';

    this.currentUser.set({
      userId,
      email,
      firstName,
      lastName: payload.LastName ?? payload.lastName ?? '',
      role,
    });
  }

  // ==========================================
  // GET ACCESS TOKEN
  // ==========================================

  getAccessToken(): string | null {
    return this.accessToken();
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {
    this.clearAuthentication();
  }

  private clearAuthentication(): void {
    this.accessToken.set(null);

    this.refreshToken.set(null);

    this.currentUser.set(null);

    sessionStorage.removeItem('tms_refresh_token');
  }

  // ==========================================
  // AUTHENTICATION STATUS
  // ==========================================

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();

    if (!user) {
      return false;
    }

    return user.role === role || user.role === 'Admin';
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.currentUser();

    if (!user) {
      return false;
    }

    return roles.includes(user.role);
  }
}
