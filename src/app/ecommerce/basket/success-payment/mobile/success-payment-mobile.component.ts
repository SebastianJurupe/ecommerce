import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  selector: 'app-success-payment-mobile',
  templateUrl: 'success-payment-mobile.component.html',
  styleUrls: ['success-payment-mobile.component.scss'],
  host: { 'app.success-payment-mobile': 'true' }
})
export class SuccessPaymentMobileComponent extends ViewComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }

  goHome() {
    this.dialog.dismiss();
    this.navigation.forward('/app/ecommerce/home/home');
  }

  goShopping() {
    this.dialog.dismiss();
    this.navigation.forward('/app/ecommerce/home/home');
  }

  orders() {
    const route = 'profile/orders';
    this.dialog.dismiss().then(() => {
      this.navigation.forwardNoAnimation(`/app/ecommerce/${route}`, { loadMore: true });
    })

  }

  onBackButtonPressed() {
    this.dialog.dismiss()
    this.navigation.forward('/app/ecommerce/home/home');
  }
}
