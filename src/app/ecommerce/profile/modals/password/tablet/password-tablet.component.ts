import { Component, Injector } from '@angular/core';
import { PasswordBaseComponent } from '../base/password-base.component';

@Component({
  templateUrl: 'password-tablet.component.html',
  styleUrls: ['password-tablet.component.scss'],
  host: { 'app.password-tablet': 'true' }
})
export class PasswordTabletComponent extends PasswordBaseComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() { }

  arePasswordFieldsFilled(): boolean {
    return this.newPassword.length > 0 && this.confirmPassword.length > 0;
  }
}