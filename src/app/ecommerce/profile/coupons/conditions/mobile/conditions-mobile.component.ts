import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'conditions-mobile.component.html',
  styleUrls: ['conditions-mobile.component.scss'],
  host: { 'app.conditions-mobile': 'true' }
})
export class ConditionsMobileComponent extends ViewComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }

  onBackButtonPressed() {
    this.navigation.back('/app/ecommerce/profile/coupons');
  }
}