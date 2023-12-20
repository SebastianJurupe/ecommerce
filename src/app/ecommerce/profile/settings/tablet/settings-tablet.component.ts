import { Component, Injector } from '@angular/core';
import { AppPreferenceService, AppTabService } from '@geor360/core';
import { AuthServiceProxy } from '@shared/proxies/profile/auth.proxie';
import { ProfileGetPersonalInformationOutputDataDto } from '@shared/proxies/profile/profile.proxies';
import { HeaderDesktopService } from '@shared/services/header-desktop.service';
import { LogoutComponent } from '../../modals/logout/mobile/logout.component';
import { PersonalInformationService } from '../../services/personal-information.service';
import { SettingsBaseComponent } from '../base/settings-base.component';

@Component({
  templateUrl: 'settings-tablet.component.html',
  styleUrls: ['settings-tablet.component.scss'],
  host: { 'app.settings-tablet': 'true' }
})
export class SettingsTabletComponent extends SettingsBaseComponent {

  private _appPreferenceService: AppPreferenceService;
  private _authServiceProxy: AuthServiceProxy;
  private _personalInformationService: PersonalInformationService;

  defaultAvatarSrc: string = '/assets/general/avatar.png';
  headerDesktopService: HeaderDesktopService;
  personalInformation: ProfileGetPersonalInformationOutputDataDto = new ProfileGetPersonalInformationOutputDataDto();

  constructor(_injector: Injector) {
    super(_injector);
    this._appPreferenceService = _injector.get(AppPreferenceService);
    this._authServiceProxy = _injector.get(AuthServiceProxy);
    this._personalInformationService = _injector.get(PersonalInformationService);
    this.headerDesktopService = _injector.get(HeaderDesktopService);
    this.toolbar = _injector.get(AppTabService);
  }

  ngOnInit() {
    this._personalInformationService.setPersonalInformation();
    this._personalInformationService.personalInformation$
      .subscribe((personalInformation) => {
        this.personalInformation = personalInformation;
      });
  }

  navigateTo(path: string) {
    this.navigation.forward(`/app/ecommerce/profile/${path}`);
  }

  logOut() {
    this.dialog.showWithData<'cancel' | 'logout'>({
      component: LogoutComponent,
      cssClass: ['modal-custom', 'modal-custom--in-center'],
    }).then((res) => {
      if (res.data.result !== 'cancel') {
        this._authServiceProxy.logOut()
          .subscribe({
            next: () => {
              this.clearTokens();
              this.navigation.forward('/app/ecommerce/home/home');
            },
            error: (err) => {
              console.error(err);
            },
          });
      }
    });
  }

  private async clearTokens() {
    await this._appPreferenceService.clear();
  }

  brandButtonEventCliked() {
    this.navigation.back('/app/ecommerce/home/home');
  }

  inboxClick() {
    this.navigation.back('/app/ecommerce/inbox');
  }

  back() {
    this.navigation.back('/app/ecommerce/profile/home');
    this.toolbar.show();
  }
}

