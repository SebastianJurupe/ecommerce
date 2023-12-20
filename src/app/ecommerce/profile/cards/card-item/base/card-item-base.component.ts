import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { CardUtilsService } from '@shared/services/card-utils.service';
import { Card } from '../../cards.service';
import { number } from 'card-validator';

@Component({
  templateUrl: 'card-item-base.component.html',
  styleUrls: ['card-item-base.component.scss'],
  host: { 'app.card-item-base': 'true' }
})
export class CardItemBaseComponent extends ViewComponent implements OnInit {

  private _cardUtilsService: CardUtilsService;

  @Input() card!: Card;

  @Output() deleteCard: EventEmitter<number> = new EventEmitter<number>();

  classCardProvider: string = '';
  description: string = '';

  constructor(_injector: Injector) {
    super(_injector);
    this._cardUtilsService = _injector.get(CardUtilsService);
  }

  ngOnInit() {
    const res = number(this.card.number);

    this.classCardProvider = this._cardUtilsService.getImageByProvider(res?.card?.type ?? '');
    const provider = res?.card?.type ?? this.localization.localize('general.card', 'ecommerce');

    this.description = `${provider} **** ${this.card.number.slice(-4)}`;
  }

  deleteCardClicked() {
    this.deleteCard.emit(this.card.id);
  }
}