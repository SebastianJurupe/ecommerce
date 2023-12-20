import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CoreModule } from '@geor360/core';
import { ComponentsModule } from '@geor360/ecommerce-components';
import { IonicModule } from '@ionic/angular';
import { AddBillingBaseComponent, AddBillingDesktopComponent, AddBillingMobileComponent, AddBillingTabletComponent } from './add-billing';
import { AddCouponBaseComponent, AddCouponDesktopComponent, AddCouponMobileComponent, AddCouponTabletComponent } from './add-coupon';
import { CalendarBaseComponent, CalendarDesktopComponent, CalendarMobileComponent, CalendarTabletComponent } from './calendar';
import { CodeYapeComponent } from './code-yape/code-yape.component';
import { DeliveryRequirementsBaseComponent, DeliveryRequirementsDesktopComponent, DeliveryRequirementsMobileComponent, DeliveryRequirementsTabletComponent } from './delivery-requirements';
import { MyAddressesBaseComponent, MyAddressesDesktopComponent, MyAddressesMobileComponent, MyAddressesTabletComponent } from './my-addresses';
import { OrderReceiverBaseComponent, OrderReceiverDesktopComponent, OrderReceiverMobileComponent, OrderReceiverTabletComponent } from './order-receiver';
import { FormsModule } from '@angular/forms';
import { PayNotMadeBaseComponent, PayNotMadeDesktopComponent, PayNotMadeMobileComponent, PayNotMadeTabletComponent } from './pay-not-made';
import { PayDeclinedBaseComponent, PayDeclinedDesktopComponent, PayDeclinedMobileComponent, PayDeclinedTabletComponent } from './pay-declined';
import { DeleteProductComponent } from './delete-product/delete-product.component';
import { CouponDesktopComponent } from './coupon/coupon-desktop.component';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';
import { PipesModule } from '@shared/pipes/pipes.module';


@NgModule({
  imports: [
    IonicModule,
    CoreModule,
    CommonModule,
    ComponentsModule,
    FormsModule,
    PipesModule
  ],
  declarations: [
    AddBillingBaseComponent,
    AddBillingMobileComponent,
    AddBillingTabletComponent,
    AddBillingDesktopComponent,

    AddCouponBaseComponent,
    AddCouponMobileComponent,
    AddCouponTabletComponent,
    AddCouponDesktopComponent,

    CalendarBaseComponent,
    CalendarMobileComponent,
    CalendarTabletComponent,
    CalendarDesktopComponent,

    DeliveryRequirementsBaseComponent,
    DeliveryRequirementsMobileComponent,
    DeliveryRequirementsTabletComponent,
    DeliveryRequirementsDesktopComponent,
    DeleteProductComponent,

    MyAddressesBaseComponent,
    MyAddressesMobileComponent,
    MyAddressesTabletComponent,
    MyAddressesDesktopComponent,

    OrderReceiverBaseComponent,
    OrderReceiverMobileComponent,
    OrderReceiverTabletComponent,
    OrderReceiverDesktopComponent,

    PayNotMadeBaseComponent,
    PayNotMadeDesktopComponent,
    PayNotMadeMobileComponent,
    PayNotMadeTabletComponent,

    PayDeclinedBaseComponent,
    PayDeclinedDesktopComponent,
    PayDeclinedMobileComponent,
    PayDeclinedTabletComponent,

    CodeYapeComponent,

    CouponDesktopComponent,

    PaymentMethodsComponent,
    

  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ModalsModule { }
