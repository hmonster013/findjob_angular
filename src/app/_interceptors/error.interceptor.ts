import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenService } from '../_services/token.service';
import { AuthenticationService } from '../_services/authentication.service';
import { AuthStateService } from '../_services/auth-state.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  private tokenService = inject(TokenService);
  private authStateService = inject(AuthStateService);
  private router = inject(Router);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        const status = err.status;
        const errorMessage = err.error?.message || err.statusText || 'Unknown error';

        // Tự động logout nếu gặp 401 hoặc 403
        if ([401, 403].includes(status)) {
          this.tokenService.removeAccessTokenAndRefreshTokenFromCookie();
          this.authStateService.clearUser();
          this.router.navigate(['/dang-nhap']);
        }

        return throwError(() => err);
      })
    );
  }
}
