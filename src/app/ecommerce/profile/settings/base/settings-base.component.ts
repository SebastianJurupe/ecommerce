import { Component, Injector } from '@angular/core';
import { ApiException, AppConfigurationService, AppTabService, AppThemeService, ViewComponent } from '@geor360/core';
import { AccountServiceProxy } from '@shared/proxies/profile/account.proxie';
import { UnverifiedAccountComponent } from '../../modals/unverified-account/unverified-account.component';
import { VerifyEmailPhoneComponent } from '../../modals/verify-email-phone/verify-email-phone.component';

@Component({
  templateUrl: 'settings-base.component.html',
  styleUrls: ['settings-base.component.scss'],
  host: { 'app.settings-base': 'true' }
})
export class SettingsBaseComponent extends ViewComponent {

  private _accountServiceProxy: AccountServiceProxy;
  private _appConfigurationService: AppConfigurationService;
  private _appThemeService: AppThemeService;

  selectedLanguage: string = '';
  selectedLanguageCode: string = '';
  selectedMode: string = '';
  toolbar: AppTabService;
  modeDisplayNames: { [key: string]: string; } = {
    system: this.localization.localize('profile.changeMode.automatic', 'ecommerce'),
    light: this.localization.localize('profile.changeMode.light', 'ecommerce'),
    dark: this.localization.localize('profile.changeMode.dark', 'ecommerce'),
  };

  languageDisplayNames: { [key: string]: string; } = {
    en_US: 'English',
    es_ES: 'Español',
  };

  constructor(_injector: Injector) {
    super(_injector);
    this._accountServiceProxy = _injector.get(AccountServiceProxy);
    this._appConfigurationService = _injector.get(AppConfigurationService);
    this._appThemeService = _injector.get(AppThemeService);
    this.toolbar = _injector.get(AppTabService);
  }

  get modalClasses(): string[] {
    return this._appConfigurationService.screen() === 'mobile'
      ? ['modal-custom', 'modal-custom--full']
      : ['modal-custom', 'modal-custom--in-center-medium'];
  }

  getDisplayName(languageCode: string): string {
    return this.languageDisplayNames[languageCode] || languageCode;
  }

  showUnverifiedModal() {
    if (!this.session.user.isEmailConfirmed || !this.session.user.isPhoneNumberConfirmed) {
      this.dialog.showWithData({
        component: UnverifiedAccountComponent,
        cssClass: ['modal-custom', 'modal-custom--in-center-90']
      });
    }
  }

  getSelectedLanguageAndMode() {
    const language = this.localization.currentLanguage;
    const mode = this._appThemeService.mode;

    switch (language) {
      case 'es_ES':
        this.selectedLanguage = this.localization.localize('profile.language.spanish', 'ecommerce');
        this.selectedLanguageCode = 'es_ES';
        break;
      case 'en_US':
        this.selectedLanguage = this.localization.localize('profile.language.english', 'ecommerce');
        this.selectedLanguageCode = 'en_US';

        break;

      default:
        this.selectedLanguage = this.localization.localize('profile.language.spanish', 'ecommerce');
        break;
    }

    switch (mode) {
      case 'dark':
        this.selectedMode = this.localization.localize('profile.changeMode.dark', 'ecommerce');
        break;
      case 'light':
        this.selectedMode = this.localization.localize('profile.changeMode.light', 'ecommerce');
        break;
      case 'system':
        this.selectedMode = this.localization.localize('profile.changeMode.automatic', 'ecommerce');
        break;
      default:
        this.selectedMode = this.localization.localize('profile.changeMode.automatic', 'ecommerce');
        break;
    }
  }

  validateEmail() {
    this._accountServiceProxy.sendVerificationCodeEmail()
      .subscribe({
        next: () => {
          this.openVerifyAccount('email');
        },
        error: (err: ApiException) => this.message.exception(err)
      });
  }

  validatePhone() {
    this._accountServiceProxy.sendVerificationCodePhone()
      .subscribe({
        next: () => {
          this.openVerifyAccount('phone');
        },
        error: (err: ApiException) => this.message.exception(err)
      });
  }

  openVerifyAccount(type: 'phone' | 'email') {
    this.dialog.showWithData({
      component: VerifyEmailPhoneComponent,
      componentProps: {
        type: type,
        term: type === 'phone' ? this.session.user.phoneNumber : this.session.user.emailAddress
      },
      cssClass: this.modalClasses
    });
  }

}
