import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  console.log('Interceptor checking for token...');

  if (req.url.includes('/api/v1/auth/')) {
    return next(req);
  }

  if (token) {
    console.log('Token found! Attaching to request.');
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  console.warn('No token found for this request.');
  return next(req);
};
