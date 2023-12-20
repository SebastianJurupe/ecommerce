import { Component, Injector } from '@angular/core';
import { EmailBaseComponent } from '../base/email-base.component';
import { EmailCodeComponent } from '../../email-code/email-code.component';

@Component({
  templateUrl: 'email-tablet.component.html',
  styleUrls: ['email-tablet.component.scss'],
  host: { 'app.email-tablet': 'true' }
})
export class EmailTabletComponent extends EmailBaseComponent {

  inputValue: string = '';
  buttonDisabled: boolean = true;

  constructor(_injector: Injector) {
    super(_injector);
  }


  override showModalEmailCode() {
    this.dialog.showWithData<"cancel" | undefined>({
      component: EmailCodeComponent,
      cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
      componentProps: {
        email: this.email
      }
    }).then(res => {
      if (res.data.result !== 'cancel') {
        this.dialog.dismiss('confirm')
      }
    });
  }
  enableButton() {
    this.inputValue ? this.buttonDisabled = false : this.buttonDisabled = true;
  }

  cancel() {
    this.dialog.dismiss();
  }
}
