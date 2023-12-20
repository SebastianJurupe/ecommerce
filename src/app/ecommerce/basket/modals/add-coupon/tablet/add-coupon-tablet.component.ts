import { Component, Injector, ViewChild } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { InputValidateComponent } from '@geor360/ecommerce-components';

@Component({
  templateUrl: 'add-coupon-tablet.component.html',
  styleUrls: ['add-coupon-tablet.component.scss'],
  host: { 'app.add-coupon-tablet': 'true' }
})
export class AddCouponTabletComponent extends ViewComponent {

  @ViewChild('inputValidate') inputValidate!: InputValidateComponent;

  coupons = [
    { valor: 200, text: 'Feliz día de la madre, que los pases super', cod: 'SODIM123NOV2022', expiration: '30 nov 2022' },
    { valor: 180, text: 'Feliz día de la madre, que los pases super', cod: 'SODIM103DIC2022', expiration: '03 dic 2022' },
  ];

  constructor(_injector: Injector) {
    super(_injector);
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

  validateCoupon(item: any) {
    this.dialog.dismiss(item);
  }

  viewConditions() {
    // this.navigation.forward('/app/ecommerce/profile/coupon-conditions');
  }

  close() {
    this.dialog.dismiss('cancel');
  }
}
