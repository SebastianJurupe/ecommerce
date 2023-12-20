import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { Address } from '../../services/address.service';

export interface AddressItemEmitterOptionClicked {
  id: number;
  event: MouseEvent;
}

@Component({
  templateUrl: 'address-item-base.component.html',
  styleUrls: ['address-item-base.component.scss'],
  host: { 'app.address-item-base': 'true' }
})
export class AddressItemBaseComponent extends ViewComponent {

  @Input() address!: Address;

  @Output() optionClicked: EventEmitter<AddressItemEmitterOptionClicked> = new EventEmitter();

  constructor(_injector: Injector) {
    super(_injector);
  }

  openPopover(event: MouseEvent) {
    this.optionClicked.emit({ id: this.address.id, event: event });
  }
}