import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { SecurityCodeComponent } from '@shared/modals/security-code/security-code.component';
import { PayDeclinedMobileComponent } from '../../modals/pay-declined/mobile/pay-declined-mobile.component';
@Component({
  templateUrl: 'new-card-payment-mobile.component.html',
  styleUrls: ['new-card-payment-mobile.component.scss'],
  host: { 'app.new-card-payment-mobile': 'true' },
})
export class NewCardPaymentMobileComponent
  extends ViewComponent {
  cardNumberMask = [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];
  card = {
    number: '',
    name: '',
    date: '',
    cvv: ''
  };
  allFieldsCompleted: boolean = false;

  constructor(_injector: Injector) {
    super(_injector);
  }

  checkFieldsCompletion() {
    this.allFieldsCompleted =
      !!this.card.number &&
      !!this.card.name &&
      !!this.card.date &&
      !!this.card.cvv;
  }

  onCardNumberInput(event: any) {
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/\D/g, '');
    let maskedVal = '';
    for (let i = 0; i < inputValue.length; i++) {
      if (i > 0 && i % 4 === 0) {
        maskedVal += ' ';
      }
      maskedVal += inputValue.charAt(i);
    }
    this.card.number = maskedVal;
    this.checkFieldsCompletion();
  }

  onDateInput(event: any) {
    let value = event.target.value;
    value = value.replace(/[^0-9/]/g, '');
    if (value.length > 2 && value[2] !== '/') {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    event.target.value = value;
    this.card.date = value;
    this.checkFieldsCompletion();
  }

  openSecurityCodeModal() {
    this.dialog.showWithData({
      component: SecurityCodeComponent,
      cssClass: ['modal-custom', 'modal-custom--in-center-90'],
    });
  }

  goToAddCard() {
    if (this.allFieldsCompleted) {
      this.navigation.forward('/app/ecommerce/basket/payment-methods');
    }
  }

  payDecline() {
    this.dialog.showWithData<'cancel' | undefined>({
      component: PayDeclinedMobileComponent,
      cssClass: ['modal-custom', 'modal-custom--in-center-90'],
    });
  }

  onBackButtonPressed() {
    this.navigation.back('/app/ecommerce/basket/store-pickup');
  }
}
