import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { PaymentMethodsService } from '../../services/payment-methods.service';

@Component({
  templateUrl: 'payment-methods-tablet.component.html',
  styleUrls: ['payment-methods-tablet.component.scss'],
  host: { 'app.payment-methods-tablet': 'true' }
})
export class PaymentMethodsTabletComponent extends ViewComponent implements OnInit {

  selectedPaymentMethod: string | null = null;

  constructor(_injector: Injector, private paymentMethodsService: PaymentMethodsService) {
    super(_injector);
    this.selectedPaymentMethod = localStorage.getItem('selectedPaymentMethod');
  }

  ngOnInit() { }

  click(paymentMethod: string) {
    this.paymentMethodsService.setSelectedPaymentMethod(paymentMethod);
    this.selectedPaymentMethod = paymentMethod;
    localStorage.setItem('selectedPaymentMethod', this.selectedPaymentMethod);
    this.dialog.dismiss();

  }
  buttonClose() {
    this.dialog.dismiss();
  }
}
