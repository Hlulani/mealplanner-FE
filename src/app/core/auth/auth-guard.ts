import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  const auth = inject(AuthService);

  if (auth.hasValidToken()) {
    const url = state?.url || '';
    if (!auth.hasCompletedOnboarding() && !url.startsWith('/onboarding')) {
      return router.parseUrl('/onboarding');
    }
    return true;
  }

  console.log('Guard blocked access - No valid token found (or expired)');
  return router.parseUrl('/auth');
};
