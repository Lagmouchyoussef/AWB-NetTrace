import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ROLE_SLUGS } from '../types/role';
import { AuthService } from './auth.service';

// A 401 mid-session means the JWT expired or was invalidated server-side (default lifetime:
// 1 hour) — every page's own error handling would otherwise show a misleading "check your
// connection" message instead of the real cause, so this catches it once, globally, and sends
// the user back to their role's login screen.
export const sessionExpiryInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof Object &&
        'status' in error &&
        error.status === 401 &&
        !req.url.endsWith('/api/auth/login')
      ) {
        const role = authService.currentRole();
        authService.logout();
        const loginPath = role ? `/${ROLE_SLUGS[role]}-login` : '/';
        router.navigateByUrl(`${loginPath}?sessionExpired=1`);
      }
      return throwError(() => error);
    }),
  );
};
