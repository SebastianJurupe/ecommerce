import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'about-base.component.html',
  styleUrls: ['about-base.component.scss'],
  host: { 'app.about-base': 'true' }
})
export class AboutBaseComponent extends ViewComponent {

  options = [
    {
      name: this.localization.localize('profile.about.about', 'ecommerce'),
      method: () => this.navigation.forward('/app/ecommerce/profile/about-us')
    },
    {
      name: this.localization.localize('profile.about.privacy', 'ecommerce'),
      method: () => this.navigation.forward('/app/ecommerce/profile/privacy-policies')
    },
    {
      name: this.localization.localize('profile.about.terms', 'ecommerce'),
      method: () => this.navigation.forward('/app/ecommerce/profile/terms-conditions')
    },
    {
      name: this.localization.localize('profile.about.exchanges', 'ecommerce'),
      method: () => this.navigation.forward('/app/ecommerce/profile/exchanges-returns')
    },
  ];

  constructor(_injector: Injector) {
    super(_injector);
  }

  onBackButtonPressed() {
    this.navigation.back('/app/ecommerce/profile/setting');
  }

}
