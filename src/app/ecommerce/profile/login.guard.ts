import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AppNavigationService } from '@geor360/core';
import { AuthTokenService } from '@shared/services/auth-token.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable()
export class LoginGuard implements CanActivate {

  private _navigation: AppNavigationService;
  private _authTokenService: AuthTokenService;

  constructor(_injector: Injector) {
    this._navigation = _injector.get(AppNavigationService);
    this._authTokenService = _injector.get(AuthTokenService);
  }

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> {

    return this._authTokenService.isAuthenticated()
      .pipe(
        take(1),
        map((isAuthenticated: boolean) => {
          if (!isAuthenticated) {
            this._navigation.forward('/app/ecommerce/profile/login');
            return false;
          } else {
            return true;
          }
        })
      );

  }
}
