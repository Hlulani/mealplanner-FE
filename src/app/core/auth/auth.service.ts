import { inject, Injectable } from '@angular/core';
import { ApiService, LoginResponse } from '../services/api.service';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private readonly TOKEN_KEY = 'access_token';
  private readonly ONBOARDING_KEY = 'onboarding_completed';

  login(email: string, password: string) {
    return this.api.login(email, password).pipe(
      tap((res: LoginResponse) => {
        localStorage.setItem(this.TOKEN_KEY, res.accessToken);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ONBOARDING_KEY);
  }

  getAccessToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return token && token.length > 10 ? token : null;
  }

  hasValidToken(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    const exp = this.getJwtExp(token);
    if (!exp) return true; // if token has no exp, treat as valid (keeps you unblocked)

    const nowSeconds = Math.floor(Date.now() / 1000);
    return exp > nowSeconds;
  }

  hasCompletedOnboarding(): boolean {
    return localStorage.getItem(this.ONBOARDING_KEY) === 'true';
  }

  setOnboardingCompleted(completed = true): void {
    localStorage.setItem(this.ONBOARDING_KEY, completed ? 'true' : 'false');
  }


register(email: string, password: string) {
  return this.api.register(email, password);
}


  private getJwtExp(token: string): number | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;

      // base64url -> base64
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const parsed = JSON.parse(json);
      return typeof parsed.exp === 'number' ? parsed.exp : null;
    } catch {
      return null;
    }
  }
}
