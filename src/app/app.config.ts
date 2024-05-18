import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { httpInterceptorProviders } from './interceptors/http-interceptors/index';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    httpInterceptorProviders,
  ],
};
