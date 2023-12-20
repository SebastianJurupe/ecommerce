import { Component, Injector, OnInit } from '@angular/core';
import { AppConfigurationService, ViewComponent } from '@geor360/core';

@Component({
  selector: 'app-success-payment',
  templateUrl: 'success-payment-tablet.component.html',
  styleUrls: ['success-payment-tablet.component.scss'],
  host: { 'app.success-payment': 'true' }
})
export class SuccessPaymentTabletComponent extends ViewComponent implements OnInit {

  private _configuration: AppConfigurationService;
  device: string;

  constructor(_injector: Injector) {
    super(_injector);
    this._configuration = _injector.get(AppConfigurationService);
    this.device = this._configuration.screen();
  }

  ngOnInit() { }

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

}
