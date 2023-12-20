import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { FavoriteItem, FavoritesService } from '../../favorites.service';

export interface MoveToBasketEmitter {
  id: number;
  hasVariants: boolean;
  description: string
}

@Component({
  templateUrl: 'favorite-item-base.component.html',
  styleUrls: ['favorite-item-base.component.scss'],
  host: { 'app.favorite-item-base': 'true' }
})
export class FavoriteItemBaseComponent extends ViewComponent {

  private _favoritesService: FavoritesService;

  @Input() favoriteItem!: FavoriteItem;

  @Output() moveToBasket: EventEmitter<MoveToBasketEmitter> = new EventEmitter<MoveToBasketEmitter>();

  constructor(_injector: Injector) {
    super(_injector);
    this._favoritesService = _injector.get(FavoritesService);
  }

  async removeFromFavoritesClicked() {
    try {
      const deleted = await this._favoritesService.deleteById(this.favoriteItem.id);

      if (deleted) {
        const message = this.localization.localize('profile.favorites.succesfullyDeleted', 'ecommerce');
        this.notify.success(message, 2500);
      }
    } catch (error) {
      console.error(error);
    }
  }

  moveToBasketClicked() {
    this.moveToBasket.emit({
      id: this.favoriteItem.id,
      hasVariants: this.favoriteItem.has_variants,
      description: this.favoriteItem.description
    });
  }
}