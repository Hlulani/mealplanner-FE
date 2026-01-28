import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MealResponse } from '../models/meal.model';
import { PlanResponse } from '../models/plan.model';

export interface UserResponse {
  id: string;
  email: string;
}
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

export interface RegisterRequest {
  email: string;
  password: string;
  // add fields if your BE requires them, e.g. firstName, lastName
}

export interface RegisterResponse {
  message?: string;
  // OR whatever your BE returns. If it returns tokens, we’ll use that in Step 2.
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiBaseUrl;

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, {
      email,
      password,
    });
  }

  // register(email: string, password: string) {
  //   return this.http.post(`${this.API_URL}/auth/register`, { email, password });
  // }

// api.service.ts



register(email: string, password: string) {
  const body: RegisterRequest = { email, password };
  return this.http.post<RegisterResponse>(`${this.API_URL}/auth/register`, body);
}


  getRecommended() {
    return this.http.get<MealResponse[]>(`${this.API_URL}/meals`);
  }

  generatePlan(days: number) {
    return this.http.post<PlanResponse>(`${this.API_URL}/plans/generate`, {
      days,
    });
  }
}
