// import { inject, Service, signal } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { firstValueFrom } from 'rxjs';

// export interface TmsUser {
//   displayName: string;
//   role: string;
// }

// export interface LoginRequest {
//   username: string;
//   password: string;
// }

// @Service()
// export class AuthService {
//   private http = inject(HttpClient);

//   currentUser = signal<TmsUser | null>(null);

//   hasRole(role: string): boolean {
//     const user = this.currentUser();

//     return user?.role === role || user?.role === 'Admin';
//   }

//   async login(credentials: LoginRequest): Promise<void> {
//     // Step 1:
//     // Send username and password to the API.
//     //
//     // The API responds with Set-Cookie.
//     // The browser stores tms_auth as an HttpOnly cookie.
//     await firstValueFrom(this.http.post('/api/v1/auth/login', credentials));

//     // Step 2:
//     // Ask the API who is currently logged in.
//     //
//     // The browser automatically sends
//     // the HttpOnly tms_auth cookie.
//     const user = await firstValueFrom(this.http.get<TmsUser>('/api/v1/auth/me'));

//     // Step 3:
//     // Store only the user's profile in Angular state.
//     //
//     // We DO NOT store the raw authentication token.
//     this.currentUser.set(user);
//   }
// }
import { inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';

// ==========================================
// USER MODEL
// ==========================================

export interface TmsUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

// ==========================================
// REGISTER REQUEST
// ==========================================

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

// ==========================================
// LOGIN REQUEST
// ==========================================

export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

// ==========================================
// REGISTER RESPONSE
// ==========================================

export interface RegisterResponse {
  message: string;
}

// ==========================================
// AUTH SERVICE
// ==========================================

@Service()
export class AuthService {
  private http = inject(HttpClient);

  private readonly base = `${environment.apiUrl}/auth`;

  // Current logged-in user
  currentUser = signal<TmsUser | null>(null);

  // ==========================================
  // REGISTER
  // ==========================================

  async register(request: RegisterRequest): Promise<string> {
    // Step 1:
    // Send registration information to the API.
    //
    // The API receives:
    // email
    // password
    // firstName
    // lastName
    // role

    const response = await firstValueFrom(
      this.http.post<RegisterResponse>(`${this.base}/register`, request),
    );

    // Step 2:
    // The API returns:
    //
    // {
    //   "message": "Registration successful."
    // }

    return response.message;
  }

  // ==========================================
  // LOGIN
  // ==========================================

  async login(credentials: LoginRequest): Promise<void> {
    // Step 1:
    // Send email and password to the API.
    //
    // ASP.NET Core Identity will:
    //
    // 1. Find the user by email.
    // 2. Check whether the account is locked.
    // 3. Check the password.
    // 4. Increase the failed-attempt counter
    //    when the password is incorrect.
    // 5. Reset the failed-attempt counter when
    //    the password is correct.

    const user = await firstValueFrom(this.http.post<TmsUser>(`${this.base}/login`, credentials));

    // Step 2:
    // The API returns the user's profile:
    //
    // {
    //   userId,
    //   email,
    //   firstName,
    //   lastName
    // }
    //
    // Store the profile in Angular state.

    this.currentUser.set(user);
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {
    // The current lab login endpoint does not
    // create a JWT or authentication cookie yet.
    //
    // Therefore, for the current lab implementation,
    // logout simply clears the Angular user state.

    this.currentUser.set(null);
  }

  // ==========================================
  // CHECK CURRENT USER
  // ==========================================

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  // ==========================================
  // GET USER ROLE
  // ==========================================

  // NOTE:
  // Your current Login response does NOT return
  // the user's role.
  //
  // Therefore this method cannot reliably check
  // roles yet.
  //
  // It will become useful after your JWT/login
  // implementation returns the role.

  hasRole(role: string): boolean {
    return false;
  }
}
