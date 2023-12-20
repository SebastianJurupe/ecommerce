import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'logout.component.html',
  styleUrls: ['logout.component.scss'],
  host: { 'app.logout': 'true' }
})
export class LogoutComponent extends ViewComponent {

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
