import { Component, Injector } from '@angular/core';
import { AppConfigurationService, ViewComponent } from '@geor360/core';
import { SuccessPaymentBaseComponent } from '../../../success-payment';

@Component({
  templateUrl: 'pay-not-made-base.component.html',
  styleUrls: ['pay-not-made-base.component.scss'],
  host: { 'app.pay-not-made-base': 'true' }
})
export class PayNotMadeBaseComponent extends ViewComponent {

  private _configuration: AppConfigurationService;

  device: string;

  constructor(_injector: Injector) {
    super(_injector);
    this._configuration = _injector.get(AppConfigurationService);
    this.device = this._configuration.screen();
  }

  viewSuccess() {
    if (this.device === 'mobile') {
      const route = 'basket/success-payment';
      this.dialog.dismiss();
      setTimeout(() => {
        this.navigation.forward(`/app/ecommerce/${route}`);
      }, 500);
    } else if (this.device === 'tablet') {
      this.dialog.dismiss().then(() => {
        this.dialog.showWithData({
          component: SuccessPaymentBaseComponent,
        });

      });
    }
  }

  buttonClose() {
    this.dialog.dismiss();
  }
}
