import { Component, Injector, ViewChild } from '@angular/core';
import { AppTabService, } from '@geor360/core';
import { InputValidateComponent } from '@geor360/ecommerce-components';
import { CouponsBaseComponent } from '../base/coupons-base.component';

@Component({
  templateUrl: 'coupons-mobile.component.html',
  styleUrls: ['coupons-mobile.component.scss'],
  host: { 'app.coupons-mobile': 'true' },

})
export class CouponsMobileComponent extends CouponsBaseComponent {

  private _toolbar: AppTabService;

  @ViewChild('inputValidate') inputValidate!: InputValidateComponent;


  constructor(_injector: Injector) {
    super(_injector);
    this._toolbar = _injector.get(AppTabService);
  }

  ionViewWillEnter() {
    this._toolbar.hide();
  }

  handleInputValue(value: string) {
    if (value === '123') {
      this.inputValidate.errorLabel = 'El código de cupón no existe';
    } else {
      this.coupons = [];
      this.inputValidate.errorLabel = '';
    }
  }

  navigateToCouponConditions() {
    this.navigation.forward('/app/ecommerce/profile/coupon-conditions');
  }

  navigateToBarProducts() {
    this.navigation.forward('/app/ecommerce/categories/bar-products', { path: '/profile/coupons' });
  }

  onBackButtonPressed() {
    this.navigation.back('/app/ecommerce/profile/home');
    this._toolbar.show();
  }
}