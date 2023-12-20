import { Component, Injector } from '@angular/core';
import { HeaderDesktopService } from '@shared/services/header-desktop.service';
import { TermsAndConditionsOfShipmentMobileComponent } from '../mobile/terms-and-conditions-of-shipment-mobile.component';

@Component({
  templateUrl: 'terms-and-conditions-of-shipment-desktop.component.html',
  styleUrls: ['terms-and-conditions-of-shipment-desktop.component.scss'],
  host: { 'app.terms-and-conditions-of-shipment-desktop': 'true' }
})
export class TermsAndConditionsOfShipmentDesktopComponent extends TermsAndConditionsOfShipmentMobileComponent {

  headerDesktopService: HeaderDesktopService;

  constructor(_injector: Injector) {
    super(_injector);
    this.headerDesktopService = _injector.get(HeaderDesktopService);
  }

  brandButtonEventCliked() {
    this.navigation.backNoAnimation('/app/ecommerce/home/home');
  }

  inboxClick() {
    // this.navigation.forwardNoAnimation('/app/ecommerce/inbox');
  }
}