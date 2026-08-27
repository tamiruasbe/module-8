import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';

import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  // Get the JWT access token from memory.
  const token = auth.getAccessToken();

  // If the user is authenticated,
  // attach the JWT to the HTTP request.
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(cloned);
  }

  // No token.
  // Send the original request.
  return next(req);
};
