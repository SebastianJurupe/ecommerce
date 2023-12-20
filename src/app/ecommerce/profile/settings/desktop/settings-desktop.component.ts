import { Component, Injector } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ApiException, AppCoreConsts, AppPreferenceService, AppTabService } from '@geor360/core';
import { PopoverController } from '@ionic/angular';
import { ChooseLanguagePopoverComponent } from '@shared/components';
import { AuthServiceProxy } from '@shared/proxies/profile/auth.proxie';
import { ProfileGetPersonalInformationOutputDataDto } from '@shared/proxies/profile/profile.proxies';
import { HeaderDesktopService } from '@shared/services/header-desktop.service';
import { ChangeModeTabletComponent } from '../../change-mode';
import { EmailTabletComponent } from '../../modals/email';
import { LogoutDesktopComponent } from '../../modals/logout';
import { NameTabletComponent } from '../../modals/name';
import { PasswordTabletComponent } from '../../modals/password';
import { PhoneTabletComponent } from '../../modals/phone';
import { PersonalInformationService } from '../../services/personal-information.service';
import { SettingsBaseComponent } from '../base/settings-base.component';
import { AnimationModalService } from '@shared/services/animation-modal.service';
import { ModalCropperComponent } from '../modal-cropper/modal-cropper.component';

@Component({
  templateUrl: 'settings-desktop.component.html',
  styleUrls: ['settings-desktop.component.scss'],
  host: { 'app.settings-desktop': 'true' }
})
export class SettingsDesktopComponent extends SettingsBaseComponent {

  private _animationModalService: AnimationModalService;
  private _appPreferenceService: AppPreferenceService;
  private _authServiceProxy: AuthServiceProxy;
  private _personalInformationService: PersonalInformationService;
  private _popoverController: PopoverController;

  defaultAvatarSrc: string = '/assets/general/avatar.png';
  disabled: boolean = false;
  headerDesktopService: HeaderDesktopService;
  personalInformation: ProfileGetPersonalInformationOutputDataDto = new ProfileGetPersonalInformationOutputDataDto();
  successUpdatedMessage: string = this.localization.localize('profile.home.updatePersonalInformation', 'ecommerce');

  constructor(_injector: Injector) {
    super(_injector);
    this._animationModalService = _injector.get(AnimationModalService);
    this._appPreferenceService = _injector.get(AppPreferenceService);
    this._authServiceProxy = _injector.get(AuthServiceProxy);
    this._personalInformationService = _injector.get(PersonalInformationService);
    this._popoverController = _injector.get(PopoverController);
    this.headerDesktopService = _injector.get(HeaderDesktopService);
    this.toolbar = _injector.get(AppTabService);
    this.showUnverifiedModal();
  }

  ngOnInit() {
    this._personalInformationService.setPersonalInformation();
    this._personalInformationService.personalInformation$
      .subscribe((personalInformation) => {
        this.personalInformation = personalInformation;
      });
    if (!this.session.user.isEmailConfirmed || !this.session.user.isPhoneNumberConfirmed) {
      this.disabled = true;
    }
  }

  ionViewWillEnter() {
    this.toolbar.show();
    this.getSelectedLanguageAndMode();
  }

  onClearTokens = (preferenceService: AppPreferenceService): Promise<void> => new Promise<void>(async (resolve) => {
    try {
      await preferenceService.del(AppCoreConsts.authorization.authTokenName);
    } catch (error) {
      throw new Error(error as string);
    }
    try {
      await preferenceService.del(AppCoreConsts.authorization.refreshAuthTokenName);
    } catch (error) {
      throw new Error(error as string);
    }
    try {
      await preferenceService.del(AppCoreConsts.authorization.encrptedAuthTokenName);
    } catch (error) {
      throw new Error(error as string);
    }

    resolve();
  });


  navigateToHome() {
    if (!this.disabled)
      this.navigation.back('/app/ecommerce/home/home');
  }

  navigateToInbox() {
    if (!this.disabled)
      this.navigation.back('/app/ecommerce/inbox');
  }

  onShowUpdateNameModal() {
    if (!this.disabled)
      this.dialog.showWithData<'cancel' | string>({
        component: NameTabletComponent,
        componentProps: {
          personalInformation: this.personalInformation,
        },
        enterAnimation: this._animationModalService.openDesktopModal,
        leaveAnimation: this._animationModalService.closeDesktopModal,
        cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
      }).then(res => {
        if (res.data.result !== 'cancel') {
          this.notify.success(this.successUpdatedMessage, 2500);
        }
      });
  }

