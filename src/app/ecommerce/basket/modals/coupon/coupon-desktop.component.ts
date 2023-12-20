import { Component, Injector, Input, ViewChild } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { InputValidateComponent } from '@geor360/ecommerce-components';
import { CouponsService } from 'src/app/ecommerce/profile/coupons/coupons.service';


@Component({
  templateUrl: 'coupon-desktop.component.html',
  styleUrls: ['coupon-desktop.component.scss'],
  host: { 'app.coupon-desktop': 'true' },

})
export class CouponDesktopComponent extends ViewComponent {
  private _couponsService: CouponsService

  @Input() coupon: any

  @ViewChild('inputValidate') inputValidate!: InputValidateComponent;

  coupons: any
  cuponesFiltered: any
  disabled: boolean = false
  loadingCoupons: boolean = true;

  constructor(_injector: Injector) {
    super(_injector);
    this._couponsService = _injector.get(CouponsService)
  }

  handleInputValue(value: any) {
    if (value === '123') {
      this.inputValidate.errorLabel = 'El código de cupón no existe';
    } else {
      this.inputValidate.errorLabel = '';
    }
  }

  ngOnInit() {
    this._couponsService.getAll().then(() => {
      this._couponsService.coupons$.subscribe((coupon) => {
        this.coupons = coupon
        this.loadingCoupons = false;
        this.cuponesFiltered = this.coupons.filter((coupon: any) => !coupon.used);
      });
    })
  }

  validateCoupon(item: any) {
    this.dialog.dismiss(item);
  }

  useLaterCoupon(item: any) {
    item = {}
    this.dialog.dismiss(item);
  }

  viewConditions() {
    // this.navigation.forward('/app/ecommerce/profile/coupon-conditions');
  }

  close() {
    this.dialog.dismiss('cancel');
  }
}
