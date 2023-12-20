import { Component, Injector } from '@angular/core';
import { AppConfigurationService, ViewComponent } from '@geor360/core';
import { SecurityCodeComponent } from '@shared/modals';
import { PaymentMethodsMobileComponent } from '../../payment-methods';
import { PayNotMadeDesktopComponent } from '../../modals/pay-not-made/desktop/pay-not-made-desktop.component';
interface Card {
  id: string;
  type: string;
  description: string;
}
@Component({
  templateUrl: 'saved-card-payment-desktop.component.html',
  styleUrls: ['saved-card-payment-desktop.component.scss'],
  host: { 'app.saved-card-payment-desktop': 'true' }
})
export class SavedCardPaymentDesktopComponent extends ViewComponent {

  private _configuration: AppConfigurationService;
  device: string;
  cvv: string = '';
  cvvCompleted: boolean = false;

  constructor(_injector: Injector) {
    super(_injector);
    this._configuration = _injector.get(AppConfigurationService);
    this.device = this._configuration.screen();
  }

  cards: Card[] = [
    {
      id: '1',
      type: 'visa',
      description: 'Visa Débito **** 4115'
    }
  ];

  checkCvvCompletion() {
    this.cvvCompleted = this.cvv.length === 3;
  }

  openSecurityCodeModal() {
    this.dialog.showWithData({
      component: SecurityCodeComponent,
      cssClass: ['modal-custom', 'modal-custom--in-center-90']
    });
  }

  payNotMade() {
    this.dialog.dismiss().then(() => {
      this.dialog.showWithData({
        component: PayNotMadeDesktopComponent,
        cssClass: ['modal-custom', 'modal-custom--in-center-90']
      });
    });
  }

  payMethodModal() {
    this.dialog.dismiss().then(() => {
      this.dialog.showWithData({
        component: PaymentMethodsMobileComponent,
        componentProps: {}
      });
    });
  }

  goTosavePay() {
    this.navigation.forward('/app/ecommerce/basket/success-payment');
  }

  onBackButtonPressed() {
    this.navigation.back('/app/ecommerce/basket/store-pickup');
  }

  buttonClose() {
    this.dialog.dismiss();
  }

}
