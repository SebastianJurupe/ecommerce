import { Component, Injector, Input } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { PopoverController } from '@ionic/angular';

export interface OrderStatus {
  id: string;
  label: string;
  sublabel: string;
  class: string;
  span: Span;
}

export interface Span {
  span1: string;
  span2: string;
  span3: string;
  span4: string;
}

@Component({
  templateUrl: 'options-order-popover.component.html',
  styleUrls: ['options-order-popover.component.scss'],
  host: { 'app.options-order-popover': 'true' }
})
export class OptionsOrderPopoverComponent extends ViewComponent {

  @Input() status!: OrderStatus;

  private _popoverController: PopoverController;

  constructor(_injector: Injector) {
    super(_injector);
    this._popoverController = _injector.get(PopoverController);
  }

  selectOption(option: 'edit' | 'share' | 'override') {
    this._popoverController.dismiss(option);
  }
}
