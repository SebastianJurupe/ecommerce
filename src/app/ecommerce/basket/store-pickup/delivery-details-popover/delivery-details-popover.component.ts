import { Component, Injector, Input } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { PopoverController } from '@ionic/angular';

export interface DeliveryTypeOption {
  id: string;
  label: string;
  setBackground: boolean;
  classIconButton: string;
  setArrow: boolean;
  type: 'DOMICILIO' | 'AGENCIA' | 'TIENDA';
  shapeType: 'success' | 'error' | 'info';
  shapeIconBackground: string;
}

@Component({
  templateUrl: 'delivery-details-popover.component.html',
  styleUrls: ['delivery-details-popover.component.scss'],
  host: { 'app.delivery-details-popover': 'true' }
})
export class DeliveryDetailsPopoverComponent extends ViewComponent {

  private _popoverController: PopoverController;

  @Input() deliveryTypeId: string = '01';

  options: DeliveryTypeOption[] = [
    {
      id: '01',
      label: this.localization.localize('basket.deliveryDetailsPopover.labelHome', 'ecommerce'),
      setBackground: true,
      classIconButton: 'icon icon--location icon--success',
      setArrow: false,
      type: 'DOMICILIO',
      shapeIconBackground: 'rectangle',
      shapeType: 'success',
    },
    {
      id: '02',
      label: this.localization.localize('basket.deliveryDetailsPopover.labelAgency', 'ecommerce'),
      setBackground: true,
      classIconButton: 'icon icon--truck icon--error',
      setArrow: false,
      type: 'AGENCIA',
      shapeIconBackground: 'rectangle',
      shapeType: 'error',
    },
    {
      id: '03',
      label: this.localization.localize('basket.deliveryDetailsPopover.labelShop', 'ecommerce'),
      setBackground: true,
      classIconButton: 'icon icon--store icon--info',
      setArrow: false,
      type: 'TIENDA',
      shapeIconBackground: 'rectangle',
      shapeType: 'info',
    },
  ];

  constructor(_injector: Injector) {
    super(_injector);
    this._popoverController = _injector.get(PopoverController);
  }

  viewElement(option: DeliveryTypeOption) {
    this._popoverController.dismiss(option);
  }
}