  onShowUpdatePasswordModal() {
    if (!this.disabled)
      this.dialog.showWithData<'cancel' | undefined>({
        component: PasswordTabletComponent,
        enterAnimation: this._animationModalService.openDesktopModal,
        leaveAnimation: this._animationModalService.closeDesktopModal,
        cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
      });
  }

  async onChooseLanguagePopover(event: Event) {
    const popover = await this._popoverController.create({
      component: ChooseLanguagePopoverComponent,
      event: event,
      arrow: false,
      side: 'bottom',
      componentProps: {
        code: this.selectedLanguageCode
      },
      cssClass: ['choose-language-popover-information'],
      alignment: 'end',
    });

    await popover.present();

    const res = await popover.onDidDismiss();

    if (res.data) {
      const { code, label } = res.data;
      this.selectedLanguage = label;
      this.selectedLanguageCode = code;
      this.localization.changeLanguage(code);
      this.getSelectedLanguageAndMode();
      this.headerDesktopService.emitFunctionLanguageEvent();
    }
  }

  async onOpenChangeModePopover(event: Event) {
    const popover = await this._popoverController.create({
      component: ChangeModeTabletComponent,
      event: event,
      arrow: false,
      side: 'bottom',
      cssClass: ['choose-language-popover-information'],
      alignment: 'end',
    });

    await popover.present();

    const res = await popover.onDidDismiss();

    if (res.data) {
      this.selectedMode = res.data;
    }
  }

  onShowUpdateEmailModal() {
    this.dialog.showWithData<'cancel' | string>({
      component: EmailTabletComponent,
      enterAnimation: this._animationModalService.openDesktopModal,
      leaveAnimation: this._animationModalService.closeDesktopModal,
      cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
    });
  }

  onShowUpdatePhoneModal() {
    this.dialog.showWithData<'cancel' | undefined>({
      component: PhoneTabletComponent,
      componentProps: {
        phone: this.personalInformation.phone
      },
      enterAnimation: this._animationModalService.openDesktopModal,
      leaveAnimation: this._animationModalService.closeDesktopModal,
      cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
    });
  }

  onLogOutTablet() {
    this.dialog.showWithData<'cancel' | 'logout'>({
      component: LogoutDesktopComponent,
      enterAnimation: this._animationModalService.openDesktopModal,
      leaveAnimation: this._animationModalService.closeDesktopModal,
      cssClass: ['modal-custom', 'modal-custom--in-center-small']

    }).then((res) => {
      if (res.data.result !== 'cancel') {
        this._authServiceProxy.logOut()
          .subscribe({
            next: () => {
              this.onClearTokens(this._appPreferenceService).then(async () => {
                this.navigation.forward('/app/ecommerce/home/home');
                window.location.reload();
                this.session.clear();
              });
            },
            error: (err: ApiException) => {
              this.message.exception(err);
            },
          });
      }
    });
  }

  onChangeProfile() {
    if (!this.disabled)
      this.onCompleteCapture(CameraSource.Camera);
  }

  async onCompleteCapture(source: CameraSource): Promise<void> {
    const resource = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: source,
      correctOrientation: true,
    });

    this.dialog.showWithData<'cancel' | 'logout'>({
      component: ModalCropperComponent,
      enterAnimation: this._animationModalService.openDesktopModal,
      leaveAnimation: this._animationModalService.closeDesktopModal,
      componentProps: {
        defaultAvatarSrc: resource.webPath
      },
      cssClass: ['modal-custom', 'modal-custom--in-center-medium'],

    }).then(async (res: any) => {
      if (res.data.result !== 'cancel') {
        try {

          this.personalInformation.avatar = res.data.result;

          const updated = await this._personalInformationService.updatePersonalInformation(this.personalInformation);

          if (updated) {
            this.notify.success(this.successUpdatedMessage, 2500);
            this.session.user.profilePicture = this.personalInformation.avatar;

          }
        } catch (error) {
          console.error(error);
        }
      }
    });

  }

  onBackButtonPressed() {
    this.navigation.back('/app/ecommerce/profile/home');
    this.toolbar.show();
  }

  onViewMenu() {
    if (!this.disabled)
      this.headerDesktopService.viewMenu();
  }

  navigateToBasket() {
    if (!this.disabled)
      this.headerDesktopService.goToShoppingCart();
  }

  onOpenProfilePopover($event: Event) {
    if (!this.disabled)
      this.headerDesktopService.profilePopover($event);
  }

}
