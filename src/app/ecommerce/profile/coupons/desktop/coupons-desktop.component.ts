import { Component, Injector, ViewChild } from '@angular/core';
import { InputValidateComponent } from '@geor360/ecommerce-components';
import { CouponsBaseComponent } from '../base/coupons-base.component';

; @Component({
  templateUrl: 'coupons-desktop.component.html',
  styleUrls: ['coupons-desktop.component.scss'],
  host: { 'app.coupons-desktop': 'true' }
})
export class CouponsDesktopComponent extends CouponsBaseComponent {

  @ViewChild('inputValidate') inputValidate!: InputValidateComponent;

  constructor(_injector: Injector) {
    super(_injector);
  }

  handleInputValue(value: string) {
    if (value === '123') {
      this.inputValidate.errorLabel = 'El código de cupón no existe';
    } else {
      this.inputValidate.errorLabel = '';
    }
  }

  navigateToCouponConditions() {
    this.navigation.forward('/app/ecommerce/profile/coupon-conditions');
  }

  navigateToBarProducts() {
    this.navigation.forward('/app/ecommerce/categories/bar-products', { path: '/profile/coupons' });
  }
}
