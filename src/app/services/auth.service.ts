// import { inject, Service, signal } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { firstValueFrom } from 'rxjs';

// import { environment } from '../../environments/environment';

// // ==========================================
// // USER MODEL
// // ==========================================

// export interface TmsUser {
//   userId: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   role: string;
// }

// // ==========================================
// // REGISTER REQUEST
// // ==========================================

// export interface RegisterRequest {
//   email: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   role: string;
// }

// // ==========================================
// // LOGIN REQUEST
// // ==========================================

// export interface LoginRequest {
//   email: string;
//   password: string;
// }

// // ==========================================
// // LOGIN RESPONSE
// // ==========================================

// export interface LoginResponse {
//   accessToken: string;
//   refreshToken: string;
// }

// // ==========================================
// // REGISTER RESPONSE
// // ==========================================

// export interface RegisterResponse {
//   message: string;
// }

// // ==========================================
// // AUTH SERVICE
// // ==========================================

// @Service()
// export class AuthService {
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

  // The JWT access token is stored only in memory.
  //
  // We do NOT store it in:
  //
  // localStorage
  // sessionStorage
  //
  // This reduces the risk of token theft through
  // browser storage.

  private accessToken = signal<string | null>(null);

  // ==========================================
  // CURRENT LOGGED-IN USER
  // ==========================================

  currentUser = signal<TmsUser | null>(null);

  // ==========================================
  // REGISTER
  // ==========================================

  async register(request: RegisterRequest): Promise<string> {
    // Step 1:
    // Send registration information to the API.

    const response = await firstValueFrom(
      this.http.post<RegisterResponse>(`${this.base}/register`, request),
    );

    // Step 2:
    // Return the registration message.

    return response.message;
  }

  // ==========================================
  // LOGIN
  // ==========================================

  async login(credentials: LoginRequest): Promise<void> {
    // Step 1:
    // Send email and password to the API.
    //
    // The API validates:
    //
    // 1. User exists.
    // 2. Account is not locked.
    // 3. Password is correct.
    // 4. Failed attempts are counted.
    // 5. Failed counter is reset after success.
    //
    // After successful authentication the API
    // returns:
    //
    // accessToken
    // refreshToken

    const response = await firstValueFrom(
      this.http.post<LoginResponse>(`${this.base}/login`, credentials),
    );

    // ==========================================
    // STEP 2: STORE ACCESS TOKEN IN MEMORY
    // ==========================================

    this.accessToken.set(response.accessToken);

    // ==========================================
    // STEP 3: DECODE JWT PAYLOAD
    // ==========================================

    // JWT structure:
    //
    // HEADER.PAYLOAD.SIGNATURE
    //
    // We decode the payload to obtain user
    // information for Angular UI.
    //
    // IMPORTANT:
    // This does NOT verify the JWT.
    //
    // The ASP.NET Core API verifies the signature
    // when the token is sent back to the server.

    const payload = JSON.parse(atob(response.accessToken.split('.')[1]));

    // ==========================================
    // STEP 4: READ USER INFORMATION
    // ==========================================

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

    // ==========================================
    // STEP 5: STORE USER PROFILE
    // ==========================================

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

  // The JWT interceptor uses this method.
  //
  // Example:
  //
  // Authorization: Bearer eyJhbGciOi...

  getAccessToken(): string | null {
    return this.accessToken();
  }

  logout(): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
  }

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
