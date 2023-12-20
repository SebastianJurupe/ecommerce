import { Component, Injector } from '@angular/core';
import { AppConfigurationService, ViewComponent } from '@geor360/core';
import { SecurityCodeComponent } from '@shared/modals/security-code/security-code.component';
import { PaymentMethodsMobileComponent } from '../../payment-methods';
import { PayDeclinedBaseComponent } from '../../modals/pay-declined/base/pay-declined-base.component';

@Component({
  templateUrl: 'new-card-payment-base.component.html',
  styleUrls: ['new-card-payment-base.component.scss'],
  host: { 'app.new-card-payment-base': 'true' }
})
export class NewCardPaymentBaseComponent extends ViewComponent {

  private _configuration: AppConfigurationService;

  device: string;
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
    this._configuration = _injector.get(AppConfigurationService);
    this.device = this._configuration.screen();
  }


  checkFieldsCompletion() {
    this.allFieldsCompleted = !!this.card.number && !!this.card.name && !!this.card.date && !!this.card.cvv;
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
      cssClass: ['modal-custom', 'modal-custom--in-center-90']
    });
  }

  goToAddCard() {
    if (this.allFieldsCompleted) {
      this.navigation.forward('/app/ecommerce/basket/payment-methods');
    }
  }

  payDecline() {
    this.dialog.dismiss().then(() => {
      if (this.allFieldsCompleted) {
        this.dialog.showWithData({
          component: PayDeclinedBaseComponent,
          cssClass: ['modal-custom', 'modal-custom--in-center-90']
        });
      }
    });
  }

  payMethodModal() {
    // Cierra el modal actual
    this.dialog.dismiss().then(() => {
      // Abre el nuevo modal
      this.dialog.showWithData({
        component: PaymentMethodsMobileComponent,
        componentProps: {}
      });
    });
  }

  buttonClose() {
    this.dialog.dismiss();
  }

  onBackButtonPressed() {
    this.navigation.back('/app/ecommerce/basket/store-pickup');
  }
}
