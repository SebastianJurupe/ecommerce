import { Component, Injector, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalCountryComponent } from '@shared/components';
import { ConfirmEmailTabletComponent } from '../../confirm-email/tablet/confirm-email-tablet.component';
import { LoginBaseComponent } from '../base/login-base.component';
import { AnimationModalService } from '@shared/services/animation-modal.service';
import { RegisterTabletComponent } from '../../register';

@Component({
  selector: 'app-tablet',
  templateUrl: 'login-tablet.component.html',
  styleUrls: ['login-tablet.component.scss'],
  host: { 'app.login-tablet': 'true' }
})
export class LoginTabletComponent extends LoginBaseComponent {

  private _animationModalService: AnimationModalService;
  @Input() showHeader: boolean = true;

  constructor(_injector: Injector, private modalCtrl: ModalController) {
    super(_injector);
    this.selectedLanguage = this.localization.currentLanguage;
    this._animationModalService = _injector.get(AnimationModalService);

    this.setPlaceholders();
  }


  register() {
    this.closeModal();
    setTimeout(() => {
      this.dialog.showWithData<"cancel" | any>({
        component: RegisterTabletComponent,
        leaveAnimation: this._animationModalService.closeDesktopModal,
        backdropDismiss: false,
        componentProps: {
          showHeader: false
        },
        cssClass: ['modal-custom', 'modal-custom--in-center-medium']
      });
    }, 100);
  }




  async closeModal() {
    await this.modalCtrl.dismiss();
  }

  async loginTablet() {
    this.login().then(() => {
      this.isLoading = false;

      window.location.reload();
    }).catch((err) => {
      this.isLoading = false;
      this.message.exception(err);
    });
  }

  filterByCountryModal() {
    this.dialog.showWithData({
      component: ModalCountryComponent,
      cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
      componentProps: {
        title: 'País',
        showCode: false,
        countryId: this.country.id,
        countryCode: this.country.code,
        tax: false,
      },
    }).then((response: any) => {
      if (response.data.result !== 'cancel') {
        this.country = response.data.result;
      }
    });
  }

  resetPassword() {
    this.closeModal();
    setTimeout(() => {
      this.dialog.showWithData<"cancel" | any>({
        component: ConfirmEmailTabletComponent,
        cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
        leaveAnimation: this._animationModalService.closeDesktopModal,
        backdropDismiss: false,
        componentProps: {
          showHeader: this.showHeader
        },
      });
    }, 100);

  }
}
