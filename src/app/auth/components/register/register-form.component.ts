import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonItem,
  IonInput,
  IonButton,
  IonText,
  IonIcon,
  IonSpinner
} from '@ionic/angular/standalone';
import { ApiService } from '../../../core/services/api.service';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonItem,
    IonInput,
    IonButton,
    IonText,
    IonIcon,
    IonSpinner
  ],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  mode = 'register';

  isLoading = signal(false);
  error = signal<string | null>(null);

  submit() {
    if (!this.email || !this.password) return;

    this.isLoading.set(true);
    this.error.set(null);

    this.api.register(this.email, this.password).pipe(
      switchMap(() => this.auth.login(this.email, this.password))
    ).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigateByUrl('/tabs/tab1');
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err?.error?.message || 'Registration failed';
        this.error.set(String(msg));
      },
    });
  }
}
