import { Component } from '@angular/core';
import { OrderItemBaseComponent } from '../base/order-item-base.component';

@Component({
  selector: 'order-item-mobile',
  templateUrl: 'order-item-mobile.component.html',
  styleUrls: [
    'order-item-mobile.component.scss',
    '../base/order-item-base.component.scss'
  ]
})
export class OrderItemMobileComponent extends OrderItemBaseComponent {
}
