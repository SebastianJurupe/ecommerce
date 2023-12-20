import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  selector: 'registered-claim-desktop',
  templateUrl: 'registered-claim-desktop.component.html',
  styleUrls: ['registered-claim-desktop.component.scss'],
  host: { 'app.registered-claim-desktop': 'true' }
})
export class RegisteredClaimDesktopComponent extends ViewComponent implements OnInit {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() {
  }
}