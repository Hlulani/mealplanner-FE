import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage {
 currentStep = signal(1);
  totalSteps = 4;

  preferences = {
    goal: '',
    diet: '',
    focuses: [] as string[],
    completed: false
  };


  constructor(private router: Router, private auth: AuthService) {}

  // NEW: toggle focus (multi-select)
  toggleFocus(focus: string) {
    const idx = this.preferences.focuses.indexOf(focus);
    if (idx >= 0) {
      this.preferences.focuses.splice(idx, 1);
    } else {
      this.preferences.focuses.push(focus);
    }
  }

  // NEW: helper for checkbox state
  hasFocus(focus: string): boolean {
    return this.preferences.focuses.includes(focus);
  }

  canContinueFromFocuses(): boolean {
    return this.preferences.focuses.length > 0;
  }


  nextStep() {
    if (this.currentStep() < this.totalSteps) {
      this.currentStep.update(s => s + 1);
    } else {
      this.finish();
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  selectGoal(goal: string) {
    this.preferences.goal = goal;
    this.nextStep();
  }

  selectDiet(diet: string) {
    this.preferences.diet = diet;
    this.nextStep();
  }

  finish() {
    // Here you would call your ApiService to save preferences
    console.log('Saving Preferences:', this.preferences);
    this.auth.setOnboardingCompleted(true);
    this.router.navigateByUrl('/tabs/tab2');
  }


  // --- Step 4: Dynamic approach copy (neutral, based on selections) ---

  private focusLabel(f: string): string {
    const map: Record<string, string> = {
      anti_inflammatory: 'Anti-inflammatory',
      high_fiber: 'Higher fiber',
      iron_support: 'Iron support',
      low_bloat: 'Low bloat',
      blood_sugar: 'Blood sugar steady',
      quick_meals: 'Quick meals',
    };
    return map[f] ?? f;
  }

  getSelectedFocusChips(): string[] {
    return (this.preferences.focuses || []).map(f => this.focusLabel(f));
  }

  getApproachTitle(): string {
    // Keep it friendly + neutral, but clearly fibroid-first
    if (this.preferences.focuses?.includes('low_bloat')) return 'A gentler plan, built for comfort';
    if (this.preferences.focuses?.includes('iron_support')) return 'A plan that supports energy and strength';
    if (this.preferences.focuses?.includes('anti_inflammatory')) return 'A plan built around calm, nourishing meals';
    return 'A plan built for your preferences';
  }

  getApproachBullets(): string[] {
    const bullets: string[] = [];

    // Always anchor to your app’s purpose (without “science card” tone)
    bullets.push('Fibroid-friendly meal choices, designed for consistency.');

    if (this.preferences.goal) {
      bullets.push(`Goal: ${this.preferences.goal}.`);
    }

    if (this.preferences.diet) {
      bullets.push(`Diet style: ${this.preferences.diet}.`);
    }

    const f = new Set(this.preferences.focuses || []);

    if (f.has('anti_inflammatory')) bullets.push('More anti-inflammatory ingredients across your week.');
    if (f.has('low_bloat')) bullets.push('Gentler meals that aim to reduce bloating triggers.');
    if (f.has('high_fiber')) bullets.push('Fiber-forward options, balanced and easy to stick to.');
    if (f.has('iron_support')) bullets.push('Iron-supporting meals paired with smart combinations.');
    if (f.has('blood_sugar')) bullets.push('Balanced meals that help keep energy steady.');
    if (f.has('quick_meals')) bullets.push('Quick recipes prioritized when possible.');

    return bullets;
  }

  getScienceCards(): { tag: string; title: string; body: string; image: string; alt: string }[] {
    const map: Record<string, { tag: string; title: string; body: string; image: string; alt: string }> = {
      anti_inflammatory: {
        tag: 'Inflammation Support',
        title: 'Anti-Inflammatory Focus',
        body: 'We prioritize omega-3s, herbs, and colorful produce to support calm, steady inflammation levels.',
        image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800',
        alt: 'Colorful antioxidants'
      },
      low_bloat: {
        tag: 'Gentle Digestion',
        title: 'Low-Bloat Choices',
        body: 'Meals are designed to be easier on digestion with lighter ingredients and balanced portions.',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        alt: 'Light, fresh meal'
      },
      high_fiber: {
        tag: 'Fiber Support',
        title: 'Fiber-Forward Meals',
        body: 'We increase plant-based fiber to support regularity while keeping meals easy to enjoy.',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        alt: 'Fiber-rich vegetables'
      },
      iron_support: {
        tag: 'Energy Support',
        title: 'Iron-Smart Pairings',
        body: 'We pair iron-rich foods with absorption-friendly ingredients to support energy levels.',
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
        alt: 'Iron-rich meal'
      },
      blood_sugar: {
        tag: 'Steady Energy',
        title: 'Balanced Plates',
        body: 'Meals balance protein, fiber, and healthy fats to help keep energy steady.',
        image: 'https://images.unsplash.com/photo-1506086679525-9d0c5b2168b5?w=800',
        alt: 'Balanced meal plate'
      },
      quick_meals: {
        tag: 'Time Saver',
        title: 'Quick & Nourishing',
        body: 'We prioritize faster recipes without sacrificing nourishment or flavor.',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
        alt: 'Quick meal prep'
      },
    };

    const selected = (this.preferences.focuses || [])
      .map((f) => map[f])
      .filter(Boolean);

    const fallback = [
      {
        tag: 'Balanced Nutrition',
        title: 'Whole-Food Focus',
        body: 'Meals are built around whole ingredients for steady energy and consistency.',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        alt: 'Whole food ingredients'
      },
      {
        tag: 'Gentle Support',
        title: 'Comfort-First Choices',
        body: 'We keep meals simple, satisfying, and easy to stick to.',
        image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800',
        alt: 'Simple nourishing meal'
      }
    ];

    const cards = [...selected];
    while (cards.length < 2) {
      cards.push(fallback[cards.length]);
    }

    return cards.slice(0, 2);
  }

}
