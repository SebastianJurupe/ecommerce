import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'order-item-tablet.component.html',
  styleUrls: ['order-item-tablet.component.scss'],
  host: { 'app.order-item-tablet': 'true' }
})
export class OrderItemTabletComponent extends ViewComponent implements OnInit {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() {
  }
}