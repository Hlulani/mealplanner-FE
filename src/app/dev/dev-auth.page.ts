import { Component } from '@angular/core';
import { IonContent, IonButton, IonInput, IonItem, IonLabel } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-dev-auth',
  imports: [IonContent, IonButton, IonInput, IonItem, IonLabel, FormsModule],
  template: `
    <ion-content class="ion-padding">
      <h2>Dev Auth Test</h2>

      <ion-item>
        <ion-label position="stacked">Email</ion-label>
        <ion-input [(ngModel)]="email"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Password</ion-label>
        <ion-input [(ngModel)]="password" type="password"></ion-input>
      </ion-item>

      <ion-button expand="block" (click)="login()">Login</ion-button>

      <p>Token present: {{ tokenPresent }}</p>
    </ion-content>
  `,
})
export class DevAuthPage {
  email = '';
  password = '';
  tokenPresent = false;

  constructor(private auth: AuthService) {}

  login(): void {
    console.log('[DevAuth] login clicked');

    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        console.log('[DevAuth] LOGIN OK', res);
        this.tokenPresent = !!this.auth.getAccessToken();
      },
      error: (err) => console.error('[DevAuth] LOGIN FAIL', err),
    });
  }
}
