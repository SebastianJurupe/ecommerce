import { Component, Injector } from '@angular/core';
import { PasswordBaseComponent } from '../base/password-base.component';

@Component({
  templateUrl: 'password-mobile.component.html',
  styleUrls: ['password-mobile.component.scss'],
  host: { 'app.password-mobile': 'true' }
})
export class PasswordMobileComponent extends PasswordBaseComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }

}