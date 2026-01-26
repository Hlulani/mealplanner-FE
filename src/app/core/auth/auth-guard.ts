import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');

  // Stricter check: ensure token exists and isn't just an empty string
  if (token && token.length > 10) {
    return true;
  } else {
    console.log('Guard blocked access - No valid token found');
    return router.parseUrl('/login');
  }
};
