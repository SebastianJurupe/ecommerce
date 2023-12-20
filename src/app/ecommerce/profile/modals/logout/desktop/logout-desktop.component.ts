import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'logout-desktop.component.html',
  styleUrls: ['logout-desktop.component.scss'],
})
export class LogoutDesktopComponent extends ViewComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }

  logout() {
    this.dialog.dismiss('logout');
  }

  buttonCancel() {
    this.dialog.dismiss('cancel');
  }

}
