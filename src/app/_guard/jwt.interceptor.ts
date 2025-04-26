import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from '../_services/token.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  private tokenService = inject(TokenService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.tokenService.getAccessTokenFromCookie();

    if (accessToken) {
      // Clone request và gắn Authorization header
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      return next.handle(authReq);
    }

    // Nếu không có token thì gửi request như cũ
    return next.handle(req);
  }
}
