import { Component, Injector } from '@angular/core';
import { InvoiceItemBaseComponent } from '../base/invoice-item-base.component';

export interface InvoiceItemEmitterOptionCliked {
  id: number;
  event: MouseEvent;
  edit?: boolean
}
export interface InvoiceItem {
  id: number;
  business_name: string;
  tax_identifier: string;
  fiscal_address: string;
  default: boolean;
}

@Component({
  selector: 'invoice-item-mobile',
  templateUrl: 'invoice-item-mobile.component.html',
  styleUrls: ['invoice-item-mobile.component.scss'],
  host: { 'app.invoice-item-mobile': 'true' }
})
export class InvoiceItemMobileComponent extends InvoiceItemBaseComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }


}