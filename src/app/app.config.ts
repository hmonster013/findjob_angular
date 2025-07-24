import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { JwtInterceptor } from './_guard/jwt.interceptor';
import { ErrorInterceptor } from './_interceptors/error.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { loadingInterceptor } from './_interceptors/loading.interceptor';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { generateRoutes } from './app.routes';
import { provideDatabase } from '@angular/fire/database';
import { getDatabase } from 'firebase/database';
import { AUTH_CONFIG } from './_configs/constants';
import { AuthConfig, OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(generateRoutes()),
    CookieService,
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([loadingInterceptor])
    ),
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: NgrokHeaderInterceptor, multi: true },
    provideAnimations(),
    provideToastr(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    importProvidersFrom(OAuthModule.forRoot()),
    {
      provide: AuthConfig,
      useValue: {
        issuer: 'https://accounts.google.com',
        redirectUri: window.location.origin,
        clientId: AUTH_CONFIG.GOOGLE_CLIENT_ID,
        responseType: 'code',
        scope: 'profile email',
        showDebugInformation: true,
        strictDiscoveryDocumentValidation: false,
      } as AuthConfig,
    },
    { provide: OAuthStorage, useFactory: () => localStorage },
  ]
};
