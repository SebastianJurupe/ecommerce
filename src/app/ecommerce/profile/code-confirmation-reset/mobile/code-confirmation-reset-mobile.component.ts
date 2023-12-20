import { Component, Injector } from '@angular/core';
import { ViewDidLeave } from '@ionic/angular';

import { CodeConfirmationResetBaseComponent } from '../base/code-confirmation-reset-base.component';

@Component({
  selector: 'app-code-confirmation-reset-mobile',
  templateUrl: 'code-confirmation-reset-mobile.component.html',
  styleUrls: ['code-confirmation-reset-mobile.component.scss'],
  host: { 'app.code-confirmation-reset-mobile': 'true' }
})
export class CodeConfirmationResetMobileComponent extends CodeConfirmationResetBaseComponent implements ViewDidLeave {

  constructor(_injector: Injector) {
    super(_injector);
  }

  onInput(ev: any) {
    const value = ev.target.value;
    const numericValue = value.replace(/[^0-9]+/g, '');
    const truncatedValue = numericValue.slice(0, 6);

    if (truncatedValue.length >= 6) {
      this.isMaxLengthReached = true;
      this.onValidateResetPasswordCodePhone(truncatedValue);

    } else {
      this.isMaxLengthReached = false;
    }
    this.ionInput.value = this.inputModel = truncatedValue;
  }

  onValidateResetPasswordCodePhone(code: string) {
    this.accountServiceProxy.resetPasswordValidateCode(this.email, code)
      .subscribe({
        next: () => {
          this.navigation.forward(`/app/ecommerce/profile/reset-password/${this.email}/${code}`);
        },
        error: (err) => {
          this.message.exception(err);
        }
      });
  }

}
