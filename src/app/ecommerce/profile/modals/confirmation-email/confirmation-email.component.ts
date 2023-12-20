import { Component, Injector, Input } from '@angular/core';
import { AppConfigurationService, ViewComponent } from '@geor360/core';
import { CodeConfirmationEmailTabletComponent } from '../../code-confirmation-email/tablet/code-confirmation-email-tablet.component';
import { AnimationModalService } from '@shared/services/animation-modal.service';

@Component({
  templateUrl: 'confirmation-email.component.html',
  styleUrls: ['confirmation-email.component.scss'],
  host: { 'app.confirmation-email': 'true' }
})
export class ConfirmationEmailComponent extends ViewComponent {

  private _configuration: AppConfigurationService;
  private _animationModalService: AnimationModalService;
  @Input() data: any;
  @Input() showHeader: boolean = true;

  device: string;

  constructor(_injector: Injector) {
    super(_injector);
    this._configuration = _injector.get(AppConfigurationService);
    this._animationModalService = _injector.get(AnimationModalService);
    this.device = this._configuration.screen();
  }

  emailCode() {
    if (this.device === 'mobile') {
      this.dialog.dismiss('confirm');
    } else {
      this.dialog.dismiss();
      setTimeout(() => {
        this.dialog.showWithData<"cancel" | any>({
          component: CodeConfirmationEmailTabletComponent,
          backdropDismiss: false,
          leaveAnimation: this._animationModalService.closeDesktopModal,
          cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
          componentProps: {
            data: this.data,
            showHeader: this.showHeader
          },
        });
      }, 100);
    }
  }
}
