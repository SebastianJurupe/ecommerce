import { Injectable, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { BasketServiceProxy, CartGetDataDto } from '@shared/proxies/basket/basket.proxie.service';
import { BehaviorSubject, Observable, map } from 'rxjs';


export interface basketProduct {
  id: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class BasketService extends ViewComponent {
  private _basketServiceProxy: BasketServiceProxy;
  _myBasket$: BehaviorSubject<CartGetDataDto>;
  private _basket: CartGetDataDto = {
    code: '',
    status: '',
    payment_method: '',
    quantity: 0,
    subtotal: 0,
    total_taxes: 0,
    discounts: 0,
    total: 0,
    items: []
  };

  basketProducts: basketProduct[] = [];
  basketCode: string = '';

  constructor(_injector: Injector) {
    super(_injector);
    this._basketServiceProxy = _injector.get(BasketServiceProxy);
    this._myBasket$ = new BehaviorSubject<CartGetDataDto>({
      code: '',
      status: '',
      payment_method: '',
      quantity: 0,
      subtotal: 0,
      total_taxes: 0,
      discounts: 0,
      total: 0,
      items: []
    });
    this.getBasket();
  }

  getBasketCode(): Promise<string> {
    if (this.basketCode === '') {
      this._basketServiceProxy.getCart().subscribe(
        (response) => {
          this.basketCode = response.data.code;
          return Promise.resolve(this.basketCode);
        }
      );
    } else {
      return Promise.resolve(this.basketCode);
    }
    return Promise.resolve(this.basketCode);
  }

  removeItemOfBasket(idItem: number): Promise<boolean> {
    this._basketServiceProxy.getCart().subscribe({
      next: (response) => {
        const basket = response.data;
        const productInBasket = basket.items.filter((item) => item.item.id === idItem);
        if (productInBasket.length > 0) {
          const idOfProductInBasket = productInBasket[0].id;
          this._basketServiceProxy.cartDeleteProduct(this.basketCode, idOfProductInBasket).subscribe(
            () => {
              return (true);
            },
            () => { return (false); }
          );
          return Promise.resolve(true);
        }
        return Promise.resolve(true);
      },
      error: () => {
        return Promise.resolve(false);
      }
    });
    return Promise.resolve(false);
  }

  deleteProductInBasket(idItem: number) {
    this._basketServiceProxy.cartDeleteProduct(this.basketCode, idItem)
      .subscribe({
        next: () => {
          //this.notify.success('Producto eliminado de la cesta', 1500);
          this.getBasket();
        },
        error: () => {
          this.notify.error('Error al eliminar', 1500);
        }
      });
  }

  getUserBasket() {
    return this._basket;
  }

  getBasket() {
    this._basketServiceProxy.getCart().subscribe({
      next: (response) => {
        if (response.data === null) {
          this._basket.quantity = 0;
          this._basket.items = []
          this._basket.total = 0;

          this.setBasket(this._basket);
          this.getCount();
          return;
        }

        const basket: CartGetDataDto = response.data;
        this._basket = basket;
        this.basketCode = basket.code;
        this.setBasket(basket);
        this.getCount();
      },
      error: () => {
        return Promise.resolve(false);
      }
    });
  }

  getIdInBasket(productId: number) {
    const indexInBasket = this._basket.items.findIndex(item => item.item.id == productId);
    if (indexInBasket == -1) {
      return -1;
    } else {
      return this._basket.items[indexInBasket].id;
    }
  }

  getCount(): Observable<number> {
    return this._myBasket$.pipe(
      map((shoppingCart) => {
        return shoppingCart.quantity;
      })
    );
  }

  getTotalItems() {
    return this._basket.quantity;
  }

  private setBasket(basket: CartGetDataDto) {
    this._myBasket$.next(basket);
  }

  getQuantityProduct(id: number) {
    const productIndex = this.basketProducts.findIndex(item => item.id === id);
    if (productIndex === -1) {
      return 0;
    } else {
      return this.basketProducts[productIndex].quantity;
    }
  }

  addQuantityProduct(id: number, quantity: number) {
    const productIndex = this.basketProducts.findIndex(item => item.id === id);
    if (productIndex === -1) {
      this.basketProducts.push({
        id: id,
        quantity: quantity
      });
    } else {
      this.basketProducts[productIndex].quantity = this.basketProducts[productIndex].quantity + quantity;
    }

  }

  subQuantityProduct(id: number, quantity: number) {

    const productIndex = this.basketProducts.findIndex(item => item.id === id);

    if (productIndex === -1) {
      this.basketProducts.push({
        id: id,
        quantity: quantity
      });
    } else {
      this.basketProducts[productIndex].quantity = this.basketProducts[productIndex].quantity - quantity;
    }

  }

  // updateQuantityProduct(id: number, quantity: number){

  //   const productIndex = this.basketProducts.findIndex(item => item.id === id);

  //   if(productIndex === -1){
  //     this.basketProducts.push({
  //       id: id,
  //       quantity: quantity
  //      })
  //   } else {
  //     this.basketProducts[productIndex].quantity = quantity;
  //   }

  // }

  async updateQuantityProduct(id: number, quantity: number, _showUpdatedMessage: boolean = true): Promise<any> {
    return new Promise((resolve) => {
      this._basketServiceProxy.cartAddProduct(id, quantity).subscribe(
        () => {

          this.getBasket();
          return resolve(true);
        },
        () => {
          return resolve(false);
        },
      );
    });
  }

  deconsteProduct(id: number) {
    const productIndex = this.basketProducts.findIndex(item => item.id === id);
    if (productIndex !== -1) {
      this.basketProducts.splice(productIndex, 1);
    }

  }

  resetBasket() {
    this._basket.quantity = 0;
    this._basket.items = []
    this._basket.total = 0;
    this._basket.code = '';
    this.setBasket(this._basket);
    this.getCount();
  }
}
