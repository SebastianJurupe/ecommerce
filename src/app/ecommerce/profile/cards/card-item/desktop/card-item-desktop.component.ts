import { Component } from '@angular/core';
import { CardItemBaseComponent } from '../base/card-item-base.component';

@Component({
  selector: 'card-item-desktop',
  templateUrl: 'card-item-desktop.component.html',
  styleUrls: [
    'card-item-desktop.component.scss',
    '../base/card-item-base.component.scss'
  ],
  host: { 'app.card-item-desktop': 'true' }
})
export class CardItemDesktopComponent extends CardItemBaseComponent { }