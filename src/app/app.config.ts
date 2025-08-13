import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './shared/services/auth.interceptor';
import { errorInterceptor } from './shared/services/error.interceptor';
import { ConfirmationService, MessageService } from 'primeng/api';
import "../app/shared/models/extensions";
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withRouterConfig(
        { 
          onSameUrlNavigation: 'reload' // This is for same url but different query parameter
        }
      ) 
    ),
    provideHttpClient(
      withInterceptors([jwtInterceptor,errorInterceptor])
    ),
    provideAnimationsAsync(),
    providePrimeNG({
            theme: {
                preset: Aura
            }
    }),
    ConfirmationService,
    MessageService
  ]
};
