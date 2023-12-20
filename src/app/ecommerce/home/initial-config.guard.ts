import { Injectable, Injector } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AppNavigationService } from '@geor360/core';

@Injectable({
  providedIn: 'root'
})
export class InitialConfigGuard implements CanActivate {

  private _appNavigationService: AppNavigationService;

  constructor(_injector: Injector) {
    this._appNavigationService = _injector.get(AppNavigationService);
  }

  canActivate() {
    if (localStorage.getItem('hasInitialConfig') === 'true') {
      this._appNavigationService.forward('/app/ecommerce/home/home');
      return false;
    } else {
      localStorage.setItem('hasInitialConfig', 'true');
      return true;
    }
  }
}
