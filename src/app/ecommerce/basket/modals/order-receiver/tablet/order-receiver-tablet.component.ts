import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'order-receiver-tablet.component.html',
  styleUrls: ['order-receiver-tablet.component.scss'],
  host: { 'app.order-receiver-tablet': 'true' }
})
export class OrderReceiverTabletComponent extends ViewComponent implements OnInit {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() {
  }
}