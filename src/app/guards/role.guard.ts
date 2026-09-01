import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const roleGuard = (...requiredRoles: string[]): CanActivateFn => {
  return async () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    // Try to restore the session after a browser
    // refresh.
    if (!auth.isLoggedIn()) {
      await auth.restoreSession();
    }

    // Check the restored/current user.
    if (auth.hasAnyRole(requiredRoles)) {
      return true;
    }

    return router.createUrlTree(['/unauthorized']);
  };
};
