import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

// Import provideHttpClient and the functional interceptor utility
import { provideHttpClient, withInterceptors } from '@angular/common/http';

// Import your functional interceptor (ensure this path is correct)
import { authInterceptor } from './app/core/auth/auth.interceptor';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    /**
     * MODERN FUNCTIONAL INTERCEPTOR SETUP
     * We replaced withInterceptorsFromDi() with withInterceptors([authInterceptor]).
     * This ensures your authInterceptor function is applied to every request.
     */
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
  ],
});
