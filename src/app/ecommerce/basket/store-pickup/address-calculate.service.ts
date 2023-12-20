import { Injectable, Injector } from '@angular/core';
import { AddressServiceProxy } from '@shared/proxies/profile/address.proxie';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Address {
  id: number;
  description: string;
  country: string;
  extra: Extra[];
  postal_code: string;
  default: boolean;
  address: string;
}

export interface Extra {
  national_division: string;
  value: string;
  ubigeo: string;
}

interface ManageData {
  set(value: string): void;
  get(): Observable<any>;
}

@Injectable({
  providedIn: 'root'
})
export class AddressCalculateService implements ManageData {

  private _addressServiceProxy: AddressServiceProxy;

  address$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  addresses$: BehaviorSubject<Address[]> = new BehaviorSubject<Address[]>([]);
  selectedAddress$ = new BehaviorSubject<{ id: number, address: string; }>({ id: 0, address: "" });
  isLoading: boolean = false;

  constructor(_injector: Injector) {
    this._addressServiceProxy = _injector.get(AddressServiceProxy);
  }

  set(address: string): void {
    this.address$.next(address);
  }

  get(): Observable<any> {
    return this.address$;
  }

  getAll(): Promise<boolean> {
    this.isLoading = true;
    return new Promise<boolean>((resolve, reject) => {
      this._addressServiceProxy.getAll()
        .subscribe({
          next: (res) => {
            this.isLoading = false;
            this.addresses$.next(res.data);
            resolve(true);
          },
          error: (err) => {
            this.isLoading = false;
            reject(false);
            throw new Error(err);
          },
        });
    });
  }

  getDefault(): Promise<Address> {
    return new Promise(async (resolve, reject) => {
      this.addresses$.subscribe({
        next: (addresses) => {
          const defaultAddress = addresses.find((address) => address.default === true);
          if (defaultAddress) {
            resolve(defaultAddress);
          } else {
            resolve({
              address: '',
              country: '',
              default: false,
              description: '',
              extra: [],
              id: 0,
              postal_code: ''
            });
          }
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  getById(id: number): Promise<Address> {

    return new Promise<Address>((resolve, reject) => {

      const addresses = this.addresses$.getValue();
      const address = addresses.filter((address) => address.id === id)[0];

      if (address !== undefined) {
        resolve(address);
        return;
      } else {
        reject(undefined);
      }

    });

  }

  deleteById(id: number): Promise<boolean> {

    const addresses = this.addresses$.getValue();
    const filteredAddresses = addresses.filter((address) => address.id !== id);
    this.addresses$.next(filteredAddresses);

    return new Promise<boolean>((resolve, reject) => {
      this._addressServiceProxy.delete(id)
        .subscribe({
          next: () => { resolve(true); },
          error: (err) => {
            reject(false);
            throw new Error(err);
          },
        });
    });
  }

  setSelectedAddress(id: number, address: string) {
    const selectedAddress = { id, address };
    this.selectedAddress$.next(selectedAddress);
  }

}
