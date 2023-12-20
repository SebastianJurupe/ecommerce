import { Injectable, Injector } from '@angular/core';
import { Device } from '@capacitor/device';
import { ApiException, AppCoreConsts, AppLocalizationService, AppMessageService, AppPreferenceService, AppSessionService } from '@geor360/core';
import { SessionServiceProxy } from '@shared/proxies/profile/session.proxie';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private preferences: AppPreferenceService;
  private localization: AppLocalizationService;
  private message: AppMessageService;
  private sessionServiceProxy: SessionServiceProxy;
  private session: AppSessionService;

  constructor(_injector: Injector) {
    this.preferences = _injector.get(AppPreferenceService);
    this.localization = _injector.get(AppLocalizationService);
    this.message = _injector.get(AppMessageService);
    this.sessionServiceProxy = _injector.get(SessionServiceProxy);
    this.session = _injector.get(AppSessionService);
  }

  async saveSession(authResponse: any, completed: (success: boolean) => void) {
    try {
      await this.preferences.set(AppCoreConsts.authorization.authTokenName, authResponse.accessToken);
      await this.preferences.set(AppCoreConsts.authorization.refreshAuthTokenName, authResponse.refreshToken);
      await this.preferences.set(AppCoreConsts.authorization.encrptedAuthTokenName, authResponse.encryptedAccessToken);
      await this.loadSession((confirmation) => completed(confirmation));
    } catch (error) {
      completed(false);
      this.savingPreferencesException();
    }
  }

  private savingPreferencesException() {
    this.message.error(this.localization.localize('preference.save.error', 'auth'));
  }

  async getDeviceName() {
    const info = await Device.getInfo();
    let name: string = '';

    if (info.hasOwnProperty('name')) {
      name = info.name!;
    } else {
      if (info.hasOwnProperty('model')) {
        name = info.model;
      }
    }

    return name;
  }

  async loadSession(completed: (confirmation: boolean) => void): Promise<void> {
    this.sessionServiceProxy
      .get()
      .subscribe({
        next: async (response) => {
          this.session.save(response.user, response.application, response.defaultCountry);
          completed(true);
        },
        error: (error: ApiException) => {
          this.message.exception(error);
          completed(false);
        }
      });
  }
}
