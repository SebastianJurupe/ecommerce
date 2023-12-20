import { Component, Injector } from '@angular/core';
import { HelpBaseComponent } from '../base/help-base.component';

@Component({
  templateUrl: 'help-desktop.component.html',
  styleUrls: ['help-desktop.component.scss'],
  host: { 'app.help-desktop': 'true' }
})
export class HelpDesktopComponent extends HelpBaseComponent {

  optionsDesktop = [
    {
      icon: 'icon icon--headphones',
      name: this.localization.localize('profile.help.talkToSales', 'ecommerce'),
      method: () => {
        // this.navigation.forwardNoAnimation('/app/ecommerce/inbox/home', { from: 'help' })
      }
    },
    {
      icon: 'icon icon--book',
      name: this.localization.localize('profile.help.bookOfClaims', 'ecommerce'),
      method: () => this.navigation.forwardNoAnimation('/app/ecommerce/profile/book-of-claims')
    }
  ];

  constructor(_injector: Injector) {
    super(_injector);
  }
}