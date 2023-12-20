import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { SecurityCodeComponent } from '@shared/modals';
import { PayNotMadeMobileComponent } from '../../modals/pay-not-made/mobile/pay-not-made-mobile.component';
interface Card {
  id: string;
  type: string;
  description: string;
}
@Component({
  templateUrl: 'saved-card-payment-mobile.component.html',
  styleUrls: ['saved-card-payment-mobile.component.scss'],
  host: { 'app.saved-card-payment-mobile': 'true' }
})
export class SavedCardPaymentMobileComponent extends ViewComponent {

  cvv: string = '';
  cvvCompleted: boolean = false;

  constructor(_injector: Injector) {
    super(_injector);
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
    this.dialog.showWithData<'cancel' | undefined>({
      component: PayNotMadeMobileComponent,
      cssClass: ['modal-custom', 'modal-custom--in-center-90'],
    });
  }

  goToSavePay() {
    this.navigation.forward('/app/ecommerce/basket/success-payment');
  }

  onBackButtonPressed() {
    this.navigation.back('/app/ecommerce/basket/store-pickup');
  }

}
