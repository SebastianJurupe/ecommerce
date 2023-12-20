import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'change-mode-desktop.component.html',
  styleUrls: ['change-mode-desktop.component.scss'],
  host: { 'app.change-mode-desktop': 'true' }
})
export class ChangeModeDesktopComponent extends ViewComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }
}
