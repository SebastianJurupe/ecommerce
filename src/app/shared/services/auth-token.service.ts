import { Injectable, Injector } from "@angular/core";
import { AppPreferenceService } from "@geor360/core";
import { Observable, map } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthTokenService {

  private _preferences: AppPreferenceService;

  constructor(_injector: Injector) {
    this._preferences = _injector.get(AppPreferenceService);
  }

  isAuthenticated(): Observable<boolean> {
    return this._preferences.get('auth_token').pipe(map(token => !!token));
  }
}