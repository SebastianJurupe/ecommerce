import { Component, Injector, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewComponent } from '@geor360/core';
import { NavController } from '@ionic/angular';

@Component({
  templateUrl: 'terms-and-conditions-of-shipment-mobile.component.html',
  styleUrls: ['terms-and-conditions-of-shipment-mobile.component.scss']
})
export class TermsAndConditionsOfShipmentMobileComponent extends ViewComponent {

  @Input() usedAsModal: boolean = false;

  private _activatedRoute: ActivatedRoute;
  private _navController: NavController;

  constructor(_injector: Injector) {
    super(_injector);
    this._activatedRoute = _injector.get(ActivatedRoute);
    this._navController = _injector.get(NavController);
  }

  back() {
    this._activatedRoute;
    this._navController.back();
  }
}
