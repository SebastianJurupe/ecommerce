import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'terms-and-conditions-of-shipment-base.component.html',
  styleUrls: ['terms-and-conditions-of-shipment-base.component.scss'],
  host: { 'app.terms-and-conditions-of-shipment-base': 'true' }
})
export class TermsAndConditionsOfShipmentBaseComponent extends ViewComponent implements OnInit {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() {
  }
}