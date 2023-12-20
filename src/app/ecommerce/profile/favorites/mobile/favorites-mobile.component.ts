import { Component } from '@angular/core';
import { FavoritesBaseComponent } from '../base/favorites-base.component';

@Component({
  templateUrl: 'favorites-mobile.component.html',
  styleUrls: ['favorites-mobile.component.scss'],
  host: { 'app.favorites-mobile': 'true' }
})
export class FavoritesMobileComponent extends FavoritesBaseComponent {}