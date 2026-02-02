import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GenerateMealPlanResponse } from './meal-plans.service';

@Injectable({ providedIn: 'root' })
export class PlanStoreService {
  private readonly planSubject = new BehaviorSubject<GenerateMealPlanResponse | null>(null);
  readonly plan$ = this.planSubject.asObservable();

  setPlan(plan: GenerateMealPlanResponse | null) {
    this.planSubject.next(plan);
  }

  getPlanSnapshot(): GenerateMealPlanResponse | null {
    return this.planSubject.getValue();
  }
}
