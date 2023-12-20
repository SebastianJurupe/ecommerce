import { Component, Injector } from '@angular/core';
import { ConfirmEmailBaseComponent } from '../base/confirm-email-base.component';

@Component({
  templateUrl: 'confirm-email-mobile.component.html',
  styleUrls: ['confirm-email-mobile.component.scss'],
  host: { 'app.confirm-email-mobile': 'true' }
})
export class ConfirmEmailMobileComponent extends ConfirmEmailBaseComponent {


  constructor(_injector: Injector) {
    super(_injector);
  }

  ionViewWillEnter(): void {
    this.toolbar.hide();
  }

  resetPasswordMobile() {
    this.onResetPassword().then(() => {
      this.navigation.forward(`/app/ecommerce/profile/code-confirmation-reset/${this.email}`);
    });
  }

  close() {
    this.navigation.back('/app/ecommerce/profile/login');
  }
}
