import { Component, Input, inject } from '@angular/core';
import { IonCard, IonCardContent, IonImg, IonText } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

export type MealCardVM = {
  id: string;
  name: string;
  imageUrl?: string | null;
  antiInflammatoryScore: number;
  ironSupport: number;
  fiberScore: number;
};

@Component({
  selector: 'app-meal-card',
  standalone: true,
  imports: [IonCard, IonCardContent, IonImg, IonText],
  templateUrl: './meal-card.component.html',
  styleUrls: ['./meal-card.component.scss'],
})
export class MealCardComponent {
  @Input({ required: true }) meal!: MealCardVM;
private router = inject(Router);


  @Input() apiBaseUrl = 'http://localhost:8080';

  readonly placeholderImage =
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=70';

  imageUrl(path?: string | null): string {
    if (!path) return this.placeholderImage;
    if (path.startsWith('http')) return path;
    return this.apiBaseUrl + path;
  }

debugClick() {
  console.log('[MealCard] clicked', this.meal?.id);
}

goToDetails() {
  console.log('[MealCard] goToDetails', this.meal.id);
  this.router.navigate(['/meal-details', this.meal.id]);
}

scoreClass(score: number): string {
  if (score >= 4) return 'score-chip score-high';
  if (score >= 2) return 'score-chip score-med';
  return 'score-chip score-low';
}
}
