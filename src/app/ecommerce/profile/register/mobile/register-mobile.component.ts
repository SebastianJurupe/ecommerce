import { Component, Injector } from '@angular/core';
import { ApiException } from '@geor360/core';
import { ViewWillEnter } from '@ionic/angular';
import { AccountServiceProxy } from '@shared/proxies/profile/account.proxie';
import { AuthServiceProxy } from '@shared/proxies/profile/auth.proxie';
import { ModalCountryComponent } from 'src/app/shared/components';
import { CodeConfirmationComponent } from '../../modals/code-confirmation/code-confirmation.component';
import { AuthService } from '../../services/auth.service';
import { CodeConfirmationService } from '../../services/code-confirmation.service';
import { RegisterBaseComponent } from '../base/register-base.component';

@Component({
  templateUrl: 'register-mobile.component.html',
  styleUrls: ['register-mobile.component.scss'],
  host: { 'app.register-mobile': 'true' }
})
export class RegisterMobileComponent extends RegisterBaseComponent implements ViewWillEnter {

  private _accountServiceProxy: AccountServiceProxy;
  private _authService: AuthService;
  private _authServiceProxy: AuthServiceProxy;
  private _codeConfirmationService: CodeConfirmationService;

  constructor(_injector: Injector) {
    super(_injector);
    this._accountServiceProxy = _injector.get(AccountServiceProxy);
    this._authService = _injector.get(AuthService);
    this._authServiceProxy = _injector.get(AuthServiceProxy);
    this._codeConfirmationService = _injector.get(CodeConfirmationService);
  }

  openCountriesModal() {
    this.dialog.showWithData({
      component: ModalCountryComponent,
      componentProps: {
        title: 'País',
        countryCode: this.country.code,
        countryId: this.country.id,
        showCountryCode: true
      },
      cssClass: ['modal-custom', 'modal-custom--full']
    }).then((response: any) => {
      if (response.data.result !== 'cancel') {
        this.country = response.data.result;
      }
    });
  }

  termsConditions() {
    this.navigation.forward('/app/ecommerce/profile/terms-conditions', { path: 'register' });
  }

  privacyPolicies() {
    this.navigation.forward('/app/ecommerce/profile/privacy-policies', { path: 'register' });
  }

  next() {
    const { name, email, phone, password, device } = this.registerForm;
    const formattedPhone = phone.replace(/\s/g, '');

    this.setDeviceName();

    this.isLoading = true;
    this.registrationButtonDisabled = true;

    this._authServiceProxy.registerEcommerce(
      name,
      email,
      this.country.id,
      formattedPhone,
      password,
      device
    ).subscribe({
      next: (response) => {
        this._authService.saveSession(response, (confirmation) => {
          if (confirmation) {
            this.isLoading = true;

            // this.showVerificationOptionsModal();

            this._codeConfirmationService.setCodeConfirmationData({
              name,
              email,
              country_id: this.country.code,
              phone,
              password,
              device
            });
            this._accountServiceProxy.sendVerificationCodePhone()
              .subscribe({
                next: (_response) => { },
                error: (err: ApiException) => {
                  this.message.exception(err);
                }
              });
            this.navigation.forward(`/app/ecommerce/profile/code-confirmation-phone/${this.country.code} ${this.registerForm.phone}/${this.registerForm.email}`);
          }
        });
      },
      error: (err: ApiException) => {
        this.isLoading = false;
        this.registrationButtonDisabled = false;
        this.message.exception(err);
      }
    });
  }

  async setDeviceName() {
    const deviceName = await this._authService.getDeviceName();
    this.registerForm.device = deviceName;
  }

  showVerificationOptionsModal() {
    this.dialog.showWithData<"cancel" | string>({
      component: CodeConfirmationComponent,
      backdropDismiss: false,
      cssClass: ['modal-custom', 'modal-custom--in-center-90'],
    }).then(response => {
      const result = response.data.result;
      this._accountServiceProxy.path;
      if (result === 'sms') {

      }

    });
  }


  close() {
    this.navigation.back('/app/ecommerce/profile/login');
  }
}
