import { Component } from '@angular/core';
import { PaymentMethodsBaseComponent } from '../base/payment-methods-base.component';


@Component({
  templateUrl: 'payment-methods-mobile.component.html',
  styleUrls: ['payment-methods-mobile.component.scss'],
  host: { 'app.payment-methods-mobile': 'true' }
})
export class PaymentMethodsMobileComponent extends PaymentMethodsBaseComponent {

}
