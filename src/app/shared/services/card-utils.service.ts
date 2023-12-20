import { Injectable, Injector } from '@angular/core';
import { AppLocalizationService } from '@geor360/core';

enum CardProvider {
  VISA = 'visa',
  MASTERCARD = 'mastercard',
  AMERICAN_EXPRESS = 'american-express',
  DISCOVER = 'discover',
  JBC = 'jbc',
  MAESTRO = 'maestro',
  NOT_FOUND = 'not-found',
}

@Injectable({
  providedIn: 'root'
})
export class CardUtilsService {

  private _appLocalizationService: AppLocalizationService;

  constructor(_injector: Injector) {
    this._appLocalizationService = _injector.get(AppLocalizationService);
  }

  isValid(card: string): boolean {
    card = card.replace(/\D/g, '');

    let sum = 0;

    for (let i = 0; i < card.length; i++) {
      let cardNum = parseInt(card[i]);

      if ((card.length - i) % 2 === 0) {
        cardNum *= 2;

        if (cardNum > 9) {
          cardNum -= 9;
        }
      }
      sum += cardNum;
    }

    return sum % 10 === 0;
  }

  getProvider(card: string): CardProvider {
    card = card.replace(/\D/g, '');

    const cardsProviders = [
      {
        name: 'visa',
        pattern: /^4/,
      },
      {
        name: 'mastercard',
        pattern: /^5[1-5]/,
      },
      {
        name: 'american-express',
        pattern: /^3[47]/,
      },
      {
        name: 'discover',
        pattern: /^6(?:011|5)/,
      },
      {
        name: 'jbc',
        pattern: /^(?:2131|1800|35\d{3})/,
      },
      {
        name: 'maestro',
        pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
      },
    ];

    for (const cardType of cardsProviders) {
      if (card.match(cardType.pattern)) {
        return cardType.name as CardProvider;
      }
    }

    return CardProvider.NOT_FOUND;
  }

  getImageByProvider(type: string) {
    switch (type) {
      case 'visa':
        return 'icon icon--logo-visa';
      case 'mastercard':
        return 'icon icon--logo-mastercard';
      case 'american-express':
        return 'icon icon--logo-amex';
      case 'dinners-club':
        return 'icon icon--logo-dinners-club';
      default:
        return 'icon icon--credit-card';
    }
  }

  determineCardType(cardNumber: string): string {
    cardNumber = cardNumber.replace(/\s+/g, '').replace(/-/g, '');

    const debitCardPatterns: RegExp[] = [/^4/, /^5[1-5]/];
    const creditCardPatterns: RegExp[] = [/^3[47]/, /^6/];

    for (const pattern of debitCardPatterns) {
      if (pattern.test(cardNumber)) {
        return this._appLocalizationService.localize('general.debit', 'ecommerce');
      }
    }

    for (const pattern of creditCardPatterns) {
      if (pattern.test(cardNumber)) {
        return this._appLocalizationService.localize('general.credit', 'ecommerce');
      }
    }

    return this._appLocalizationService.localize('general.unknown', 'ecommerce');
  }

}
