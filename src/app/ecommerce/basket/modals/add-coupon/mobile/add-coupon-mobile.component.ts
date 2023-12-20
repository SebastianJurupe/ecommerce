import { Component, Injector, Input, ViewChild } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { InputValidateComponent } from '@geor360/ecommerce-components';
import { CouponsService } from 'src/app/ecommerce/profile/coupons/coupons.service';


@Component({
  templateUrl: 'add-coupon-mobile.component.html',
  styleUrls: ['add-coupon-mobile.component.scss'],
  host: { 'app.add-coupon-mobile': 'true' },
})
export class AddCouponMobileComponent extends ViewComponent {

  private _couponsService: CouponsService

  @ViewChild('inputValidate') inputValidate!: InputValidateComponent;

  @Input() coupon: any

  coupons: any
  disabled: boolean = false
  emptyCupons: boolean = false
  loading: boolean = true
  cuponesFiltered: any

  constructor(_injector: Injector) {
    super(_injector);
    this._couponsService = _injector.get(CouponsService)
  }

  handleInputValue(value: any) {
    if (value === '123') {
      this.inputValidate.errorLabel = 'El código de cupón no existe';
    } else {
      this.coupons = [
        { valor: 200, text: 'Feliz día de la madre, que los pases super', cod: 'SODIM123NOV2022', expiration: '30 nov 2022' },
        { valor: 180, text: 'Feliz día de la madre, que los pases super', cod: 'SODIM103DIC2022', expiration: '03 dic 2022' },
      ];
      this.inputValidate.errorLabel = '';
    }
  }

  ngOnInit() {
    this.cuponesFiltered = []
    this.loading = true
    this._couponsService.getAll().then(() => {
      this._couponsService.coupons$.subscribe((coupon) => {
        this.coupons = coupon
        this.cuponesFiltered = this.coupons.filter((coupon: any) => !coupon.used);
        this.loading = false
        if (this.cuponesFiltered.length == 0) {
          this.emptyCupons = true
        }
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