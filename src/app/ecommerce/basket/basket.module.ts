import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '@geor360/core';
import { ComponentsModule } from '@geor360/ecommerce-components';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@shared/shared.module';
import { BasketRoutingModule } from './basket-routing.module';
import { DepositPaymentBaseComponent, DepositPaymentDesktopComponent, DepositPaymentMobileComponent, DepositPaymentTabletComponent } from './deposit-payment';
import { HomeBaseComponent, HomeDesktopComponent, HomeMobileComponent, HomeTabletComponent } from './home';
import { ModalsModule } from './modals/modals.module';
import { NewCardPaymentBaseComponent, NewCardPaymentDesktopComponent, NewCardPaymentMobileComponent, NewCardPaymentTabletComponent } from './new-card-payment';
import { PaymentMethodsBaseComponent, PaymentMethodsDesktopComponent, PaymentMethodsMobileComponent, PaymentMethodsTabletComponent } from './payment-methods';
import { PaymentcashBaseComponent, PaymentcashDesktopComponent, PaymentcashMobileComponent, PaymentcashTabletComponent } from './paymentcash';
import { SavedCardPaymentBaseComponent, SavedCardPaymentDesktopComponent, SavedCardPaymentMobileComponent, SavedCardPaymentTabletComponent } from './saved-card-payment';
import { StorePickupBaseComponent, StorePickupDesktopComponent, StorePickupMobileComponent, StorePickupTabletComponent } from './store-pickup';
import { DeliveryDetailsPopoverComponent } from './store-pickup/delivery-details-popover/delivery-details-popover.component';
import { SuccessPaymentBaseComponent, SuccessPaymentDesktopComponent, SuccessPaymentMobileComponent, SuccessPaymentTabletComponent } from './success-payment';
import { VoucherBaseComponent, VoucherDesktopComponent, VoucherMobileComponent, VoucherTabletComponent } from './voucher';
import { YapePaymentBaseComponent, YapePaymentDesktopComponent, YapePaymentMobileComponent, YapePaymentTabletComponent } from './yape-payment';

@NgModule({
  imports: [
    BasketRoutingModule,
    CommonModule,
    ComponentsModule,
    CoreModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ModalsModule
  ],
  declarations: [
    HomeBaseComponent,
    HomeMobileComponent,
    HomeTabletComponent,
    HomeDesktopComponent,

    StorePickupBaseComponent,
    StorePickupMobileComponent,
    StorePickupTabletComponent,
    StorePickupDesktopComponent,

    // ShippingOptionsComponent, //!!! CHECK

    PaymentMethodsBaseComponent,
    PaymentMethodsMobileComponent,
    PaymentMethodsTabletComponent,
    PaymentMethodsDesktopComponent,

    SavedCardPaymentBaseComponent,
    SavedCardPaymentMobileComponent,
    SavedCardPaymentTabletComponent,
    SavedCardPaymentDesktopComponent,

    NewCardPaymentBaseComponent,
    NewCardPaymentMobileComponent,
    NewCardPaymentTabletComponent,
    NewCardPaymentDesktopComponent,

    DepositPaymentBaseComponent,
    DepositPaymentMobileComponent,
    DepositPaymentTabletComponent,
    DepositPaymentDesktopComponent,

    YapePaymentBaseComponent,
    YapePaymentMobileComponent,
    YapePaymentTabletComponent,
    YapePaymentDesktopComponent,

    PaymentcashBaseComponent,
    PaymentcashMobileComponent,
    PaymentcashTabletComponent,
    PaymentcashDesktopComponent,

    SuccessPaymentBaseComponent,
    SuccessPaymentMobileComponent,
    SuccessPaymentTabletComponent,
    SuccessPaymentDesktopComponent,

    VoucherBaseComponent,
    VoucherMobileComponent,
    VoucherTabletComponent,
    VoucherDesktopComponent,

    DeliveryDetailsPopoverComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class BasketModule { }
