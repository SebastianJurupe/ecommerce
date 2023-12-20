import { Component, Injector, Input } from '@angular/core';

import { Keyboard } from '@geor360/capacitor-keyboard';
import { AnimationModalService } from '@shared/services/animation-modal.service';
import { LoginTabletComponent } from '../../login/tablet/login-tablet.component';
import { CodeConfirmationEmailBaseComponent } from '../base/code-confirmation-email-base.component';

@Component({
  templateUrl: 'code-confirmation-email-tablet.component.html',
  styleUrls: ['code-confirmation-email-tablet.component.scss'],
  host: { 'app.code-confirmation-email-tablet': 'true' }
})
export class CodeConfirmationEmailTabletComponent extends CodeConfirmationEmailBaseComponent {

  private _animationModalService: AnimationModalService;

  @Input() data: any;
  @Input() showHeader: boolean = true;

  constructor(_injector: Injector) {
    super(_injector);
    this._animationModalService = _injector.get(AnimationModalService);
  }

  override ionViewWillEnter() {
    if (this.showHeader) {
      this.toolbar.show();
    }
    const { email } = this.data;
    this.email = email;
    setTimeout(() => this.ionInput.setFocus(), 700);
  }

  onInput(ev: any) {
    const value = ev.target.value;
    const numericValue = value.replace(/[^0-9]+/g, '');
    const truncatedValue = numericValue.slice(0, 6);
    if (truncatedValue.length >= 6) {
      this.isMaxLengthReached = true;
      this.onValidateEmailCodeTablet(truncatedValue);
    } else {
      this.isMaxLengthReached = false;
    }
    this.ionInput.value = this.inputModel = truncatedValue;
  }

  onValidateEmailCodeTablet(code: string) {
    this.onValidateCode(code).then(() => {
      if (this.platform.is('mobile')) {
        Keyboard.hide();
      }
      setTimeout(() => {
        this.back();
        window.location.reload();
      }, 100);
    });
  }

  onOpenModalLogin() {
    this.dialog
      .showWithData<"confirm" | undefined>({
        component: LoginTabletComponent,
        backdropDismiss: false,
        leaveAnimation: this._animationModalService.closeDesktopModal,
        cssClass: ['modal-custom', 'modal-custom--in-center-medium']
      });
  }

  async back() {
    await this.dialog.dismiss();
  }
}
