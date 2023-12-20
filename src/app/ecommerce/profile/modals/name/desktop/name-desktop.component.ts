import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'name-desktop.component.html',
  styleUrls: ['name-desktop.component.scss'],
  host: { 'app.name-desktop': 'true' }
})
export class NameDesktopComponent extends ViewComponent {

  inputValue: string = '';
  buttonDisabled: boolean = true;

  constructor(_injector: Injector) {
    super(_injector);
  }

  enableButton() {
    this.inputValue ? this.buttonDisabled = false : this.buttonDisabled = true;
  }
}
