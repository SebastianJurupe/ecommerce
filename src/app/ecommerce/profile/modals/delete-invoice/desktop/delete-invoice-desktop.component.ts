import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'delete-invoice-desktop.component.html',
  styleUrls: ['delete-invoice-desktop.component.scss'],
  host: { 'app.delete-invoice-desktop': 'true' }
})
export class DeleteInvoiceDesktopComponent extends ViewComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }
}