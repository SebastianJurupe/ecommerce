import { Component, Injector, OnInit } from '@angular/core';
import { AppConfigurationService, ViewComponent } from '@geor360/core';
import { ModalCountryComponent } from 'src/app/shared/components';
import { VoucherTabletComponent } from '../../voucher';
import { PaymentMethodsTabletComponent } from '../../payment-methods';

@Component({
  templateUrl: 'deposit-payment-tablet.component.html',
  styleUrls: ['deposit-payment-tablet.component.scss'],
  host: { 'app.deposit-payment-tablet': 'true' }
})
export class DepositPaymentTabletComponent extends ViewComponent implements OnInit {

  private _configuration: AppConfigurationService;
  device: string;

  country = {
    id: "PE",
    description: "Perú",
    default: true,
    code: "+51",
    mask: "999 999 999",
    flag: "https://geor-aplicaciones-demo.geor.io/images/pe.svg"
  };



  constructor(_injector: Injector) {
    super(_injector);
    this._configuration = _injector.get(AppConfigurationService);
    this.device = this._configuration.screen();
  }

  ngOnInit() {
  }


  openCountriesModal() {
    this.dialog.showWithData({
      component: ModalCountryComponent,
      componentProps: {
        title: 'País',
        countryCode: this.country.code,
        countryId: this.country.id,
        showCountryCode: true
      },
      cssClass: ['modal-custom', 'modal-custom--full']
    }).then((response: any) => {
      if (response.data.result !== 'cancel') {
        this.country = response.data.result;
      }
    });
  }

  payMethodModal() {
    // Cierra el modal actual
    this.dialog.dismiss().then(() => {
      // Abre el nuevo modal
      this.dialog.showWithData({
        component: PaymentMethodsTabletComponent,
        componentProps: {}
      });
    });
  }

  goToVoucherPay() {
    this.navigation.forward('/app/ecommerce/basket/voucher');
  }

  voucherPayModal() {
    this.dialog.dismiss().then(() => {
      this.dialog.showWithData({
        component: VoucherTabletComponent,
        componentProps: {}
      });
    });
  }

  onBackButtonPressed() {
    this.navigation.back('/app/ecommerce/basket/store-pickup');
  }

  buttonClose() {
    this.dialog.dismiss();
  }
}