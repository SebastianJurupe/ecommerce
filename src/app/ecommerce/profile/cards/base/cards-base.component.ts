import { Component, Injector, OnInit } from '@angular/core';
import { AppConfigurationService, AppTabService, ViewComponent } from '@geor360/core';
import { DeleteCardDesktopComponent } from '../../modals/delete-card/desktop/delete-card.component-desktop';
import { Card, CardsService } from '../cards.service';
import { DeleteCardComponent } from '../../modals/delete-card/mobile/delete-card.component';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  templateUrl: 'cards-base.component.html',
  styleUrls: ['cards-base.component.scss'],
  host: { 'app.cards-base': 'true' }
})
export class CardsBaseComponent extends ViewComponent implements OnInit, ViewWillEnter {

  private _appConfigurationService: AppConfigurationService;

  toolbar: AppTabService;
  cardsService: CardsService;
  cards: Card[] = [];

  constructor(_injector: Injector) {
    super(_injector);
    this._appConfigurationService = _injector.get(AppConfigurationService);
    this.cardsService = _injector.get(CardsService);
    this.toolbar = _injector.get(AppTabService);
  }

  get deleteComponent() {
    const screen = this._appConfigurationService.screen();
    if (screen === 'mobile') {
      return DeleteCardComponent;
    }
    return DeleteCardDesktopComponent;
  }

  ngOnInit() {
    this.cardsService.getAll();
    this.cardsService.cards$.subscribe((cards) => this.cards = cards);
  }

  ionViewWillEnter() {
    this.toolbar.hide();
  }

  deleteCard(id: number) {
    this.dialog.showWithData({
      component: this.deleteComponent,
      cssClass: ['modal-custom', 'modal-custom--in-center-90']
    }).then(async ({ data: { result } }) => {
      if (result !== 'cancel') {
        const deleted = await this.cardsService.deleteById(id);

        if (deleted) {
          const message: string = this.localization.localize('profile.cards.deleteCard.succesfullyDeleted', 'ecommerce');
          this.notify.success(message, 2500);
        }
      }
    });
  }
}