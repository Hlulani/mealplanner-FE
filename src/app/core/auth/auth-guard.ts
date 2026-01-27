import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthService);

  if (auth.hasValidToken()) {
    return true;
  }

  console.log('Guard blocked access - No valid token found (or expired)');
  return router.parseUrl('/login');
};
