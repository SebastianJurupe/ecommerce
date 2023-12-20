import { Component, Injector, Input, OnInit } from '@angular/core';
import { LoginTabletComponent } from '../../login';
import { AnimationModalService } from '@shared/services/animation-modal.service';
import { ResetPasswordBaseComponent } from '../base/reset-password-base.component';

@Component({
  selector: 'app-reset-password-tablet',
  templateUrl: './reset-password-tablet.component.html',
  styleUrls: ['./reset-password-tablet.component.scss'],
  host: { 'app.reset-password-tablet': 'true' }
})
export class ResetPasswordTabletComponent extends ResetPasswordBaseComponent implements OnInit {

  private _animationModalService: AnimationModalService;
  @Input() showHeader: boolean = true
  constructor(_injector: Injector) {
    super(_injector);

    this._animationModalService = _injector.get(AnimationModalService);
  }

  override ionViewWillEnter(): void {
    if (this.showHeader)
      this._toolbar.show();
  }

  submitTablet() {
    this.onSubmit().then(() => {
      this.dialog.dismiss();
      setTimeout(() => {
        this.loginNav();
      }, 100);
    });
  }

  loginNav() {
    this.dialog.dismiss();
    setTimeout(() => {
      this.dialog.showWithData<"cancel" | any>({
        component: LoginTabletComponent,
        backdropDismiss: false,
        leaveAnimation: this._animationModalService.closeDesktopModal,
        cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
        componentProps: {
        },
      });
    }, 100);
  }

}
