import { Component, HostListener, Injector, ViewChild } from '@angular/core';
import { ApiException, AppConfigurationService, AppTabService, ViewComponent } from '@geor360/core';
import { IonInput, Platform, PopoverController, ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { AuthServiceProxy } from '@shared/proxies/profile/auth.proxie';
import { ChooseLanguagePopoverComponent, ModalCountryComponent } from 'src/app/shared/components';
import { AuthService } from '../../services/auth.service';
import { PersonalInformationService } from '../../services/personal-information.service';
import { BasketService } from '@shared/services/basket.service';

@Component({
  templateUrl: 'login-mobile.component.html',
  styleUrls: ['login-mobile.component.scss'],
  host: { 'app.login-mobile': 'true' }
})
export class LoginMobileComponent extends ViewComponent implements ViewWillEnter, ViewWillLeave {

  private _authService: AuthService;
  private _authServiceProxy: AuthServiceProxy;
  private _configuration: AppConfigurationService;
  private _personalInformationService: PersonalInformationService;
  private _platform: Platform;
  private _popoverController: PopoverController;
  private _toolbar: AppTabService;
  private _basquetService: BasketService;

  @ViewChild('emailInput', { static: true }) emailInput!: IonInput;

  device: string;

  username: string = '';
  inputType: 'password' | 'text' = 'password';
  isLoginButtonDisabled: boolean = true;
  password: string = '';
  placeholders: any = [];
  platform: string = '';
  selectedLanguage: 'en_US' | 'es_ES';

  iconSocial = [
    {
      classIcon: 'icon icon--instagram-white icon--20',
      method: () => window.open('https://www.instagram.com/renacperu/?igshid=M2RkZGJiMzhjOQ%3D%3D')
    },
    {
      classIcon: 'icon icon--facebook-white icon--20',
      method: () => window.open('https://www.facebook.com/renacperu?mibextid=ZbWKwL')
    },
    {
      classIcon: 'icon icon--tiktok icon--32',
      method: () => window.open('https://www.tiktok.com/@renacperu?_t=8hm4sPSO02g&_r=1')
    },
  ];

  country = {
    id: "PE",
    description: "Perú",
    default: true,
    code: "+51",
    mask: "999 999 999",
    flag: "https://geor-aplicaciones-demo.geor.io/images/pe.svg"
  };

  isLoading: boolean = false;
  showFooter: boolean = true;

  constructor(_injector: Injector) {
    super(_injector);
    this._authService = _injector.get(AuthService);
    this._authServiceProxy = _injector.get(AuthServiceProxy);
    this._configuration = _injector.get(AppConfigurationService);
    this._personalInformationService = _injector.get(PersonalInformationService);
    this._platform = _injector.get(Platform);
    this._popoverController = _injector.get(PopoverController);
    this._toolbar = _injector.get(AppTabService);

    this.platform = this._platform.is('ios') ? 'ios' : 'android';
    this.device = this._configuration.screen();
    this.selectedLanguage = this.localization.currentLanguage;
    this._basquetService = _injector.get(BasketService);

    this.setPlaceholders();
  }

  ionViewWillEnter() {
    this._toolbar.show();
  }

  register() {
    this.navigation.forward("/app/ecommerce/profile/register");
  }

  toggleInput(newType: 'password' | 'text') {
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

  updateLoginButtonState() {
    this.isLoginButtonDisabled = !(this.isUsernameValid(this.username) && this.isPasswordValid(this.password));
  }

  async login() {
    const device = await this._authService.getDeviceName();
    this.isLoading = true;
    this._authServiceProxy.authEcommerce(
      this.username,
      this.country.id,
      this.password,
      device
    ).subscribe({
      next: (response) => {
        this._authService.saveSession(response, async (res) => {
          if (res) {
            this._basquetService.getBasket();
            const loaded = await this._personalInformationService.setPersonalInformation();
            if (loaded) {
              this.isLoading = false;
              this.navigation.forward("/app/ecommerce/profile/home");
            }
          }
        });
      },
      error: (err: ApiException) => {
        this.isLoading = false;
        this.message.exception(err);
      }
    });
  }

  filterByCountryModal() {
    this.dialog.showWithData({
      component: ModalCountryComponent,
      cssClass: ['modal-custom', 'modal-custom--full'],
      componentProps: {
        title: 'País',
        showCode: false,
        countryId: this.country.id,
        countryCode: this.country.code,
        tax: false,
      },
    }).then((response: any) => {
      if (response.data.result !== 'cancel') {
        this.country = response.data.result;
      }
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

  resetPassword() {
    this.navigation.forward("/app/ecommerce/profile/confirm-email");
  }

  ionViewWillLeave() {
    this.username = '';
    this.password = '';
  }

  @HostListener('focusin', ['$event'])
  onElementFocus(event: FocusEvent) {
    const target = event.target as HTMLInputElement;
    if (target.type.includes('text') || target.type.includes('password')) {
      setTimeout(() => this.showFooter = false, 100);
    }
  }

  @HostListener('focusout', ['$event.target'])
  onAnyElementBlur(_target: HTMLElement) {
    if (!document.querySelector(':focus')) {
      setTimeout(() => {
        this.showFooter = true;
      }, 100);
    }
  }
}
