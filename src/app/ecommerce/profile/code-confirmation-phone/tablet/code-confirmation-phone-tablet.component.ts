import { Component, Injector, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AnimationModalService } from '@shared/services/animation-modal.service';
import { ConfirmationEmailComponent } from '../../modals/confirmation-email/confirmation-email.component';
import { CodeConfirmationPhoneBaseComponent } from '../base/code-confirmation-phone-base.component';

@Component({
  selector: 'app-code-confirmation-phone-tablet',
  templateUrl: 'code-confirmation-phone-tablet.component.html',
  styleUrls: ['code-confirmation-phone-tablet.component.scss'],
  host: { 'app.code-confirmation-phone-tablet': 'true' }
})
export class CodeConfirmationPhoneTabletComponent extends CodeConfirmationPhoneBaseComponent implements OnInit {

  private _animationModalService: AnimationModalService;
  @Input() data: any;
  @Input() showHeader: boolean = true;

  constructor(_injector: Injector, private modalCtrl: ModalController) {
    super(_injector);
    this._animationModalService = _injector.get(AnimationModalService);
  }

  override ngOnInit() {
    this.onStartCountdown();
    setTimeout(() => this.ionInput.setFocus(), 700);
    const { phone, email } = this.data;

    this.phone = phone;
    this.email = email;
  }

  override ionViewWillEnter() {
    if (this.showHeader) {
      this.toolbar.show();
    }
    setTimeout(() => this.ionInput.setFocus(), 700);
  }

  onInput(ev: any) {
    const value = ev.target.value;
    const numericValue = value.replace(/[^0-9]+/g, '');
    const truncatedValue = numericValue.slice(0, 6);
    if (truncatedValue.length >= 6) {
      this.isMaxLengthReached = true;
      this.onValidatePhoneCodeTablet(truncatedValue);
    } else {
      this.isMaxLengthReached = false;
    }
    this.ionInput.value = this.inputModel = truncatedValue;
  }

  onValidatePhoneCodeTablet(code: string) {
    this.onValidatePhoneCode(code).then(() => {
      this.onShowModalLabels();
    });
  }

  onShowModalLabels() {
    this.dialog.dismiss();
    setTimeout(() => {
      this.dialog.showWithData<'cancel' | undefined>({
        component: ConfirmationEmailComponent,
        backdropDismiss: false,
        leaveAnimation: this._animationModalService.closeDesktopModal,
        cssClass: ['modal-custom', 'modal-custom--in-center-90'],
        componentProps: {
          data: this.data,
          showHeader: this.showHeader
        }
      }).then(() => {
        this.inputModel = '';
        this.onSendEmailCode();
      });
    }, 100);

  }

  async back() {
    await this.modalCtrl.dismiss('cancel');
  }
}
