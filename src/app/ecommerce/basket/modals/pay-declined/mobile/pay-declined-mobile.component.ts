import { Component, Injector, OnInit } from '@angular/core';
import { AppConfigurationService, ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'pay-declined-mobile.component.html',
  styleUrls: ['pay-declined-mobile.component.scss'],
  host: { 'app.pay-declined-mobile': 'true' }
})
export class PayDeclinedMobileComponent
  extends ViewComponent
  implements OnInit {
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
    }
  }
}

