import { Component, Injector } from '@angular/core';
import { AppConfigurationService, ViewComponent } from '@geor360/core';
import { SuccessPaymentTabletComponent } from '../../../success-payment';

@Component({
  templateUrl: 'pay-declined-base.component.html',
  styleUrls: ['pay-declined-base.component.scss'],
  host: { 'app.pay-declined-base': 'true' }
})
export class PayDeclinedBaseComponent extends ViewComponent {

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
          component: SuccessPaymentTabletComponent,
          cssClass: ['modal-custom', 'modal-custom--in-center-90']
        });
      });
    }
  }

  buttonClose() {
    this.dialog.dismiss();
  }
}
