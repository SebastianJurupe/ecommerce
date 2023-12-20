import { Component, Injector, OnInit } from '@angular/core';
import { Share } from '@capacitor/share';
import { AppConfigurationService, ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'voucher-mobile.component.html',
  styleUrls: ['voucher-mobile.component.scss'],
  host: { 'app.voucher-mobile': 'true' }
})
export class VoucherMobileComponent extends ViewComponent implements OnInit {

  private _configuration: AppConfigurationService;

  device: string;

  constructor(_injector: Injector) {
    super(_injector);
    this._configuration = _injector.get(AppConfigurationService);
    this.device = this._configuration.screen();
  }

  ngOnInit() { }

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
