import { Component, Injector, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ApiException, AppConfigurationService, AppTabService, ViewComponent } from '@geor360/core';
import { AccountServiceProxy } from '@shared/proxies/profile/account.proxie';
import { ProfileGetPersonalInformationOutputDataDto } from '@shared/proxies/profile/profile.proxies';
import { CameraGalleryComponent } from '../../modals/camera-gallery/camera-gallery.component';
import { EmailMobileComponent } from '../../modals/email';
import { NameMobileComponent } from '../../modals/name';
import { PasswordMobileComponent } from '../../modals/password';
import { PhoneMobileComponent } from '../../modals/phone';
import { UnverifiedAccountComponent } from '../../modals/unverified-account/unverified-account.component';
import { VerifyEmailPhoneComponent } from '../../modals/verify-email-phone/verify-email-phone.component';
import { PersonalInformationService } from '../../services/personal-information.service';

@Component({
  templateUrl: 'personal-information-mobile.component.html',
  styleUrls: ['personal-information-mobile.component.scss'],
  host: { 'app.personal-information-mobile': 'true' }
})
export class PersonalInformationMobileComponent extends ViewComponent implements OnInit {

  private _accountServiceProxy: AccountServiceProxy;
  private _appConfigurationService: AppConfigurationService;
  private _personalInformationService: PersonalInformationService;
  private _toolbar: AppTabService;

  defaultAvatarSrc: string = '/assets/general/avatar.png';
  personalInformation: ProfileGetPersonalInformationOutputDataDto = new ProfileGetPersonalInformationOutputDataDto();
  successUpdatedMessage: string = this.localization.localize('profile.home.updatePersonalInformation', 'ecommerce');

  constructor(_injector: Injector) {
    super(_injector);
    this._accountServiceProxy = _injector.get(AccountServiceProxy);
    this._appConfigurationService = _injector.get(AppConfigurationService);
    this._personalInformationService = _injector.get(PersonalInformationService);
    this._toolbar = _injector.get(AppTabService);
    this.onShowUnverifiedModal();
  }

  get modalClasses(): string[] {
    return this._appConfigurationService.screen() === 'mobile'
      ? ['modal-custom', 'modal-custom--full']
      : ['modal-custom', 'modal-custom--in-center-medium'];
  }

  ngOnInit() {
    this._toolbar.hide();
    this._personalInformationService.setPersonalInformation();
    this._personalInformationService.personalInformation$
      .subscribe((personalInformation) => {
        this.personalInformation = personalInformation;
      });
  }

  onChangeProfile() {
    this.dialog.showWithData({
      component: CameraGalleryComponent,
      cssClass: ['modal-custom', 'modal-custom--bottom']
    }).then(res => {
      const response = res.data.result;
      switch (response) {
        case 'camera':
          this.onCompleteCapture(CameraSource.Camera);
          break;
        case 'gallery':
          this.onCompleteCapture(CameraSource.Photos);
          break;

        default:
          this.onCompleteCapture(CameraSource.Camera);
          break;
      }
    });
  }

  async onCompleteCapture(source: CameraSource): Promise<void> {
    const resource = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: source,
      correctOrientation: true,
    });
    this.personalInformation.avatar = `data:image/jpg;base64,${resource.base64String}`;

    try {
      const updated = await this._personalInformationService.updatePersonalInformation(this.personalInformation);

      if (updated) {
        this.notify.success(this.successUpdatedMessage, 2500);
        this.session.user.profilePicture = this.personalInformation.avatar;

      }
    } catch (error) {
      console.error(error);
    }
  }

  onShowUpdateNameModal() {
    this.dialog.showWithData<'cancel' | string>({
      component: NameMobileComponent,
      componentProps: {
        personalInformation: this.personalInformation,
      }
    }).then(res => {
      if (res.data.result !== 'cancel') {
        this.notify.success(this.successUpdatedMessage, 2500);
      }
    });
  }

  onShowUpdateEmailModal() {
    this.dialog.showWithData<'cancel' | string>({
      component: EmailMobileComponent,
    });
  }

  onShowUpdatePhoneModal() {
    this.dialog.showWithData<'cancel' | undefined>({
      component: PhoneMobileComponent,
    });
  }

  onShowUpdatePasswordModal() {
    this.dialog.showWithData<'cancel' | undefined>({
      component: PasswordMobileComponent,
    });
  }

  onValidateEmail() {
    this._accountServiceProxy.sendVerificationCodeEmail()
      .subscribe({
        next: () => {
          this.onOpenVerifyAccountModal('email');
        },
        error: (err: ApiException) => this.message.exception(err)
      });
  }

  onValidatePhone() {
    this._accountServiceProxy.sendVerificationCodePhone()
      .subscribe({
        next: () => {
          this.onOpenVerifyAccountModal('phone');
        },
        error: (err: ApiException) => this.message.exception(err)
      });
  }

  onOpenVerifyAccountModal(type: 'phone' | 'email') {
    this.dialog.showWithData({
      component: VerifyEmailPhoneComponent,
      componentProps: {
        type: type,
        term: type === 'phone' ? this.session.user.phoneNumber : this.session.user.emailAddress
      },
      cssClass: this.modalClasses
    });
  }

  onShowUnverifiedModal() {
    if (!this.session.user.isEmailConfirmed || !this.session.user.isPhoneNumberConfirmed) {
      this.dialog.showWithData({
        component: UnverifiedAccountComponent,
        cssClass: ['modal-custom', 'modal-custom--in-center-90']
      });
    }
  }

  onBackButtonPressed() {
    this.navigation.back('/app/ecommerce/profile/setting');
  }
}
