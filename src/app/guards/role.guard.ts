import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const roleGuard = (requiredRole: string): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    // Check whether the currently logged-in
    // user has the required role.
    if (auth.hasRole(requiredRole)) {
      return true;
    }

    // User does not have permission.
    // Redirect to unauthorized page.
    return router.createUrlTree(['/unauthorized']);
  };
};
