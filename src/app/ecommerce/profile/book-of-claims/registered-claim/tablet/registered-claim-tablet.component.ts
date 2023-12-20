import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'registered-claim-tablet.component.html',
  styleUrls: ['registered-claim-tablet.component.scss'],
  host: { 'app.registered-claim-tablet': 'true' }
})
export class RegisteredClaimTabletComponent extends ViewComponent implements OnInit {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() {
  }
}