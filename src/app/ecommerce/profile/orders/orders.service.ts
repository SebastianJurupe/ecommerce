import { Injectable, Injector } from '@angular/core';
import { ProfileServiceProxy } from '@shared/proxies/profile/profile.proxies';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private _profileServiceProxy: ProfileServiceProxy;

  counter$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(_injector: Injector) {
    this._profileServiceProxy = _injector.get(ProfileServiceProxy);
  }

  setCounter() {
    this._profileServiceProxy.getPersonalInformation()
      .subscribe(res => {
        this.counter$.next(res.data.orders)
      });
  }

  addCounter() {
    this.counter$.next(this.counter$.value + 1);
  }
}
