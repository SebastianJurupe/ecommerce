import { Component, Injector } from '@angular/core';
import { InvoiceItemBaseComponent } from '../base/invoice-item-base.component';

@Component({
  selector: 'invoice-item-desktop',
  templateUrl: 'invoice-item-desktop.component.html',
  styleUrls: ['invoice-item-desktop.component.scss'],
  host: { 'app.invoice-item-desktop': 'true' }
})
export class InvoiceItemDesktopComponent extends InvoiceItemBaseComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() {
  }
}