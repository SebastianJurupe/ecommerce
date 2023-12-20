import { Component, Injector } from '@angular/core';
import { AddCardBaseComponent } from '../base/add-card-base.component';


@Component({
  templateUrl: 'add-card-mobile.component.html',
  styleUrls: ['add-card-mobile.component.scss'],
  host: { 'app.add-card-mobile': 'true' }
})
export class AddCardMobileComponent extends AddCardBaseComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }

  back() {
    this.navigation.back('/app/ecommerce/profile/cards');
  }
  saveMobile() {
    this.submit().then(() => {
      this.navigation.forward('/app/ecommerce/profile/cards');
    });
  }
}