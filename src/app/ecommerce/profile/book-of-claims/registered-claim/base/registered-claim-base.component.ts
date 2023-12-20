import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'registered-claim-base.component.html',
  styleUrls: ['registered-claim-base.component.scss'],
  host: { 'app.registered-claim-base': 'true' }
})
export class RegisteredClaimBaseComponent extends ViewComponent implements OnInit {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() {
  }
}