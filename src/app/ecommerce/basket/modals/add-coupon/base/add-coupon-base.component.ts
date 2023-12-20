import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'add-coupon-base.component.html',
  styleUrls: ['add-coupon-base.component.scss'],
  host: { 'app.add-coupon-base': 'true' }
})
export class AddCouponBaseComponent extends ViewComponent implements OnInit {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() {
  }
}