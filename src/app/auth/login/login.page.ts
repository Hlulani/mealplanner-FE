import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class LoginPage {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private navCtrl = inject(NavController);
  private toastCtrl = inject(ToastController);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.getRawValue();
      this.authService.login(email, password).subscribe({
        next: () => {
          // Success: Navigate to the Home Tab
          this.navCtrl.navigateRoot('/tabs/tab1');
        },
        error: async (err) => {
          const toast = await this.toastCtrl.create({
            message: 'Login failed. Please check your credentials.',
            duration: 2000,
            color: 'danger'
          });
          toast.present();
        }
      });
    }
  }
}
