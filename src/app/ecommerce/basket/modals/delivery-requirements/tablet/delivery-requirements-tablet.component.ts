import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'delivery-requirements-tablet.component.html',
  styleUrls: ['delivery-requirements-tablet.component.scss'],
  host: { 'app.delivery-requirements-tablet': 'true' }
})
export class DeliveryRequirementsTabletComponent extends ViewComponent {

  textAreaContent: string = '';

  constructor(_injector: Injector) {
    super(_injector);
  }

  save() {
    this.dialog.dismiss("Traer la factura impresa, guia de remision, SCTR, SOAT");
  }

  close() {
    this.dialog.dismiss('cancel');
  }

  textAreaContentIsValid(): boolean {
    return this.textAreaContent.trim() !== '';
  }
}
