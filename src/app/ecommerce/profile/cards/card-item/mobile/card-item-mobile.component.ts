import { Component, Injector } from '@angular/core';
import { CardItemBaseComponent } from '../base/card-item-base.component';

@Component({
  selector: 'card-item-mobile',
  templateUrl: 'card-item-mobile.component.html',
  styleUrls: [
    'card-item-mobile.component.scss',
    '../base/card-item-base.component.scss'
  ],
  host: { 'app.card-item-mobile': 'true' }
})
export class CardItemMobileComponent extends CardItemBaseComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }

}