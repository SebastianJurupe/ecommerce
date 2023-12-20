import { Component, Injector } from '@angular/core';
import { HeaderDesktopService } from '@shared/services/header-desktop.service';
import { AddCardDesktopComponent } from '../add-card';
import { CardsBaseComponent } from '../base/cards-base.component';

@Component({
  templateUrl: 'cards-desktop.component.html',
  styleUrls: ['cards-desktop.component.scss'],
  host: { 'app.cards-desktop': 'true' }
})
export class CardsDesktopComponent extends CardsBaseComponent {

  headerDesktopService: HeaderDesktopService;

  constructor(_injector: Injector) {
    super(_injector);
    this.headerDesktopService = _injector.get(HeaderDesktopService);
  }

  brandButtonEventCliked() {
    this.navigation.back('/app/ecommerce/home/home');
  }

  inboxClick() {
    this.navigation.back('/app/ecommerce/inbox');
  }

  addCard() {
    this.dialog.showWithData<'cancel' | string>({
      component: AddCardDesktopComponent,
      cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
    }).then(res => {
      if (res.data.result !== 'cancel') {
      }
    });
  }
}