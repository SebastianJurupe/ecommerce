import { Component, Injector, OnInit } from '@angular/core';
import { AppConfigurationService, ViewComponent } from '@geor360/core';
import { SecurityCodeComponent } from '@shared/modals';
import { PaymentMethodsTabletComponent } from '../../payment-methods';
import { PayNotMadeTabletComponent } from '../../modals/pay-not-made/tablet/pay-not-made-tablet.component';
interface Card {
  id: string;
  type: string;
  description: string;
}
@Component({
  templateUrl: 'saved-card-payment-tablet.component.html',
  styleUrls: ['saved-card-payment-tablet.component.scss'],
  host: { 'app.saved-card-payment-tablet': 'true' }
})
export class SavedCardPaymentTabletComponent extends ViewComponent implements OnInit {

  private _configuration: AppConfigurationService;
  device: string;
  cvv: string = '';
  cvvCompleted: boolean = false;

  constructor(_injector: Injector) {
    super(_injector);
    this._configuration = _injector.get(AppConfigurationService);
    this.device = this._configuration.screen();
  }

  ngOnInit() {
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
        component: PayNotMadeTabletComponent,
        cssClass: ['modal-custom', 'modal-custom--in-center-90']
      });
    });
  }

  payMethodModal() {
    this.dialog.dismiss().then(() => {
      this.dialog.showWithData({
        component: PaymentMethodsTabletComponent,
        componentProps: {}
      });
    });
  }

  savePay() {
    this.navigation.forward('/app/ecommerce/basket/success-payment');
  }

  back() {
    this.navigation.back('/app/ecommerce/basket/store-pickup');
  }

  buttonClose() {
    this.dialog.dismiss();
  }

}
