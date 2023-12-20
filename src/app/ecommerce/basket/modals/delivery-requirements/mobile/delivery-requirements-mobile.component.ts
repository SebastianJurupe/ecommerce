import { Component } from '@angular/core';
import { DeliveryRequirementsBaseComponent } from '../base/delivery-requirements-base.component';

@Component({
  templateUrl: 'delivery-requirements-mobile.component.html',
  styleUrls: ['delivery-requirements-mobile.component.scss'],
  host: { 'app.delivery-requirements-mobile': 'true' }
})
export class DeliveryRequirementsMobileComponent extends DeliveryRequirementsBaseComponent {

}
