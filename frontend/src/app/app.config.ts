import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { httpStatusInterceptor } from './core/interceptors/http-status.interceptor';
import { mockUserControllerInterceptor } from './core/interceptors/mock-user-controller.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([mockUserControllerInterceptor, httpStatusInterceptor]))
  ]
};
