import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { InvoiceItem, InvoiceItemEmitterOptionCliked } from '../mobile/invoice-item-mobile.component';

@Component({
  templateUrl: 'invoice-item-base.component.html',
  styleUrls: ['invoice-item-base.component.scss'],
  host: { 'app.invoice-item-base': 'true' }
})
export class InvoiceItemBaseComponent extends ViewComponent {

  @Input() invoice!: InvoiceItem;

  @Output() optionClicked: EventEmitter<InvoiceItemEmitterOptionCliked> = new EventEmitter();

  constructor(_injector: Injector) {
    super(_injector);
  }

  openPopover(id: number, event: MouseEvent, edit?: boolean) {
    this.optionClicked.emit({ id, event, edit });
  }
}