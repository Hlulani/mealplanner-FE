import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type Duration = 'DAYS_7' | 'DAYS_14' | 'DAYS_30';
export type FastingStyle =
  | 'NO_FASTING_3_MEALS'
  | 'FASTING_16_8'
  | 'FASTING_18_6';

export interface GenerateMealPlanRequest {
  duration: Duration;
  fastingStyle: FastingStyle;
  firstMealHour: number;
  fibroidFocus: boolean;
  ironSupport: boolean;
}

export interface MealPlanItem {
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  mealId: string;
  name: string;
  imageUrl: string | null;
}

export interface DayPlan {
  date: string;
  meals: MealPlanItem[];
}

export interface GenerateMealPlanResponse {
  days: number;
  daysPlan: DayPlan[];
}

@Injectable({ providedIn: 'root' })
export class MealPlansService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  generate(accessToken: string, req: GenerateMealPlanRequest): Observable<GenerateMealPlanResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    });

    return this.http.post<GenerateMealPlanResponse>(
      `${this.baseUrl}/meal-plans/generate`,
      req,
      { headers }
    );
  }
}
