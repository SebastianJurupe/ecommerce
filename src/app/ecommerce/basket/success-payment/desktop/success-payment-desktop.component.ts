import { Component, Injector } from '@angular/core';
import { AppConfigurationService, ViewComponent } from '@geor360/core';

@Component({
  selector: 'app-success-payment',
  templateUrl: 'success-payment-desktop.component.html',
  styleUrls: ['success-payment-desktop.component.scss'],
  host: { 'app.success-payment-desktop': 'true' }
})
export class SuccessPaymentDesktopComponent extends ViewComponent {

  private _configuration: AppConfigurationService;

  constructor(_injector: Injector) {
    super(_injector);
    this._configuration = _injector.get(AppConfigurationService);
  }

  get device() {
    return this._configuration.screen();
  }

  ordersTablet() {
    const route = 'profile/orders';
    this.dialog.dismiss();
    setTimeout(() => {
      this.navigation.forwardNoAnimation(`/app/ecommerce/${route}`, { loadMore: true });
    }, 500);
  }

  goShoppingTablet() {
    const route = 'home/home';
    this.dialog.dismiss();
    setTimeout(() => {
      this.navigation.forwardNoAnimation(`/app/ecommerce/${route}`);
    }, 500);
  }

  onBackButtonPressed() {
    this.navigation.back('/app/ecommerce/basket');
  }
}
