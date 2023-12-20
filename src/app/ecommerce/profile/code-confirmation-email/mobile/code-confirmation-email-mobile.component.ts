import { Component, Injector, OnInit } from '@angular/core';
import { Keyboard } from '@geor360/capacitor-keyboard';
import { Platform, ViewDidLeave } from '@ionic/angular';
import { PersonalInformationService } from '../../services/personal-information.service';
import { CodeConfirmationEmailBaseComponent } from '../base/code-confirmation-email-base.component';

@Component({
  templateUrl: 'code-confirmation-email-mobile.component.html',
  styleUrls: ['code-confirmation-email-mobile.component.scss'],
  host: { 'app.code-confirmation-email-mobile': 'true' }
})
export class CodeConfirmationEmailMobileComponent extends CodeConfirmationEmailBaseComponent implements OnInit, ViewDidLeave {

  private _personalInformationService: PersonalInformationService;
  private _platform: Platform;

  constructor(_injector: Injector) {
    super(_injector);
    this._platform = _injector.get(Platform);
    this._personalInformationService = _injector.get(PersonalInformationService);
  }

  onInput(ev: any) {
    const value = ev.target.value;
    const numericValue = value.replace(/[^0-9]+/g, '');
    const truncatedValue = numericValue.slice(0, 6);
    if (truncatedValue.length >= 6) {
      this.isMaxLengthReached = true;
      this.verifyCode(truncatedValue);
    } else {
      this.isMaxLengthReached = false;
    }
    this.ionInput.value = this.inputModel = truncatedValue;
  }

  verifyCode(code: string) {
    this.onValidateCode(code).then(async () => {
      await this._personalInformationService.setPersonalInformation();
      if (this._platform.is('mobile')) {
        Keyboard.hide();
      }
      setTimeout(() => {
        this.navigation.forward('/app/ecommerce/profile/home');
      }, 200);
    });
  }

  back() {
    this.navigation.back('/app/ecommerce/profile/register');
  }

}
