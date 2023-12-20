import { Component, Injector, ViewChild } from '@angular/core';
import { ApiException, AppTabService, ViewComponent } from '@geor360/core';
import { CardUtilsService } from '@shared/services/card-utils.service';
import { CardsService } from '../../cards.service';
import { CardServiceProxy } from '@shared/proxies/profile/card.proxie';
import { IonInput } from '@ionic/angular';
import { number } from 'card-validator';

@Component({
  templateUrl: 'add-card-base.component.html',
  styleUrls: ['add-card-base.component.scss'],
  host: { 'app.add-card-base': 'true' }
})
export class AddCardBaseComponent extends ViewComponent {

  private _cardUtilsService: CardUtilsService;
  private _cardsService: CardsService;
  private _cardServiceProxy: CardServiceProxy;
  private _toolbar: AppTabService;

  @ViewChild('cardNumberInput', { static: false }) cardNumberInput!: IonInput;

  card = { number: '', titular: '', expiration_date: '' };
  cardProviderImage: string = '';
  isLoading: boolean = false;

  isInvalidNumber: boolean = false;
  constructor(_injector: Injector) {
    super(_injector);
    this._cardUtilsService = _injector.get(CardUtilsService);
    this._cardsService = _injector.get(CardsService);
    this._cardServiceProxy = _injector.get(CardServiceProxy);
    this._toolbar = _injector.get(AppTabService);
  }
  ionViewWillEnter() {
    this._toolbar.hide();
  }

  ngAfterViewInit() {
    setTimeout(() => this.cardNumberInput.setFocus(), 700);
  }

  onCardNumberInput(event: any) {
    let inputValue = event.target.value;

    inputValue = inputValue.replace(/\D/g, '');

    let maskedVal = '';
    for (let i = 0; i < inputValue.length; i++) {
      if (i > 0 && i % 4 === 0) {
        maskedVal += ' ';
      }
      maskedVal += inputValue.charAt(i);
    }

    this.card.number = maskedVal;

    if (maskedVal.length === 19) {
      const { card, isValid, isPotentiallyValid } = number(maskedVal);

      if (card === null && (!isValid || !isPotentiallyValid)) {
        this.isInvalidNumber = true;
        this.cardProviderImage = '';
      } else {
        this.isInvalidNumber = false;
        this.cardProviderImage = this._cardUtilsService.getImageByProvider(card?.type ?? '');
      }
    }
  }

  onDateInput(event: any) {
    let value = event.target.value;
    value = value.replace(/[^0-9/]/g, '');
    if (value.length > 2 && value[2] !== '/') {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    event.target.value = value;
    this.card.expiration_date = value;
  }


  submit(): Promise<Boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      const { number, titular, expiration_date } = this.card;

      this.isLoading = true;

      this._cardServiceProxy.register(
        number.replace(/\s/g, ''),
        titular,
        expiration_date
      ).subscribe({
        next: async (res) => {
          if (res.success) {
            const loaded = await this._cardsService.getAll();

            if (loaded) {
              this.resetFormData();
              this.isLoading = false;
              resolve(true)
            }
          }
        },
        error: (err: ApiException) => {
          this.isLoading = false;
          this.message.exception(err);
          reject(false)
        }
      });
    })

  }

  resetFormData() {
    this.card = {
      number: '',
      titular: '',
      expiration_date: ''
    };
  }

  disableButton() {
    return this.card.number.length !== 19 ||
      this.isInvalidNumber ||
      this.isLoading;
  }
}