import { Component, Injector } from '@angular/core';
import { Share } from '@capacitor/share';
import { AppConfigurationService, ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'voucher-desktop.component.html',
  styleUrls: ['voucher-desktop.component.scss'],
  host: { 'app.voucher-desktop': 'true' }
})
export class VoucherDesktopComponent extends ViewComponent {

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

  onBackButtonPressed() {
    this.navigation.back('/app/ecommerce/basket/store-pickup');
  }

  buttonClose() {
    this.dialog.dismiss();
  }
}
