import { Component, Injector, Input } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { PopoverController } from '@ionic/angular';


@Component({
  templateUrl: 'order-status-popover.component.html',
  styleUrls: ['order-status-popover.component.scss'],
  host: { 'app.order-status-popover': 'true' }
})
export class OrderStatusPopoverComponent extends ViewComponent {

  private _popoverController: PopoverController;

  @Input() status: string = 'ALL';

  options = [
    {
      id: 'ALL',
      name: this.localization.localize('profile.orderStatusPopover.all', 'ecommerce'),
    },
    {
      id: 'EN CAMINO',
      name: this.localization.localize('profile.orderStatusPopover.inWay', 'ecommerce'),
    },
    {
      id: 'EN PREPARACIÓN',
      name: this.localization.localize('profile.orderStatusPopover.preparation', 'ecommerce'),
    },
    {
      id: 'ENTREGADO',
      name: this.localization.localize('profile.orderStatusPopover.delivered', 'ecommerce'),
    },
    {
      id: 'ANULADO',
      name: this.localization.localize('profile.orderStatusPopover.cancelled', 'ecommerce'),
    }
  ];

  constructor(_injector: Injector) {
    super(_injector);
    this._popoverController = _injector.get(PopoverController);
  }

  filterBy(id: string) {
    this._popoverController.dismiss(id);
  }

}