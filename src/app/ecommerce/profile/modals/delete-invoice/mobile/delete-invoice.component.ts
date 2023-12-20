import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'delete-invoice.component.html',
  styleUrls: ['delete-invoice.component.scss'],
  host: { 'app.delete-invoice': 'true' }
})
export class DeleteInvoiceComponent extends ViewComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }
}