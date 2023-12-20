import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  selector: 'registered-claim-mobile',
  templateUrl: 'registered-claim-mobile.component.html',
  styleUrls: ['registered-claim-mobile.component.scss'],
  host: { 'app.registered-claim-mobile': 'true' }
})
export class RegisteredClaimMobileComponent extends ViewComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }
}