import { Component } from '@angular/core';
import { OrderItemBaseComponent } from '../base/order-item-base.component';

@Component({
  selector: 'order-item-desktop',
  templateUrl: 'order-item-desktop.component.html',
  styleUrls: [
    'order-item-desktop.component.scss',
    '../base/order-item-base.component.scss'
  ],
  host: { 'app.order-item-desktop': 'true' }
})
export class OrderItemDesktopComponent extends OrderItemBaseComponent { }