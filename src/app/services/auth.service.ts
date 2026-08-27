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
//   private http = inject(HttpClient);

//   private readonly base = `${environment.apiUrl}/auth`;

//   // Current logged-in user
//   currentUser = signal<TmsUser | null>(null);

//   // ==========================================
//   // REGISTER
//   // ==========================================

//   async register(request: RegisterRequest): Promise<string> {
//     // Step 1:
//     // Send registration information to the API.
//     //
//     // The API receives:
//     // email
//     // password
//     // firstName
//     // lastName
//     // role

//     const response = await firstValueFrom(
//       this.http.post<RegisterResponse>(`${this.base}/register`, request),
//     );

//     // Step 2:
//     // The API returns:
//     //
//     // {
//     //   "message": "Registration successful."
//     // }

//     return response.message;
//   }

//   // ==========================================
//   // LOGIN
//   // ==========================================

//   async login(credentials: LoginRequest): Promise<void> {
//     // Step 1:
//     // Send email and password to the API.
//     //
//     // ASP.NET Core Identity will:
//     //
//     // 1. Find the user by email.
//     // 2. Check whether the account is locked.
//     // 3. Check the password.
//     // 4. Increase the failed-attempt counter
//     //    when the password is incorrect.
//     // 5. Reset the failed-attempt counter when
//     //    the password is correct.

//     const user = await firstValueFrom(this.http.post<TmsUser>(`${this.base}/login`, credentials));

//     // Step 2:
//     // The API returns the user's profile:
//     //
//     // {
//     //   userId,
//     //   email,
//     //   firstName,
//     //   lastName
//     // }
//     //
//     // Store the profile in Angular state.

//     this.currentUser.set(user);
//   }

//   // ==========================================
//   // LOGOUT
//   // ==========================================

//   logout(): void {
//     // The current lab login endpoint does not
//     // create a JWT or authentication cookie yet.
//     //
//     // Therefore, for the current lab implementation,
//     // logout simply clears the Angular user state.

//     this.currentUser.set(null);
//   }

//   // ==========================================
//   // CHECK CURRENT USER
//   // ==========================================

//   isLoggedIn(): boolean {
//     return this.currentUser() !== null;
//   }

//   // ==========================================
//   // GET USER ROLE
//   // ==========================================

//   // NOTE:
//   // Your current Login response does NOT return
//   // the user's role.
//   //
//   // Therefore this method cannot reliably check
//   // roles yet.
//   //
//   // It will become useful after your JWT/login
//   // implementation returns the role.

//   hasRole(role: string): boolean {
//     return false;
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
  role: string;
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

// ==========================================
// LOGIN RESPONSE
// ==========================================

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

  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {
    // Remove JWT from Angular memory.

    this.accessToken.set(null);

    // Remove current user.

    this.currentUser.set(null);
  }

  // ==========================================
  // CHECK CURRENT USER
  // ==========================================

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  // ==========================================
  // CHECK ONE ROLE
  // ==========================================

  hasRole(role: string): boolean {
    const user = this.currentUser();

    if (!user) {
      return false;
    }

    return user.role === role || user.role === 'Admin';
  }

  // ==========================================
  // CHECK MULTIPLE ROLES
  // ==========================================

  // This is useful for Module 11 roleGuard.
  //
  // Example:
  //
  // authService.hasAnyRole([
  //   'Instructor',
  //   'Admin'
  // ]);

  hasAnyRole(roles: string[]): boolean {
    const user = this.currentUser();

    if (!user) {
      return false;
    }

    return roles.includes(user.role);
  }
}
