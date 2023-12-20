import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { EmailCodeComponent } from '../../email-code/email-code.component';

@Component({
  templateUrl: 'email-desktop.component.html',
  styleUrls: ['email-desktop.component.scss'],
  host: { 'app.email-desktop': 'true' }
})
export class EmailDesktopComponent extends ViewComponent {
  
  inputValue: string = '';
  buttonDisabled: boolean = true;

  constructor(_injector: Injector) {
    super(_injector);
  }

  showModalEmailCode() {
    this.dialog.showWithData<"cancel" | undefined>({
      component: EmailCodeComponent,
      cssClass: ['modal-custom', 'modal-custom--full'],
      componentProps: {
      }
    });
  }

  enableButton() {
    this.inputValue ? this.buttonDisabled = false : this.buttonDisabled = true;
  }
}
