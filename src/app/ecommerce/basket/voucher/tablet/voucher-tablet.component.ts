import { Component, Injector } from '@angular/core';
import { Share } from '@capacitor/share';
import { AppConfigurationService, ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'voucher-tablet.component.html',
  styleUrls: ['voucher-tablet.component.scss'],
  host: { 'app.voucher-tablet': 'true' }
})
export class VoucherTabletComponent extends ViewComponent {

  private _configuration: AppConfigurationService;

  device: string;

  constructor(_injector: Injector) {
    super(_injector);
    this._configuration = _injector.get(AppConfigurationService);
    this.device = this._configuration.screen();
  }


  async share() {
    await Share.share({
      title: 'See cool stuff',
      text: 'Really awesome thing you need to see right meow',
      url: 'https://geor.app/',
      dialogTitle: '',
    });
  }

  back() {
    this.navigation.back('/app/ecommerce/basket/store-pickup');
  }

  buttonClose() {
    this.dialog.dismiss();
  }
}
