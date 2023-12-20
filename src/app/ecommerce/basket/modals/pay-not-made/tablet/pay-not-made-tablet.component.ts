import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { SuccessPaymentTabletComponent } from '../../../success-payment';

@Component({
  templateUrl: 'pay-not-made-tablet.component.html',
  styleUrls: ['pay-not-made-tablet.component.scss'],
  host: { 'app.pay-not-made-tablet': 'true' }
})
export class PayNotMadeTabletComponent extends ViewComponent implements OnInit {
  
  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() { }

  buttonClose() {
    this.dialog.dismiss();
  }

  viewSuccess() {
    this.dialog.dismiss().then(() => {
      this.dialog.showWithData({
        component: SuccessPaymentTabletComponent,
        cssClass: ['modal-custom', 'modal-custom--in-center-90']
      });
    });
  }

}