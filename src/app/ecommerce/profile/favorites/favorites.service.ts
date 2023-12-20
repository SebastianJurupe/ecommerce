import { Injectable, Injector } from '@angular/core';
import { ServiceCrudAdapter } from '@shared/adapters/service-crud.adapter';
import { FavoriteServiceProxy } from '@shared/proxies/profile/favorites.proxie';
import { BehaviorSubject } from 'rxjs';

export interface FavoriteItem {
  id: number;
  description: string;
  sale_unit_price: number;
  currency: Currency;
  cover: Cover | null;
  has_variants: boolean;
}

interface Cover {
  id: number;
  description: null;
  is_cover: boolean;
  path: string;
}

interface Currency {
  id: string;
  description: string;
  symbol: string;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService implements ServiceCrudAdapter {

  private _favoriteServiceProxy: FavoriteServiceProxy;

  favorites$: BehaviorSubject<FavoriteItem[]> = new BehaviorSubject<FavoriteItem[]>([]);

  constructor(_injector: Injector) {
    this._favoriteServiceProxy = _injector.get(FavoriteServiceProxy);
  }

  getAll(): Promise<boolean> {

    return new Promise<boolean>((resolve, reject) => {
      this._favoriteServiceProxy.getAll()
        .subscribe({
          next: (response) => {
            this.favorites$.next(response.data);
            resolve(true);
          },
          error: (err) => {
            reject(false);
            throw new Error(err);
          },
        });
    });
  }

  getById(id: number): FavoriteItem {
    const favorites = this.favorites$.getValue();

    const favorite = favorites.filter((favorite) => favorite.id === id)[0];
    return favorite as FavoriteItem;
  }

  deleteById(id: number): Promise<boolean> {

    const favorites = this.favorites$.getValue();
    const filteredFavorites = favorites.filter((favorite) => favorite.id !== id);
    this.favorites$.next(filteredFavorites);

    return new Promise<boolean>((resolve, reject) => {
      this._favoriteServiceProxy.delete(id)
        .subscribe({
          next: () => {
            resolve(true);
          },
          error: (err) => {
            reject(false);
            throw new Error(err);
          }
        });
    });
  }

}
