import { Component, Injector, OnInit } from '@angular/core';
import { AppConfigurationService, ViewComponent } from '@geor360/core';
import { SuccessPaymentDesktopComponent } from '../../../success-payment';

@Component({
  templateUrl: 'pay-not-made-desktop.component.html',
  styleUrls: ['pay-not-made-desktop.component.scss'],
  host: { 'app.pay-not-made-desktop': 'true' }
})
export class PayNotMadeDesktopComponent extends ViewComponent implements OnInit {

  private _configuration: AppConfigurationService;
  device: string;

  constructor(_injector: Injector) {
    super(_injector);
    this._configuration = _injector.get(AppConfigurationService);
    this.device = this._configuration.screen();
  }

  ngOnInit() { }

  buttonClose() {
    this.dialog.dismiss();
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
          component: SuccessPaymentDesktopComponent,
        });

      });
    }
  }


}
