import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'pay-not-made-mobile.component.html',
  styleUrls: ['pay-not-made-mobile.component.scss'],
  host: { 'app.pay-not-made-mobile': 'true' }
})
export class PayNotMadeMobileComponent extends ViewComponent implements OnInit {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() { }

  buttonClose() {
    this.dialog.dismiss();
  }

  viewSuccess() {
    const route = 'basket/success-payment';

    this.dialog.dismiss();
    setTimeout(() => {
      this.navigation.forward(`/app/ecommerce/${route}`);
    }, 500);
  }
}

