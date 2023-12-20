import { Component, Injector, Input } from '@angular/core';
import { ViewDidLeave } from '@ionic/angular';
import { ResetPasswordTabletComponent } from '../../reset-password';
import { AnimationModalService } from '@shared/services/animation-modal.service';
import { CodeConfirmationResetBaseComponent } from '../base/code-confirmation-reset-base.component';
import { AppTabService } from '@geor360/core';

@Component({
  selector: 'app-code-confirmation-reset-tablet',
  templateUrl: 'code-confirmation-reset-tablet.component.html',
  styleUrls: ['code-confirmation-reset-tablet.component.scss'],
  host: { 'app.code-confirmation-reset-tablet': 'true' }
})
export class CodeConfirmationResetTabletComponent extends CodeConfirmationResetBaseComponent implements ViewDidLeave {

  private _animationModalService: AnimationModalService;
  toolbar: AppTabService;

  @Input() showHeader: boolean = true
  constructor(_injector: Injector) {
    super(_injector);
    this._animationModalService = _injector.get(AnimationModalService);
    this.toolbar = _injector.get(AppTabService);

  }

  ionViewWillEnter(): void {
    if (this.showHeader)
      this.toolbar.show();
  }

  onInput(ev: any) {
    const value = ev.target.value;
    const numericValue = value.replace(/[^0-9]+/g, '');
    const truncatedValue = numericValue.slice(0, 6);

    if (truncatedValue.length >= 6) {
      this.isMaxLengthReached = true;
      this.validateResetPasswordCodeTablet(truncatedValue);

    } else {
      this.isMaxLengthReached = false;
    }
    this.ionInput.value = this.inputModel = truncatedValue;
  }

  validateResetPasswordCodeTablet(code: string) {
    this.validateResetPasswordCode(code).then(() => {
      this.accountServiceProxy.resetPasswordValidateCode(this.email, code)
        .subscribe({
          next: (data) => {
            if (data.is_valid) {
              this.dialog.dismiss();
              setTimeout(() => {
                this.dialog.showWithData<"cancel" | any>({
                  component: ResetPasswordTabletComponent,
                  backdropDismiss: false,
                  leaveAnimation: this._animationModalService.closeDesktopModal,
                  cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
                  componentProps: {
                    emailTablet: this.email,
                    codeTablet: code,
                    tablet: true,
                    showHeader: this.showHeader
                  },
                });
              }, 100);
            } else {
              this.message.error('El código es incorrecto');
            }
          },
          error: (err) => {
            this.message.exception(err);
          }
        });

    });
  }



}
