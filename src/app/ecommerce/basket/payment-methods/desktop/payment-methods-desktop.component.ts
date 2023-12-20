import { Component } from '@angular/core';
import { PaymentMethodsBaseComponent } from '../base/payment-methods-base.component';

@Component({
  templateUrl: 'payment-methods-desktop.component.html',
  styleUrls: ['payment-methods-desktop.component.scss'],
  host: { 'app.payment-methods-desktop': 'true' }
})
export class PaymentMethodsDesktopComponent extends PaymentMethodsBaseComponent {

  close() {
    this.dialog.dismiss();
  }
}
