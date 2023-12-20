import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'invoice-item-tablet.component.html',
  styleUrls: ['invoice-item-tablet.component.scss'],
  host: { 'app.invoice-item-tablet': 'true' }
})
export class InvoiceItemTabletComponent extends ViewComponent implements OnInit {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() {
  }
}