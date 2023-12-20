import { Injectable } from '@angular/core';
import { agency, home, shop } from './data'
import { BehaviorSubject } from 'rxjs';

export type DeliveryType = 'agency' | 'home' | 'shop';

@Injectable({
  providedIn: 'root'
})
export class DeliveryTypeService {

  delivery$: BehaviorSubject<object | null> = new BehaviorSubject<object | null>(null);

  setDelivery(type: DeliveryType) {
    switch (type) {

      case 'agency':
        this.delivery$.next(agency)
        break;

      case 'home':
        this.delivery$.next(home)
        break;

      case 'shop':
        this.delivery$.next(shop)
        break;

      default:
        this.delivery$.next(home)
        break;
    }
  }

  getDelivery() {
    return this.delivery$;
  }
}
