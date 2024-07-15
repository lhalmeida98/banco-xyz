import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { SpinnerService } from './shared/services/spinner.service';
import { apiLoadingInterceptor } from './core/providers/ApiLoading.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withViewTransitions({
        skipInitialTransition: true,
        onViewTransitionCreated(transitionInfo) {
          const spinnerService = inject(SpinnerService);
          spinnerService.show();
          transitionInfo.transition.finished.then(() => {
            spinnerService.hide();
          });
        }
      })
    ),
    provideClientHydration(),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        apiLoadingInterceptor
      ]),
  ),
    SpinnerService
  ]
};

