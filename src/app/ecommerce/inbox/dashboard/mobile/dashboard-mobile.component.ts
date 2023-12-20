import { Component, Injector } from '@angular/core';
import { InboxDashboardBaseComponent } from '../base/dashboard-base.component';

@Component({
  selector: 'inbox-dashboard',
  templateUrl: 'dashboard-mobile.component.html',
  styleUrls: [
    'dashboard-mobile.component.scss'
  ]
})
export class InboxDashboardMobileComponent extends InboxDashboardBaseComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }
}