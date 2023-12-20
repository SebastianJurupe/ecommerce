import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodsService {
  private selectedPaymentMethodSubject = new BehaviorSubject<string | null>(null);
  selectedPaymentMethod$ = this.selectedPaymentMethodSubject.asObservable();

  setSelectedPaymentMethod(paymentMethod: string) {
    this.selectedPaymentMethodSubject.next(paymentMethod);
  }

}
