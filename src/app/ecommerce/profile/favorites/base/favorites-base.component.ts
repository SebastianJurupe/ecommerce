import { Component, Injector, OnInit } from '@angular/core';
import { ApiException, AppTabService, ViewComponent } from '@geor360/core';
import { ViewWillEnter } from '@ionic/angular';
import { BasketServiceProxy } from '@shared/proxies/basket/basket.proxie.service';
import { MoveToBasketEmitter } from '../favorite-item';
import { FavoriteItem, FavoritesService } from '../favorites.service';

@Component({
  templateUrl: 'favorites-base.component.html',
  styleUrls: ['favorites-base.component.scss'],
  host: { 'app.favorites-base': 'true' }
})
export class FavoritesBaseComponent extends ViewComponent implements OnInit, ViewWillEnter {

  private _basketServiceProxy: BasketServiceProxy;
  private _favoritesService: FavoritesService;

  emptyFavorite: boolean = false;
  favoriteItems: FavoriteItem[] = [];
  loading: boolean = true;
  toolbar: AppTabService;

  constructor(_injector: Injector) {
    super(_injector);
    this._basketServiceProxy = _injector.get(BasketServiceProxy);
    this._favoritesService = _injector.get(FavoritesService);
    this.toolbar = _injector.get(AppTabService);
  }

  ngOnInit() {
    this.loading = true;
    this._favoritesService.getAll().then(() => {

      this._favoritesService.favorites$.subscribe((favorites) => {
        this.loading = false;
        this.favoriteItems = favorites;
        if (favorites.length == 0) {
          this.emptyFavorite = true;
        }
      });
    });
  }

  ionViewWillEnter() {
    this.toolbar.hide();
  }

  moveToBasket(response: MoveToBasketEmitter) {
    const { id, description } = response;
    const formattedDescription = description.replace(/\s+/g, '-');

    this.navigation.forwardNoAnimation('app/ecommerce/home/detail-product/' + id + '/' + formattedDescription);
    // this.dialog.showWithData({
    //   component: MoveToBasketComponent,
    //   cssClass: ['modal-custom', 'modal-custom--in-center-90']
    // }).then((res) => {
    //   if (res.data.result !== 'cancel') {
    //     const { id, hasVariants } = response;

    //     hasVariants
    //       ? this.handleProductHasVariants(id)
    //       : this.addProductToCart(id);
    //   }
    // });
  }

  addProductToCart(id: number) {
    this._basketServiceProxy.cartAddProduct(id, 1)
      .subscribe({
        next: () => {
          this._favoritesService.deleteById(id);
          const message = this.localization.localize('profile.favorites.succesfullyMovedToBasket', 'ecommerce');
          this.notify.success(message, 2500);
        },
        error: (err: ApiException) => this.message.exception(err)
      });
  }

  handleProductHasVariants(id: number, description: string) {
    this._favoritesService.deleteById(id);

    this.navigation.forward(`/app/ecommerce/home/detail-product/${id}`);
  }

  back() {
    this.navigation.back('/app/ecommerce/profile/home');
    this.toolbar.show();
  }
}