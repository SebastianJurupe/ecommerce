import { Component, Injector, OnInit } from '@angular/core';
import { AppConfigurationService, ViewComponent } from '@geor360/core';
import { SuccessPaymentTabletComponent } from '../../../success-payment';

@Component({
  templateUrl: 'pay-declined-tablet.component.html',
  styleUrls: ['pay-declined-tablet.component.scss'],
  host: { 'app.pay-declined-tablet': 'true' },
})
export class PayDeclinedTabletComponent
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
    this.dialog.dismiss().then(() => {
      this.dialog.showWithData({
        component: SuccessPaymentTabletComponent,
        cssClass: ['modal-custom', 'modal-custom--in-center-90'],
      });
    });
  }
}

