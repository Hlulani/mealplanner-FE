import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonRange,
  IonCheckbox,
  IonButton,
  IonText,
  IonList,
  IonSegment,
  IonSegmentButton,
  IonItemDivider,
  IonAccordionGroup,
IonAccordion,

} from '@ionic/angular/standalone';

import { MealPlansService } from '../core/services/meal-plans.service';
import { AuthService } from '../core/auth/auth.service';
import { Duration, GenerateMealPlanRequest } from '../core/services/meal-plans.service';
import { Router } from '@angular/router';


type PlanDuration = 7 | 14 | 30;

type MealPlanMeal = {
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  mealId: string;
  name: string;
  imageUrl: string | null;
};

type MealPlanDay = {
  date: string; // "YYYY-MM-DD"
  meals: MealPlanMeal[];
};

type MealPlanResponse = {
  days: number;
  daysPlan: MealPlanDay[];
};

@Component({
  selector: 'app-tab2',
  standalone: true,
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonRange,
    IonCheckbox,
    IonButton,
    IonText,
    IonList,
    IonSegment,
    IonSegmentButton,
    IonItemDivider,
    IonAccordionGroup,
    IonAccordion,

  ],
})
export class Tab2Page {
  private http = inject(HttpClient);


  private mealPlansService = inject(MealPlansService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private todayLocalYYYYMMDD(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

  fullPlanOpen = signal<boolean>(false);

toggleFullPlan() {
  this.fullPlanOpen.update(v => !v);
}

closeFullPlan() {
  this.fullPlanOpen.set(false);
}

openMeal(mealId: string) {
  if (!mealId) return;
  this.router.navigate(['/meal-details', mealId]);
}



  // Eating style
  fastingStyle = signal<'NO_FASTING_3_MEALS' | 'FASTING_16_8' | 'FASTING_18_6'>(
    'NO_FASTING_3_MEALS'
  );
  firstMealHour = signal<number>(14);

  // Focus areas
  fibroidFocus = signal<boolean>(true);
  ironSupport = signal<boolean>(true);

  // Plan duration (weekly/biweekly/monthly)
  duration = signal<PlanDuration>(30);

  // ✅ Stores the plan result (typed)
  plan = signal<MealPlanResponse | null>(null);

  isLoading = signal(false);
  error = signal<string | null>(null);

  mealPlanResponse = signal<any | null>(null);

  setDuration(value: string | number | undefined | null) {
    if (value === undefined || value === null) return;
    const n = Number(value) as PlanDuration;
    if (n === 7 || n === 14 || n === 30) this.duration.set(n);
  }

  onFirstMealHourChange(value: unknown) {
    // IonRange can return number OR {lower, upper}
    let hour: number | undefined;

    if (typeof value === 'number') {
      hour = value;
    } else if (value && typeof value === 'object' && 'lower' in (value as any)) {
      hour = Number((value as any).lower);
    }

    if (typeof hour === 'number' && !Number.isNaN(hour)) {
      this.firstMealHour.set(hour);
    }
  }


  private todayKey(): string {
    return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  }

  todayDay(): MealPlanDay | null {
    const p = this.plan();
    if (!p) return null;
    const key = this.todayKey();
    return p.daysPlan.find((d) => d.date === key) ?? null;
  }

  allDays(): MealPlanDay[] {
    return this.plan()?.daysPlan ?? [];
  }

  generatePlan() {
    const token = this.authService.getAccessToken();

    if (!token) {
     console.error('[MY PLAN] No access token found');
    this.router.navigateByUrl('/login');
    return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    const payload: GenerateMealPlanRequest = {
      duration: (this.duration() === 7
        ? 'DAYS_7'
        : this.duration() === 14
        ? 'DAYS_14'
        : 'DAYS_30') as Duration,

      fastingStyle: this.fastingStyle(),
      firstMealHour: this.firstMealHour(),
      fibroidFocus: this.fibroidFocus(),
      ironSupport: this.ironSupport(),
    };

    console.log('[MY PLAN] sending payload', payload);

    this.mealPlansService.generate(token, payload).subscribe({
      next: (res) => {
        console.log('[MY PLAN] response', res);

        this.plan.set(res as MealPlanResponse);

        this.mealPlanResponse.set(res);

        console.log(
          '[MY PLAN] todayKey',
          new Date().toISOString().slice(0, 10),
          'todayDay',
          this.todayDay()
        );

        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('[MY PLAN] error', err);
        this.error.set('Failed to generate plan');
        this.isLoading.set(false);
      },
    });
  }

openMealDetails(mealId: string) {
  if (!mealId) return;
  this.router.navigate(['/meal-details', mealId]);
}

shouldShowStartNotice() {
  const plan = this.mealPlanResponse();
  if (!plan || !plan.daysPlan?.length) return false;

  const today = new Date().toISOString().slice(0, 10);
  const firstDay = plan.daysPlan[0].date;

  return firstDay !== today;
}


}
