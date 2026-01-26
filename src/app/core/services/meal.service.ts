import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MealResponse } from '../models/meal.model';

@Injectable({ providedIn: 'root' })
export class MealService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiBaseUrl}/meals`;

  getMeals(): Observable<MealResponse[]> {
    return this.http.get<MealResponse[]>(this.apiUrl);
  }

  getMealById(token: string, id: string): Observable<MealResponse> {
    return this.http.get<MealResponse>(`${this.apiUrl}/${id}`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    });
  }
}
