import { inject, Injectable } from '@angular/core';
import { ApiService, LoginResponse } from '../services/api.service';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private readonly TOKEN_KEY = 'access_token';

  login(email: string, password: string) {
    return this.api.login(email, password).pipe(
      tap((res: LoginResponse) => {
        localStorage.setItem(this.TOKEN_KEY, res.accessToken);
      })
    );
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
