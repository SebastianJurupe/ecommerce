import { Component, Injector, ViewChild } from '@angular/core';
import { AppConfigurationService, AppTabService, ViewComponent } from '@geor360/core';
import { IonInput, Platform, PopoverController } from '@ionic/angular';
import { ChooseLanguagePopoverComponent } from '@shared/components';
import { AuthServiceProxy } from '@shared/proxies/profile/auth.proxie';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-base',
  templateUrl: 'login-base.component.html',
  styleUrls: ['login-base.component.scss'],
  host: { 'app.login-base': 'true' }
})
export class LoginBaseComponent extends ViewComponent {

  private _authService: AuthService;
  private _authServiceProxy: AuthServiceProxy;
  private _configuration: AppConfigurationService;
  private _platform: Platform;
  private _popoverController: PopoverController;


  @ViewChild('emailInput', { static: true }) emailInput!: IonInput;

  device: string = '';
  inputType: 'password' | 'text' = 'password';
  isLoading: boolean = false;
  isLoginButtonDisabled: boolean = true;
  password: string = '';
  placeholders: any = [];
  platform: string = '';
  selectedLanguage: 'en_US' | 'es_ES';
  showFooter: boolean = true;
  toolbar: AppTabService;
  username: string = '';
  iconSocial = [
    { classIcon: 'icon icon--instagram-white icon--20' },
    { classIcon: 'icon icon--facebook-white icon--20' },
    { classIcon: 'icon icon--youtube-white icon--20' },
    { classIcon: 'icon icon--twitter-white icon--20' },
    { classIcon: 'icon icon--linkedin-white icon--20' }
  ];
  country = {
    id: "PE",
    description: "Perú",
    default: true,
    code: "+51",
    mask: "999 999 999",
    flag: "https://geor-aplicaciones-demo.geor.io/images/pe.svg"
  };


  constructor(_injector: Injector) {
    super(_injector);
    this._authService = _injector.get(AuthService);
    this._authServiceProxy = _injector.get(AuthServiceProxy);
    this._configuration = _injector.get(AppConfigurationService);
    this._platform = _injector.get(Platform);
    this._popoverController = _injector.get(PopoverController);
    this.device = this._configuration.screen();
    this.platform = this._platform.is('ios') ? 'ios' : 'android';
    this.selectedLanguage = this.localization.currentLanguage;
    this.toolbar = _injector.get(AppTabService);
  }

  async login(): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      const device = await this._authService.getDeviceName();
      this.isLoading = true;
      this._authServiceProxy.authEcommerce(
        this.username,
        this.country.id,
        this.password,
        device
      ).subscribe({
        next: (response) => {
          this._authService.saveSession(response, (res) => {
            if (res) {

              resolve(true);
            }
          });
        },
        error: (err) => {
          this.isLoading = false;
          this.message.exception(err);
          reject(false);
        }
      });
    });
  }

  async chooseLanguagePopover(event: Event) {
    const popover = await this._popoverController.create({
      component: ChooseLanguagePopoverComponent,
      event: event,
      arrow: false,
      side: 'top',
      componentProps: {
        code: this.selectedLanguage
      },
      cssClass: ['choose-language-popover-login']
    });

    await popover.present();

    const res = await popover.onDidDismiss();

    if (res.data) {
      const { code } = res.data;
      this.selectedLanguage = code;
      this.setLanguage(code);
    }
  }

  setLanguage(option: 'en_US' | 'es_ES') {
    this.selectedLanguage = option;
    this.localization.changeLanguage(option);
    this.setPlaceholders();
  }

  setPlaceholders() {
    this.placeholders = {
      labelUser: this.localization.localize('profile.login.labelUser', 'ecommerce'),
      labelPassword: this.localization.localize('profile.login.labelPassword', 'ecommerce'),
      labelRecover: this.localization.localize('profile.login.labelRecover', 'ecommerce'),
      buttonLogin: this.localization.localize('profile.login.buttonLogin', 'ecommerce'),
      labelText: this.localization.localize('profile.login.labelText', 'ecommerce'),
      buttonSignUp: this.localization.localize('profile.login.buttonSignUp', 'ecommerce'),
      spanish: this.localization.localize('profile.login.spanish', 'ecommerce'),
      english: this.localization.localize('profile.login.english', 'ecommerce'),
    };
  }

  onUpdateLoginButtonState() {
    this.isLoginButtonDisabled = !(this.isUsernameValid(this.username) && this.isPasswordValid(this.password));
  }

  onToggleInputType(newType: 'password' | 'text') {
    this.inputType = newType;
  }

  isUsernameValid(input: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const numberRegex = /[0-9]{5,}/;
    return emailRegex.test(input) || numberRegex.test(input);
  }

  isPasswordValid(password: string): boolean {
    return password.length >= 8;
  }
}
