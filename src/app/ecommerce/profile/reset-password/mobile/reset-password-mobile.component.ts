import { Component, Injector } from '@angular/core';
import { ResetPasswordBaseComponent } from '../base/reset-password-base.component';

@Component({
  templateUrl: 'reset-password-mobile.component.html',
  styleUrls: ['reset-password-mobile.component.scss'],
  host: { 'app.reset-password-mobile': 'true' }
})
export class ResetPasswordMobileComponent extends ResetPasswordBaseComponent {

  constructor(_injector: Injector) {
    super(_injector);

  }

  login() {
    this.navigation.forward('/app/ecommerce/profile/login');
  }

  submitMobile() {
    this.onSubmit().then(() => {
      this.login();
    });

  }
}

