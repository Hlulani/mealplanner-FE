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
  IonAccordionGroup,
  IonAccordion,
  IonModal,
  IonListHeader,
  IonAvatar,
  IonButtons,
  IonDatetime,

} from '@ionic/angular/standalone';

import { MealPlansService } from '../core/services/meal-plans.service';
import { AuthService } from '../core/auth/auth.service';
import { Duration, GenerateMealPlanRequest } from '../core/services/meal-plans.service';
import { Router } from '@angular/router';
import { PlanStoreService } from '../core/services/plan-store.service';


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

type SwapOption = {
  id: string;
  name: string;
  imageUrl?: string | null;
  meta?: string;
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
    IonAccordionGroup,
    IonAccordion,
    IonModal,
    IonListHeader,
    IonAvatar,
    IonButtons,
    IonDatetime,

  ],
})
export class Tab2Page {
  private http = inject(HttpClient);


  private mealPlansService = inject(MealPlansService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private planStore = inject(PlanStoreService);
  private todayLocalYYYYMMDD(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

  private parseLocalDate(dateStr: string | null | undefined): Date | null {
    if (!dateStr) return null;
    const parts = dateStr.split('-').map(Number);
    if (parts.length !== 3) return null;
    const [y, m, d] = parts;
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  }

  private formatDate(dateStr: string, options: Intl.DateTimeFormatOptions): string {
    const d = this.parseLocalDate(dateStr);
    if (!d || Number.isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('en-US', options).format(d);
  }

  private addDays(date: Date, days: number): Date {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
  }

  fullPlanOpen = signal<boolean>(false);
  swapModalOpen = signal<boolean>(false);
  swapMeal = signal<MealPlanMeal | null>(null);
  swapOptions = signal<SwapOption[]>([]);
  startDatePickerOpen = signal<boolean>(false);
  startDateISO = signal<string | null>(null);

  openSwap(meal: MealPlanMeal) {
    this.swapMeal.set(meal);
    this.swapOptions.set(this.getSwapOptions(meal));
    this.swapModalOpen.set(true);
  }

  closeSwap() {
    this.swapModalOpen.set(false);
  }

  openStartDatePicker() {
    this.startDatePickerOpen.set(true);
  }

  closeStartDatePicker() {
    this.startDatePickerOpen.set(false);
  }

  onStartDateChange(value: string | string[] | null | undefined) {
    if (!value) return;
    const raw = Array.isArray(value) ? value[0] : value;
    if (!raw) return;
    const dateOnly = raw.split('T')[0];
    if (dateOnly) this.startDateISO.set(dateOnly);
  }

  applySwap(option: SwapOption) {
    const current = this.swapMeal();
    if (!current) return;

    const plan = this.plan();
    if (!plan) return;

    const updated: MealPlanResponse = {
      ...plan,
      daysPlan: plan.daysPlan.map((day) => ({
        ...day,
        meals: day.meals.map((meal) => {
          if (meal.mealId !== current.mealId) return meal;
          return {
            ...meal,
            mealId: option.id,
            name: option.name,
            imageUrl: option.imageUrl ?? meal.imageUrl ?? null,
          };
        }),
      })),
    };

    this.plan.set(updated);
    this.closeSwap();
  }

  private getSwapOptions(meal: MealPlanMeal): SwapOption[] {
    const base: Record<MealPlanMeal['mealType'], SwapOption[]> = {
      BREAKFAST: [
        { id: 'alt-b1', name: 'Herbed Sweet Potato Hash', meta: 'Similar macros · 25 min' },
        { id: 'alt-b2', name: 'Green Apple Chia Bowl', meta: 'Light + fiber · 15 min' },
        { id: 'alt-b3', name: 'Turmeric Oats', meta: 'Anti-inflammatory · 10 min' },
      ],
      LUNCH: [
        { id: 'alt-l1', name: 'Ginger Lentil Bowl', meta: 'Anti-inflammatory · 30 min' },
        { id: 'alt-l2', name: 'Roasted Veggie Salad', meta: 'High fiber · 20 min' },
        { id: 'alt-l3', name: 'Avocado Quinoa Plate', meta: 'Balanced · 25 min' },
      ],
      DINNER: [
        { id: 'alt-d1', name: 'Citrus Herb Chicken', meta: 'Protein-forward · 35 min' },
        { id: 'alt-d2', name: 'Miso Salmon + Greens', meta: 'Omega-3 · 30 min' },
        { id: 'alt-d3', name: 'Zucchini Noodle Bowl', meta: 'Low bloat · 25 min' },
      ],
      SNACK: [
        { id: 'alt-s1', name: 'Berry Yogurt Cup', meta: 'Quick · 5 min' },
        { id: 'alt-s2', name: 'Apple + Nut Butter', meta: 'Fiber · 5 min' },
        { id: 'alt-s3', name: 'Seed Mix', meta: 'Hormone support · 2 min' },
      ],
    };

    return base[meal.mealType] ?? base.LUNCH;
  }

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

  planStartDate(): string {
    const manualStart = this.startDateISO();
    if (manualStart) return manualStart;
    const p = this.plan();
    if (p?.daysPlan?.length) return p.daysPlan[0].date;
    return this.todayLocalYYYYMMDD();
  }

  planEndDate(): string {
    const p = this.plan();
    if (!this.startDateISO() && p?.daysPlan?.length) return p.daysPlan[p.daysPlan.length - 1].date;
    const start = this.parseLocalDate(this.planStartDate());
    if (!start) return this.planStartDate();
    return this.formatDateISO(this.addDays(start, this.duration() - 1));
  }

  private formatDateISO(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  planRangeLabel(): string {
    const start = this.planStartDate();
    const end = this.planEndDate();
    const startLabel = this.formatDate(start, { month: 'short', day: 'numeric' });
    const endLabel = this.formatDate(end, { month: 'short', day: 'numeric' });
    return `${startLabel} - ${endLabel}`;
  }

  planStartDayLabel(): string {
    const start = this.planStartDate();
    const today = this.todayLocalYYYYMMDD();
    const tomorrow = this.formatDateISO(this.addDays(this.parseLocalDate(today) ?? new Date(), 1));
    if (start === today) return 'Today';
    if (start === tomorrow) return 'Tomorrow';
    return this.formatDate(start, { weekday: 'long' });
  }

  planStartDateLabel(): string {
    return this.formatDate(this.planStartDate(), { month: 'short', day: 'numeric' });
  }

  planEndDayLabel(): string {
    return this.formatDate(this.planEndDate(), { weekday: 'long' });
  }

  planEndDateLabel(): string {
    return this.formatDate(this.planEndDate(), { month: 'short', day: 'numeric' });
  }

  formatDayTitle(dateStr: string): string {
    return this.formatDate(dateStr, { weekday: 'long', month: 'short', day: 'numeric' });
  }

  durationLabel(): string {
    const d = this.duration();
    if (d === 7) return '7-day plan';
    if (d === 14) return '14-day plan';
    return '30-day plan';
  }

  focusTagLabel(): string {
    if (this.ironSupport()) return 'Iron support';
    if (this.fibroidFocus()) return 'Fibroid support';
    return 'Balanced support';
  }

  mealTypeLabel(type: MealPlanMeal['mealType']): string {
    switch (type) {
      case 'BREAKFAST':
        return 'Breakfast';
      case 'LUNCH':
        return 'Lunch';
      case 'DINNER':
        return 'Dinner';
      case 'SNACK':
        return 'Snack';
      default:
        return type;
    }
  }

  mealTypeClass(type: MealPlanMeal['mealType']): string {
    switch (type) {
      case 'BREAKFAST':
        return 'chip chip-breakfast';
      case 'LUNCH':
        return 'chip chip-lunch';
      case 'DINNER':
        return 'chip chip-dinner';
      case 'SNACK':
        return 'chip chip-snack';
      default:
        return 'chip';
    }
  }
  allDays(): MealPlanDay[] {
    return this.plan()?.daysPlan ?? [];
  }

  generatePlan() {
    const token = this.authService.getAccessToken();

    if (!token) {
     console.error('[MY PLAN] No access token found');
    this.router.navigateByUrl('/auth');
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
        this.planStore.setPlan(res as MealPlanResponse);

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
  const plan = this.plan();
  if (!plan || !plan.daysPlan?.length) return false;

  const today = new Date().toISOString().slice(0, 10);
  const firstDay = plan.daysPlan[0].date;

  return firstDay !== today;
}


}
