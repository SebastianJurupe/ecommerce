import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AppNavigationService } from '@geor360/core';
import { AuthTokenService } from '@shared/services/auth-token.service';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable({
  providedIn: 'root'
})
export class AuthDesktopGuard implements CanActivate {

  private _authTokenService: AuthTokenService;
  private _appNavigationService: AppNavigationService;

  constructor(_injector: Injector) {
    this._authTokenService = _injector.get(AuthTokenService);
    this._appNavigationService = _injector.get(AppNavigationService);
  }

  async canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Promise<boolean> {

    try {
      const isAuth = await firstValueFrom(this._authTokenService.isAuthenticated());

      if (!isAuth) {
        this._appNavigationService.forwardNoAnimation('/app/ecommerce/home/home');
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

}
