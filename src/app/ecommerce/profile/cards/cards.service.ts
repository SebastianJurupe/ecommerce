import { Injectable, Injector } from '@angular/core';
import { CardServiceProxy } from '@shared/proxies/profile/card.proxie';
import { BehaviorSubject } from 'rxjs';

export interface Card {
  id: number;
  number: string;
  titular: string;
  expiration_date: string;
}

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  private _cardServiceProxy: CardServiceProxy;

  cards$: BehaviorSubject<Card[]> = new BehaviorSubject<Card[]>([]);

  constructor(_injector: Injector) {
    this._cardServiceProxy = _injector.get(CardServiceProxy);
  }

  getAll(): Promise<boolean> {

    return new Promise<boolean>((resolve, reject) => {
      this._cardServiceProxy.getAll()
        .subscribe({
          next: (res) => {
            this.cards$.next(res.data);
            resolve(true);
          },
          error: (err) => {
            reject(false);
            throw new Error(err);
          },
        });
    });
  }

  getById(id: number): Promise<Card> {

    return new Promise<Card>((resolve, reject) => {
      const cards = this.cards$.getValue();
      const card = cards.filter((card) => card.id === id)[0];

      if (card !== undefined) {
        resolve(card);
      } else {
        reject(undefined);
      }
    });
  }

  deleteById(id: number): Promise<boolean> {

    const cards = this.cards$.getValue();
    const filteredCards = cards.filter((card) => card.id !== id);
    this.cards$.next(filteredCards);

    return new Promise<boolean>((resolve, reject) => {
      this._cardServiceProxy.delete(id)
        .subscribe({
          next: () => {
            resolve(true);
          },
          error: (err: any) => {
            reject(false);
            throw new Error(err);
          },
        });
    });
  }
}
