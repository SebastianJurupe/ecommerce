import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { ModalCountryComponent } from 'src/app/shared/components';

@Component({
  templateUrl: 'paymentcash-mobile.component.html',
  styleUrls: ['paymentcash-mobile.component.scss'],
  host: { 'app.paymentcash-mobile': 'true' }
})
export class PaymentcashMobileComponent extends ViewComponent {

  country = {
    id: "PE",
    description: "Perú",
    default: true,
    code: "+51",
    mask: "999 999 999",
    flag: "https://geor-aplicaciones-demo.geor.io/images/pe.svg"
  };

  maxDniLength: number = 8;

  constructor(_injector: Injector) {
    super(_injector);
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

  goToVoucherPay() {
    this.navigation.forward('/app/ecommerce/basket/voucher');
  }

  onBackButtonPressed() {
    this.navigation.back('/app/ecommerce/basket/store-pickup');
  }

}
