import { Component, Injector } from '@angular/core';
import { InboxDashboardBaseComponent } from '../base/dashboard-base.component';

@Component({
  selector: 'inbox-dashboard',
  templateUrl: 'dashboard-tablet.component.html',
  styleUrls: [
    'dashboard-tablet.component.scss'
  ]
})
export class InboxDashboardTabletComponent extends InboxDashboardBaseComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }
}