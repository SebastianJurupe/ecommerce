import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationEmailComponent } from '../../modals/confirmation-email/confirmation-email.component';
import { CodeConfirmationPhoneBaseComponent } from '../base/code-confirmation-phone-base.component';

@Component({
  templateUrl: 'code-confirmation-phone-mobile.component.html',
  styleUrls: ['code-confirmation-phone-mobile.component.scss'],
  host: { 'app.code-confirmation-phone-mobile': 'true' }
})
export class CodeConfirmationPhoneMobileComponent extends CodeConfirmationPhoneBaseComponent implements OnInit {

  private _activatedRoute: ActivatedRoute;

  constructor(_injector: Injector) {
    super(_injector);
    this._activatedRoute = _injector.get(ActivatedRoute);
  }

  override ngOnInit() {
    const { phone, email } = this._activatedRoute.snapshot.params;

    this.phone = phone;
    this.email = email;

    this.onStartCountdown();
    setTimeout(() => this.ionInput.setFocus(), 700);
  }

  onInput(ev: any) {
    const value = ev.target.value;
    const numericValue = value.replace(/[^0-9]+/g, '');
    const truncatedValue = numericValue.slice(0, 6);

    if (truncatedValue.length >= 6) {
      this.isMaxLengthReached = true;
      this.validatePhoneCodeCel(truncatedValue);
    } else {
      this.isMaxLengthReached = false;
    }
    this.ionInput.value = this.inputModel = truncatedValue;
  }

  async validatePhoneCodeCel(code: string) {
    try {
      await this.onValidatePhoneCode(code);

      this.openLastStepModal();

    } catch (error) {
      console.error(error);
    }
  }

  openLastStepModal() {
    this.dialog.showWithData<'cancel' | undefined>({
      component: ConfirmationEmailComponent,
      backdropDismiss: false,
      cssClass: ['modal-custom', 'modal-custom--in-center-90'],
    }).then(() => {
      this.inputModel = '';
      this.onSendEmailCode();
      this.navigation.forward(`/app/ecommerce/profile/code-confirmation-email/${this.email}`);
    });
  }

  back() {
    this.navigation.back('/app/ecommerce/profile/register');
  }
}
