import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpCoreInterceptor } from './http-cors.interceptor';

/** Array of Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpCoreInterceptor, multi: true },
];
