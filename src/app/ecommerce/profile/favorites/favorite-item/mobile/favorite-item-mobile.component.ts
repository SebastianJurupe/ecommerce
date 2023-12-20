// favorite-item.component.ts
import { Component } from '@angular/core';
import { FavoriteItemBaseComponent } from '../base/favorite-item-base.component';

@Component({
  selector: 'favorite-item-mobile',
  templateUrl: 'favorite-item-mobile.component.html',
  styleUrls: [
    'favorite-item-mobile.component.scss',
    '../base/favorite-item-base.component.scss'
  ],
  host: { 'app.favorite-item-mobile': 'true' }
})
export class FavoriteItemMobileComponent extends FavoriteItemBaseComponent { }
