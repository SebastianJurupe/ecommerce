import { Component, Injector } from '@angular/core';
import { InboxDashboardBaseComponent } from '../base/dashboard-base.component';

@Component({
  selector: 'inbox-dashboard',
  templateUrl: 'dashboard-desktop.component.html',
  styleUrls: [
    'dashboard-desktop.component.scss'
  ]
})
export class InboxDashboardDesktopComponent extends InboxDashboardBaseComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }
}