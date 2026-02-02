import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getAccessToken();

  // Don't attach token or trigger logout logic for auth endpoints
  const isAuthRequest = req.url.includes('/api/v1/auth/');
  const authReq = !isAuthRequest && token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: unknown) => {
      if (!isAuthRequest && err instanceof HttpErrorResponse && err.status === 401) {
        authService.logout();
        router.navigateByUrl('/auth');
      }
      return throwError(() => err);
    })
  );
};
