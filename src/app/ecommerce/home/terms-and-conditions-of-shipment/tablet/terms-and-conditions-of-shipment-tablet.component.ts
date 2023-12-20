import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'terms-and-conditions-of-shipment-tablet.component.html',
  styleUrls: ['terms-and-conditions-of-shipment-tablet.component.scss'],
  host: { 'app.terms-and-conditions-of-shipment-tablet': 'true' }
})
export class TermsAndConditionsOfShipmentTabletComponent extends ViewComponent implements OnInit {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() {
  }
}