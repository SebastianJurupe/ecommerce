import { Component, Injector, Input } from '@angular/core';
import { ViewComponent } from '@geor360/core';

type SendCodeByOption = 'whatsapp' | 'sms';

@Component({
  templateUrl: 'code-confirmation.component.html',
  styleUrls: ['code-confirmation.component.scss'],
  host: { 'app.code-confirmation': 'true' }
})
export class CodeConfirmationComponent extends ViewComponent {

  @Input() type: 'email' | 'phone' = 'email';

  constructor(_injector: Injector) {
    super(_injector);
  }

  sendCodeBy(option: SendCodeByOption) {
    this.dialog.dismiss(option);
  }
}
