import { NgModule } from '@angular/core';
import { ROUTES, RouterModule, Routes } from '@angular/router';
import { AppConfigurationService } from '@geor360/core';
import { FreightForwardersMobileComponent, HomeDeliveryMobileComponent } from '@shared/components';

import { StoreLocationMapDesktopComponent, StoreLocationMapMobileComponent } from '@shared/components/store-location-map';
import { DetailMobileComponent } from './detail';
import { DetailProductDesktopComponent, DetailProductMobileComponent } from './detail-product';
import { HomeDesktopComponent, HomeMobileComponent } from "./home";
import { InitialConfigGuard } from './initial-config.guard';
import { InitialConfigComponent } from './initial-config/initial-config.component';
import { MessagesDesktopComponent, MessagesMobileComponent } from './messages';
import { TermsAndConditionsOfShipmentDesktopComponent, TermsAndConditionsOfShipmentMobileComponent } from './terms-and-conditions-of-shipment';
import { VariantsMobileComponent } from './variants';
import { StoresMobileComponent } from '@shared/components/stores';


const mobileRoutes: Routes = [
  { path: 'initial-configuration', component: InitialConfigComponent, canActivate: [InitialConfigGuard] },
  { path: 'home', component: HomeMobileComponent },
  { path: 'detail-product/:id/:description', component: DetailProductMobileComponent },
  { path: 'detail/:id/:description', component: DetailMobileComponent },
  { path: 'messages', component: MessagesMobileComponent },
  { path: 'variants/:id/:description', component: VariantsMobileComponent },
  { path: 'home-delivery/:id/:description', component: HomeDeliveryMobileComponent },
  { path: 'stores/:id/:description', component: StoresMobileComponent },
  { path: 'freight-forwarders/:id/:description', component: FreightForwardersMobileComponent },
  { path: 'terms-and-conditions-of-shipment', component: TermsAndConditionsOfShipmentMobileComponent },
  { path: 'store-location', component: StoreLocationMapMobileComponent },
  { path: '**', redirectTo: 'initial-configuration', pathMatch: 'full' },
  { path: '', redirectTo: 'initial-configuration', pathMatch: 'full' },
];

// const tabletRoutes: Routes = [
//   { path: 'home', component: HomeTabletComponent },
//   { path: 'detail-product', component: DetailProductTabletComponent },
//   { path: 'detail', component: DetailTabletComponent },
//   { path: 'messages', component: MessagesTabletComponent },
//   { path: 'variants', component: VariantsTabletComponent },
//   { path: 'home-delivery', component: HomeDeliveryComponent },
//   { path: 'stores', component: StoresComponent },
//   { path: 'freight-forwarders', component: FreightForwardersComponent },
//   { path: 'terms-and-conditions-of-shipment', component: TermsAndConditionsOfShipmentTabletComponent },
//   { path: 'store-location', component: StoreLocationMapTabletComponent },
//   { path: '**', redirectTo: 'home', pathMatch: 'full' },
//   { path: '', redirectTo: 'home', pathMatch: 'full' },
// ];

const desktopRoutes: Routes = [
  { path: 'home', component: HomeDesktopComponent },
  { path: 'detail-product/:id/:description', component: DetailProductDesktopComponent },
  // { path: 'detail', component: DetailDesktopComponent },
  { path: 'messages', component: MessagesDesktopComponent },
  // { path: 'variants/:id', component: VariantsDesktopComponent },
  // { path: 'home-delivery', component: HomeDeliveryMobileComponent },
  // { path: 'stores', component: StoresDesktopComponent },
  // { path: 'freight-forwarders', component: FreightForwardersDesktopComponent },
  { path: 'terms-and-conditions-of-shipment', component: TermsAndConditionsOfShipmentDesktopComponent },
  { path: 'store-location', component: StoreLocationMapDesktopComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
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
export class HomeRoutingModule { }
