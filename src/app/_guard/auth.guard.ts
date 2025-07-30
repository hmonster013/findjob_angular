import { Injectable } from '@angular/core';
import { TokenService } from '../_services/token.service';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class authGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    const token = this.tokenService.getAccessTokenFromCookie();
    if (token) {
      return true;
    } else {
      this.router.navigate(['/dang-nhap']);
      return false;
    }
  }
}
