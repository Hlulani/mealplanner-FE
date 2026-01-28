import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
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
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonText,
  ],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);

  email = signal('');
  password = signal('');

  isLoading = signal(false);
  error = signal<string | null>(null);

  onIonTextInput(ev: any): string {
    const v = ev?.detail?.value;
    return v == null ? '' : String(v);
  }

  submit() {
    if (!this.email() || !this.password()) return;

    this.isLoading.set(true);
    this.error.set(null);

    const email = this.email();
    const password = this.password();

    this.api.register(email, password).pipe(
      switchMap(() => this.auth.login(email, password)) // auto-login after register
    ).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigateByUrl('/tabs'); // or whatever your “app home” route is
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg =
          err?.error?.message ||
          err?.error ||
          'Registration/login failed';
        this.error.set(String(msg));
      },
    });
  }
}
