import { Injectable, Injector } from '@angular/core';
import { BasketServiceProxy, CartGetCouponsAvaliblesOutputDataDto } from '@shared/proxies/basket/basket.proxie.service';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CouponsService {

  private _baskquetServiceProxy: BasketServiceProxy;

  coupons$: BehaviorSubject<CartGetCouponsAvaliblesOutputDataDto[]> = new BehaviorSubject<CartGetCouponsAvaliblesOutputDataDto[]>([]);

  constructor(_injector: Injector) {
    this._baskquetServiceProxy = _injector.get(BasketServiceProxy);
  }

  getAll(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this._baskquetServiceProxy.getCouponsAvalibles()
        .subscribe({
          next: (response) => {
            this.coupons$.next(response.data)
            resolve(true);
          },
          error: (err) => {
            reject(false);
            throw new Error(err);
          },
        });
    });
  }





}
