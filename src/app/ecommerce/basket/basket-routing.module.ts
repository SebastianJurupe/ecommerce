import { NgModule } from '@angular/core';
import { ROUTES, RouterModule, Routes } from '@angular/router';
import { HomeDesktopComponent, HomeMobileComponent } from './home';
import { AddBillingDesktopComponent, AddBillingMobileComponent } from './modals/add-billing';
import { DepositPaymentDesktopComponent, DepositPaymentMobileComponent } from './deposit-payment';
import { NewCardPaymentDesktopComponent, NewCardPaymentMobileComponent } from './new-card-payment';
import { PaymentMethodsDesktopComponent, PaymentMethodsMobileComponent } from './payment-methods';
import { PaymentcashDesktopComponent, PaymentcashMobileComponent } from './paymentcash';
import { SavedCardPaymentDesktopComponent, SavedCardPaymentMobileComponent } from './saved-card-payment';
import { StorePickupDesktopComponent, StorePickupMobileComponent } from './store-pickup';
import { SuccessPaymentDesktopComponent, SuccessPaymentMobileComponent } from './success-payment';
import { YapePaymentDesktopComponent, YapePaymentMobileComponent } from './yape-payment';
import { VoucherDesktopComponent, VoucherMobileComponent } from './voucher';
import { AppConfigurationService } from '@geor360/core';
import { MyAddressesDesktopComponent, MyAddressesMobileComponent } from './modals/my-addresses';
import { PaymentMethodsComponent } from './modals/payment-methods/payment-methods.component';


const mobileRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: HomeMobileComponent },
      { path: 'add-billing', component: AddBillingMobileComponent },
      { path: 'add-address', component: MyAddressesMobileComponent },
      { path: 'deposit-payment', component: DepositPaymentMobileComponent },
      { path: 'new-card-payment', component: NewCardPaymentMobileComponent },
      { path: 'payment-methods', component: PaymentMethodsMobileComponent },
      { path: 'paymentcash', component: PaymentcashMobileComponent },
      { path: 'saved-card-payment', component: SavedCardPaymentMobileComponent },
      { path: 'store-pickup', component: StorePickupMobileComponent },
      { path: 'success-payment', component: SuccessPaymentMobileComponent },
      { path: 'voucher', component: VoucherMobileComponent },
      { path: 'yape-payment', component: YapePaymentMobileComponent },
      { path: 'last-step', component: PaymentMethodsComponent },
      { path: '**', redirectTo: '', pathMatch: 'full' },
      { path: '', redirectTo: '', pathMatch: 'full' },
    ]
  }
];

// const tabletRoutes: Routes = [
//   {
//     path: '',
//     children: [
//       { path: '', component: HomeTabletComponent },
//       { path: 'add-billing', component: AddBillingTabletComponent },
//       { path: 'add-address', component: MyAddressesTabletComponent },
//       { path: 'deposit-payment', component: DepositPaymentTabletComponent },
//       { path: 'new-card-payment', component: NewCardPaymentTabletComponent },
//       { path: 'payment-methods', component: PaymentMethodsTabletComponent },
//       { path: 'paymentcash', component: PaymentcashTabletComponent },
//       { path: 'saved-card-payment', component: SavedCardPaymentTabletComponent },
//       { path: 'store-pickup', component: StorePickupTabletComponent },
//       { path: 'success-payment', component: SuccessPaymentTabletComponent },
//       { path: 'voucher', component: VoucherTabletComponent },
//       { path: 'yape-payment', component: YapePaymentTabletComponent },
//       { path: '**', redirectTo: '', pathMatch: 'full' },
//       { path: '', redirectTo: '', pathMatch: 'full' },
//     ]
//   }
// ];

const desktopRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: HomeDesktopComponent },
      { path: 'add-billing', component: AddBillingDesktopComponent },
      { path: 'add-address', component: MyAddressesDesktopComponent },
      { path: 'deposit-payment', component: DepositPaymentDesktopComponent },
      { path: 'new-card-payment', component: NewCardPaymentDesktopComponent },
      { path: 'payment-methods', component: PaymentMethodsDesktopComponent },
      { path: 'paymentcash', component: PaymentcashDesktopComponent },
      { path: 'saved-card-payment', component: SavedCardPaymentDesktopComponent },
      { path: 'store-pickup', component: StorePickupDesktopComponent },
      { path: 'success-payment', component: SuccessPaymentDesktopComponent },
      { path: 'voucher', component: VoucherDesktopComponent },
      { path: 'yape-payment', component: YapePaymentDesktopComponent },
      { path: '**', redirectTo: '', pathMatch: 'full' },
      { path: '', redirectTo: '', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild([])],
  exports: [RouterModule],
  providers: [
    {
      provide: ROUTES,
      useFactory: (configuration: AppConfigurationService) => {

        let deviceRoutes: Routes = [];
        const screen = configuration.screen();

        if (screen == 'mobile') {
          deviceRoutes = mobileRoutes;
        }
        else if (screen == 'tablet') {
          deviceRoutes = desktopRoutes;
        } else {
          deviceRoutes = desktopRoutes;
        }
        return [
          ...deviceRoutes
        ];
      },
      deps: [AppConfigurationService],
      multi: true
    }
  ]
})

export class BasketRoutingModule { }
