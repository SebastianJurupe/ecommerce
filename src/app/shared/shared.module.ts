import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CoreModule } from '@geor360/core';
import { ComponentsModule } from '@geor360/ecommerce-components';
import { IonicModule } from '@ionic/angular';
import {
  CardProductSkeletonComponent,
  ChooseLanguagePopoverComponent,
  DesktopSlideComponent,
  DesktopSlidePrivacyComponent,
  DocumentTypesPopoverComponent,
  FreightForwardersBaseComponent,
  FreightForwardersDesktopComponent,
  FreightForwardersMobileComponent,
  FreightForwardersTabletComponent,
  HomeDeliveryBaseComponent,
  HomeDeliveryDesktopComponent,
  HomeDeliveryMobileComponent,
  HomeDeliveryTabletComponent,
  ModalCountryComponent,
  StoreLocationMapBaseComponent,
  StoreLocationMapDesktopComponent,
  StoreLocationMapMobileComponent,
  StoreLocationMapTabletComponent,
  StoresBaseComponent,
  StoresDesktopComponent,
  StoresMobileComponent,
  StoresTabletComponent
} from './components';
import { SecurityCodeComponent } from './modals';
import { ProxiesModule } from './proxies/proxies.module';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { ImgBrokenDirective } from './directives/img-broken.directive';

@NgModule({
  imports: [
    IonicModule,
    CoreModule,
    ComponentsModule,
    CommonModule,
    ProxiesModule
  ],
  declarations: [
    CardProductSkeletonComponent,
    ChooseLanguagePopoverComponent,
    DesktopSlideComponent,
    DesktopSlidePrivacyComponent,
    DocumentTypesPopoverComponent,
    FreightForwardersBaseComponent,
    FreightForwardersDesktopComponent,
    FreightForwardersMobileComponent,
    FreightForwardersTabletComponent,
    HomeDeliveryBaseComponent,
    HomeDeliveryDesktopComponent,
    HomeDeliveryMobileComponent,
    HomeDeliveryTabletComponent,
    ModalCountryComponent,
    SecurityCodeComponent,
    StoreLocationMapBaseComponent,
    StoreLocationMapDesktopComponent,
    StoreLocationMapMobileComponent,
    StoreLocationMapTabletComponent,
    StoresBaseComponent,
    StoresDesktopComponent,
    StoresMobileComponent,
    StoresTabletComponent,
    ImgBrokenDirective,
  ],
  exports: [
    CardProductSkeletonComponent,
    ChooseLanguagePopoverComponent,
    DesktopSlideComponent,
    DesktopSlidePrivacyComponent,
    DocumentTypesPopoverComponent,
    FreightForwardersBaseComponent,
    FreightForwardersDesktopComponent,
    FreightForwardersMobileComponent,
    FreightForwardersTabletComponent,
    HomeDeliveryBaseComponent,
    HomeDeliveryDesktopComponent,
    HomeDeliveryMobileComponent,
    HomeDeliveryTabletComponent,
    ModalCountryComponent,
    SecurityCodeComponent,
    StoreLocationMapBaseComponent,
    StoreLocationMapDesktopComponent,
    StoreLocationMapMobileComponent,
    StoreLocationMapTabletComponent,
    StoresBaseComponent,
    StoresDesktopComponent,
    StoresMobileComponent,
    StoresTabletComponent,
    ImgBrokenDirective,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    LocationAccuracy
  ]
})
export class SharedModule { }
