import { Component, Injector } from '@angular/core';
import { DeliveryRequirementsBaseComponent } from '../base/delivery-requirements-base.component';

@Component({
  templateUrl: 'delivery-requirements-desktop.component.html',
  styleUrls: ['delivery-requirements-desktop.component.scss'],
  host: { 'app.delivery-requirements-desktop': 'true' }
})
export class DeliveryRequirementsDesktopComponent extends DeliveryRequirementsBaseComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }

}