import { Component, Injector } from '@angular/core';
import { AppTabService } from '@geor360/core';
import { HelpBaseComponent } from '../base/help-base.component';

@Component({
  templateUrl: 'help-mobile.component.html',
  styleUrls: ['help-mobile.component.scss'],
  host: { 'app.help-mobile': 'true' }
})
export class HelpMobileComponent extends HelpBaseComponent {

  private _toolbar: AppTabService;

  constructor(_injector: Injector) {
    super(_injector);
    this._toolbar = _injector.get(AppTabService);
  }

  ionViewWillEnter() {
    this._toolbar.hide();
  }

  onBackButtonPressed() {
    this.navigation.back('/app/ecommerce/profile/home');
    this._toolbar.show();
  }
}