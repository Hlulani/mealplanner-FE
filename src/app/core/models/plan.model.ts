import { MealResponse } from './meal.model';

export type PlanDuration = 7 | 14 | 30;
export type PlanSlot = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

export interface PlanSlotResponse {
  slot: PlanSlot;
  meal: MealResponse;
}

export interface PlanDayResponse {
  day: string;
  slots: PlanSlotResponse[];
}

export interface PlanResponse {
  planId: string;
  startDate: string;
  days: number;
  dayPlans: PlanDayResponse[];
}
