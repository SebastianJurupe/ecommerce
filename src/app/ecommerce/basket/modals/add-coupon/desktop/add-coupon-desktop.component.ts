import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'add-coupon-desktop.component.html',
  styleUrls: ['add-coupon-desktop.component.scss'],
  host: { 'app.add-coupon-desktop': 'true' }
})
export class AddCouponDesktopComponent extends ViewComponent implements OnInit {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() {
  }
}