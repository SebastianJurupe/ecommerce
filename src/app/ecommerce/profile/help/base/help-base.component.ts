import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'help-base.component.html',
  styleUrls: ['help-base.component.scss'],
  host: { 'app.help-base': 'true' }
})
export class HelpBaseComponent extends ViewComponent {

  options = [
    {
      name: this.localization.localize('profile.help.talkToSales', 'ecommerce'),
      method: () => {
        // this.navigation.forward('/app/ecommerce/inbox/home', { from: 'help' })

      }
    },
    {
      name: this.localization.localize('profile.help.bookOfClaims', 'ecommerce'),
      method: () => this.navigation.forward('/app/ecommerce/profile/book-of-claims')
    }
  ];

  constructor(_injector: Injector) {
    super(_injector);
  }
}