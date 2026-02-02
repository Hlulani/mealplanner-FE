import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';
import { AuthShellPage } from './auth/auth-shell.page';


export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthShellPage },

  // {
  //   path: 'login',
  //   loadComponent: () => import('./auth/login/login.page').then(m => m.LoginPage),
  // },
  // {
  //   path: 'register',
  //   loadComponent: () => import('./auth/register/register.page').then(m => m.RegisterPage),
  // },

  // Put meal-details BEFORE ** and (optionally) guard it
  {
    path: 'meal-details/:id',
    loadComponent: () => import('./pages/meal-details/meal-details.page').then(m => m.MealDetailsPage),
    canActivate: [authGuard],
  },

  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    canActivate: [authGuard],
    children: [
      { path: 'tab1', loadComponent: () => import('./tab1/tab1.page').then(m => m.Tab1Page) },
      { path: 'tab2', loadComponent: () => import('./tab2/tab2.page').then(m => m.Tab2Page) },
      { path: 'tab3', loadComponent: () => import('./tab3/tab3.page').then(m => m.Tab3Page) },
      { path: 'tab4', loadComponent: () => import('./tab4').then(m => m.Tab4Page) },
      { path: '', redirectTo: 'tab1', pathMatch: 'full' },
    ],
  },

  {
    path: 'auth-shell',
    loadComponent: () => import('./auth/auth-shell.page').then( m => m.AuthShellPage)
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./auth/components/onboarding/onboarding.page').then( m => m.OnboardingPage),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'auth' },
];
