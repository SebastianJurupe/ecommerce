import { Component, Injector, Input } from '@angular/core';
import { CodeConfirmationResetTabletComponent } from '../../code-confirmation-reset';
import { AnimationModalService } from '@shared/services/animation-modal.service';
import { ConfirmEmailBaseComponent } from '../base/confirm-email-base.component';

@Component({
  templateUrl: 'confirm-email-tablet.component.html',
  styleUrls: ['confirm-email-tablet.component.scss'],
  host: { 'app.confirm-email-tablet': 'true' }
})

export class ConfirmEmailTabletComponent extends ConfirmEmailBaseComponent {


  private _animationModalService: AnimationModalService;
  @Input() showHeader: boolean = true;


  constructor(_injector: Injector) {
    super(_injector);
    this._animationModalService = _injector.get(AnimationModalService);

  }

  ionViewWillEnter(): void {
    if (this.showHeader)
      this.toolbar.show();
  }

  resetPasswordTablet() {
    this.onResetPassword().then(() => {
      this.dialog.dismiss();
      setTimeout(() => {
        this.dialog.showWithData<"cancel" | any>({
          component: CodeConfirmationResetTabletComponent,
          backdropDismiss: false,
          leaveAnimation: this._animationModalService.closeDesktopModal,
          cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
          componentProps: {
            emailTablet: this.email,
            tablet: true,
            showHeader: this.showHeader
          },
        });
      }, 200);
    });
  }

  async closeModal() {
    await this.dialog.dismiss();
  }
}
