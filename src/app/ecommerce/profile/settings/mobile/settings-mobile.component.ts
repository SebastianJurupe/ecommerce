import { Component, Injector } from '@angular/core';
import { ApiException, AppPreferenceService } from '@geor360/core';
import { ViewWillEnter } from '@ionic/angular';
import { AuthServiceProxy } from '@shared/proxies/profile/auth.proxie';
import { LogoutComponent } from '../../modals/logout/mobile/logout.component';
import { SettingsBaseComponent } from '../base/settings-base.component';
import { BasketService } from '@shared/services/basket.service';

@Component({
  templateUrl: 'settings-mobile.component.html',
  styleUrls: ['settings-mobile.component.scss'],
  host: { 'app.settings-mobile': 'true' }
})
export class SettingsMobileComponent extends SettingsBaseComponent implements ViewWillEnter {

  private _appPreferenceService: AppPreferenceService;
  private _authServiceProxy: AuthServiceProxy;
  private basketService: BasketService;

  isLoading: boolean = false;

  constructor(_injector: Injector) {
    super(_injector);
    this._appPreferenceService = _injector.get(AppPreferenceService);
    this._authServiceProxy = _injector.get(AuthServiceProxy);
    this.basketService = _injector.get(BasketService);
  }

  ionViewWillEnter() {
    this.toolbar.hide();
    this.getSelectedLanguageAndMode();
  }

  navigateToSection(path: string) {
    this.navigation.forward(`/app/ecommerce/profile/${path}`);
  }

  onLogOut() {
    this.dialog.showWithData<'cancel' | 'logout'>({
      component: LogoutComponent,
      cssClass: ['modal-custom', 'modal-custom--in-center'],
    }).then((res) => {
      if (res.data.result !== 'cancel') {
        this.isLoading = true;

        this._authServiceProxy.logOut()
          .subscribe({
            next: () => {
              this.clearTokens();
              this.isLoading = false;
              this.basketService.resetBasket();
              this.navigation.forward('/app/ecommerce/home/home');
            },
            error: (err: ApiException) => {
              this.isLoading = false;
              console.error(err);
            },
          });
      }
    });
  }

  private async clearTokens() {
    await this._appPreferenceService.clear();
  }

  onBackButtonPressed() {
    if (!this.session.user.isEmailConfirmed || !this.session.user.isPhoneNumberConfirmed) return;

    this.navigation.back('/app/ecommerce/profile/home');
    this.toolbar.show();

  }
}
