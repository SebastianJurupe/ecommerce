import { Component, Injector, Input } from '@angular/core';
import { ApiException } from '@geor360/core';
import { ViewWillEnter } from '@ionic/angular';
import { ModalCountryComponent } from '@shared/components';
import { CodeConfirmationPhoneTabletComponent } from '../../code-confirmation-phone/tablet/code-confirmation-phone-tablet.component';
import { CodeConfirmationComponent } from '../../modals/code-confirmation/code-confirmation.component';
import { AnimationModalService } from '@shared/services/animation-modal.service';
import { RegisterBaseComponent } from '../base/register-base.component';
import { AuthService } from '../../services/auth.service';
import { AuthServiceProxy } from '@shared/proxies/profile/auth.proxie';
import { CodeConfirmationService } from '../../services/code-confirmation.service';
import { AccountServiceProxy } from '@shared/proxies/profile/account.proxie';

@Component({
  selector: 'app-register-tablet',
  templateUrl: 'register-tablet.component.html',
  styleUrls: ['register-tablet.component.scss'],
  host: { 'app.register-tablet': 'true' }
})

export class RegisterTabletComponent extends RegisterBaseComponent implements ViewWillEnter {

  private _authService: AuthService;
  private _authServiceProxy: AuthServiceProxy;
  private _codeConfirmationService: CodeConfirmationService;
  private accountServiceProxy: AccountServiceProxy;
  private _animationModalService: AnimationModalService;
  @Input() showHeader: boolean = true;

  constructor(_injector: Injector) {
    super(_injector);
    this._animationModalService = _injector.get(AnimationModalService);
    this.accountServiceProxy = _injector.get(AccountServiceProxy);
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
      cssClass: ['modal-custom', 'modal-custom--in-center-medium']
    }).then((response: any) => {
      if (response.data.result !== 'cancel') {
        this.country = response.data.result;
      }
    });
  }



  termsConditions() {
    this.dialog.dismiss()
      .then(() => {
        this.navigation.forwardNoAnimation('/app/ecommerce/profile/terms-conditions');
      });
  }

  privacyPolicies() {
    this.dialog.dismiss()
      .then(() => {
        this.navigation.forwardNoAnimation('/app/ecommerce/profile/privacy-policies');
      });
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
            this._codeConfirmationService.setCodeConfirmationData({
              name,
              email,
              country_id: this.country.code,
              phone,
              password,
              device
            });
            this.dialog.dismiss();
            setTimeout(() => {
              this.accountServiceProxy.sendVerificationCodePhone()
                .subscribe({
                  next: (_response) => { },
                  error: (err: ApiException) => {
                    this.message.exception(err);
                  }
                });
              this.dialog.showWithData<"cancel" | any>({
                component: CodeConfirmationPhoneTabletComponent,
                backdropDismiss: false,
                leaveAnimation: this._animationModalService.closeDesktopModal,
                cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
                componentProps: {
                  data: this.registerForm,
                  showHeader: this.showHeader
                },
              });
            }, 100);

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
    this.dialog.dismiss();
    setTimeout(() => {
      this.dialog.showWithData<"cancel" | string>({
        component: CodeConfirmationComponent,
        cssClass: ['modal-custom', 'modal-custom--in-center-90'],
        leaveAnimation: this._animationModalService.closeDesktopModal,
        backdropDismiss: false,
        componentProps: {
        }
      }).then(response => {
        const result = response.data.result;
        this.accountServiceProxy.path;
        if (result === 'sms') {

        }

      });
    }, 100);

  }
  override ionViewWillEnter(): void {
    if (this.showHeader)
      this.toolbar.show();
  }
  async close() {
    await this.dialog.dismiss();
  }
}
