import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role, ROLE_SLUGS } from '../types/role';

export function roleGuard(allowedRole: Role): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      return router.createUrlTree(['/login']);
    }

    const currentRole = authService.currentRole();
    if (currentRole !== allowedRole) {
      // Already authenticated, just the wrong role: send them back to their own space
      // rather than to /login (which would be confusing since they're not logged out).
      const ownSlug = currentRole ? ROLE_SLUGS[currentRole] : 'login';
      return router.createUrlTree([`/${ownSlug}`]);
    }

    return true;
  };
}
