import { Component, Injector, OnInit } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { CardsBaseComponent } from '../base/cards-base.component';


@Component({
  templateUrl: 'cards-mobile.component.html',
  styleUrls: ['cards-mobile.component.scss'],
  host: { 'app.cards-mobile': 'true' }
})

export class CardsMobileComponent extends CardsBaseComponent implements OnInit, ViewWillEnter {

  constructor(_injector: Injector) {
    super(_injector);
  }

  addCard() {
    this.navigation.forward('/app/ecommerce/profile/add-card');
  }

  back() {
    this.navigation.back('/app/ecommerce/profile/home');
    this.toolbar.show();
  }
}