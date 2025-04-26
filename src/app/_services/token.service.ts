import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AUTH_CONFIG } from '../_configs/constants';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private cookieService: CookieService) {}

  getAccessTokenFromCookie(): string | null {
    try {
      const token = this.cookieService.get(AUTH_CONFIG.ACCESS_TOKEN_KEY);
      return token || null;
    } catch {
      return null;
    }
  }

  getRefreshTokenFromCookie(): string | null {
    try {
      const token = this.cookieService.get(AUTH_CONFIG.REFRESH_TOKEN_KEY);
      return token || null;
    } catch {
      return null;
    }
  }

  getProviderFromCookie(): string | null {
    try {
      const provider = this.cookieService.get(AUTH_CONFIG.BACKEND_KEY);
      return provider || null;
    } catch {
      return null;
    }
  }

  saveAccessTokenAndRefreshTokenToCookie(
    accessToken: string,
    refreshToken: string,
    provider: string
  ): boolean {
    try {
      const expiresDays = 365;
      this.cookieService.set(AUTH_CONFIG.ACCESS_TOKEN_KEY, accessToken, expiresDays);
      this.cookieService.set(AUTH_CONFIG.REFRESH_TOKEN_KEY, refreshToken, expiresDays);
      this.cookieService.set(AUTH_CONFIG.BACKEND_KEY, provider, expiresDays);
      return true;
    } catch {
      return false;
    }
  }

  removeAccessTokenAndRefreshTokenFromCookie(): boolean {
    try {
      this.cookieService.delete(AUTH_CONFIG.ACCESS_TOKEN_KEY);
      this.cookieService.delete(AUTH_CONFIG.REFRESH_TOKEN_KEY);
      this.cookieService.delete(AUTH_CONFIG.BACKEND_KEY);
      return true;
    } catch {
      return false;
    }
  }
}
