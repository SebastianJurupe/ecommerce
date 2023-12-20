import { Component } from '@angular/core';
import { FavoriteItemBaseComponent } from '../base/favorite-item-base.component';

@Component({
  selector: 'favorite-item-desktop',
  templateUrl: 'favorite-item-desktop.component.html',
  styleUrls: [
    'favorite-item-desktop.component.scss',
    './../base/favorite-item-base.component.scss'
  ],
  host: { 'app.favorite-item-desktop': 'true' }
})

export class FavoriteItemDesktopComponent extends FavoriteItemBaseComponent { }
