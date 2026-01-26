import { Component, OnInit, inject, signal, HostListener} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent
} from '@ionic/angular/standalone';
import { MealCardComponent } from '../shared/components/meal-card/meal-card.component';
import { MealService } from '../core/services/meal.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    MealCardComponent
  ],
})
export class Tab1Page implements OnInit {
  private mealService = inject(MealService);


  meals = signal<any[]>([]);
  baseUrl = 'http://localhost:8080';

  ngOnInit() {
    this.loadMeals();
  }

  loadMeals() {
    this.mealService.getMeals().subscribe({
      next: (data) => {
        this.meals.set(data);
      },
      error: (err) => console.error('Error fetching meals:', err)
    });
  }

@HostListener('document:click', ['$event'])
onDocClick(e: MouseEvent) {
  const path = e.composedPath?.() ?? [];
  console.log(
    '[CLICK PATH]',
    path
      .slice(0, 12)
      .map((el: any) => (el?.tagName ? el.tagName.toLowerCase() : el?.constructor?.name))
  );
}
}
