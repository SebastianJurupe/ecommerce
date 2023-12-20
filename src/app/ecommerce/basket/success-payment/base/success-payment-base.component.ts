import { Component, Injector } from '@angular/core';
import { AppConfigurationService, ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'success-payment-base.component.html',
  styleUrls: ['success-payment-base.component.scss'],
  host: { 'app.success-payment': 'true' }
})
export class SuccessPaymentBaseComponent extends ViewComponent {

  private _configuration: AppConfigurationService;

  device: string;

  constructor(_injector: Injector) {
    super(_injector);
    this._configuration = _injector.get(AppConfigurationService);
    this.device = this._configuration.screen();
  }



  orders() {
    this.navigation.forward('/app/ecommerce/profile/orders');
  }

  goToShopping() {
    this.navigation.forward('/app/ecommerce/home/home');
  }

  ordersTablet() {
    const route = 'profile/orders';
    this.dialog.dismiss();
    setTimeout(() => {
      this.navigation.forward(`/app/ecommerce/${route}`);
    }, 500);
  }

  goShoppingTablet() {
    const route = 'home/home';
    this.dialog.dismiss();
    setTimeout(() => {
      this.navigation.forward(`/app/ecommerce/${route}`);
    }, 500);
  }

  onBackButtonPressed() {
    this.navigation.back('/app/ecommerce/basket');
  }
}
