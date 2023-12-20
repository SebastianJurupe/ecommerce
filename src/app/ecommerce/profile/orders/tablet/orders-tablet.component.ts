import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'orders-tablet.component.html',
  styleUrls: ['orders-tablet.component.scss'],
  host: { 'app.orders-tablet': 'true' }
})
export class OrdersTabletComponent extends ViewComponent implements OnInit {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() {
  }
}