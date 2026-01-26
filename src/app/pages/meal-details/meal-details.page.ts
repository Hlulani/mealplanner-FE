import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  IonHeader, IonToolbar, IonButtons, IonBackButton,
  IonTitle, IonContent, IonImg, IonList,
  IonItem, IonLabel, IonItemDivider
} from '@ionic/angular/standalone';
import { MealService } from '../../core/services/meal.service';
import { environment } from '../../../environments/environment';
import { MealResponse } from '../../core/models/meal.model';
import { AuthService } from '../../core/auth/auth.service';


@Component({
  selector: 'app-meal-details',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonImg,
    IonList,
    IonItem,
    IonLabel,
    IonItemDivider
  ],
  templateUrl: './meal-details.page.html',
  styleUrls: ['./meal-details.page.scss'],
})


export class MealDetailsPage implements OnInit {
  private route = inject(ActivatedRoute);
  private mealService = inject(MealService);
  meal: MealResponse | null = null;
hostBaseUrl = environment.hostBaseUrl;
private authService = inject(AuthService);


imageUrl(path: string) {
  if (!path) return '';
  return path.startsWith('http') ? path : this.hostBaseUrl + path;
}

  apiBaseUrl = 'http://localhost:8080';

ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id');
  console.log('[MealDetailsPage] route id:', id);

  if (!id) return;

  const token = this.authService.getAccessToken();
  if (!token) {
    console.error('[MealDetailsPage] No access token found');
    return;
  }

  this.mealService.getMealById(token, id).subscribe({
    next: (data) => (this.meal = data),
    error: (err) => console.error('Error fetching meal', err),
  });
}


}
