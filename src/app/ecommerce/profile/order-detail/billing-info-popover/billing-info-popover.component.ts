import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'billing-info-popover.component.html',
  styleUrls: ['billing-info-popover.component.scss'],
  host: { 'app.billing-info-popover': 'true' }
})
export class BillingInfoPopoverComponent extends ViewComponent implements OnInit {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() {
  }
}