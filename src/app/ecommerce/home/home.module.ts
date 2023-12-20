import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CoreModule } from '@geor360/core';
import { ComponentsModule } from '@geor360/ecommerce-components';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalsModule } from './modals/modals.module';

import { DetailBaseComponent, DetailDesktopComponent, DetailMobileComponent, DetailTabletComponent } from './detail';
import { DetailProductBaseComponent, DetailProductDesktopComponent, DetailProductMobileComponent, DetailProductTabletComponent } from './detail-product';
import { HomeBaseComponent, HomeDesktopComponent, HomeMobileComponent, HomeTabletComponent } from "./home";
import { HomeRoutingModule } from './home-routing.module';
import { InitialConfigComponent } from './initial-config/initial-config.component';
import { MessagesBaseComponent, MessagesDesktopComponent, MessagesMobileComponent, MessagesTabletComponent } from './messages';
import { DocumentsComponent } from './messages/documents/documents.component';
import { TermsAndConditionsOfShipmentBaseComponent, TermsAndConditionsOfShipmentDesktopComponent, TermsAndConditionsOfShipmentTabletComponent } from './terms-and-conditions-of-shipment';
import { TermsAndConditionsOfShipmentMobileComponent } from './terms-and-conditions-of-shipment/mobile/terms-and-conditions-of-shipment-mobile.component';
import { VariantsBaseComponent, VariantsDesktopComponent, VariantsMobileComponent, VariantsTabletComponent } from './variants';


@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    CoreModule,
    HomeRoutingModule,
    IonicModule,
    SharedModule,
    ModalsModule,
    // ProfileModule,
  ],
  declarations: [
    HomeBaseComponent,
    HomeMobileComponent,
    HomeTabletComponent,
    HomeDesktopComponent,

    DetailBaseComponent,
    DetailMobileComponent,
    DetailTabletComponent,
    DetailDesktopComponent,

    DetailProductBaseComponent,
    DetailProductMobileComponent,
    DetailProductTabletComponent,
    DetailProductDesktopComponent,

    DocumentsComponent,

    MessagesBaseComponent,
    MessagesMobileComponent,
    MessagesTabletComponent,
    MessagesDesktopComponent,

    VariantsBaseComponent,
    VariantsMobileComponent,
    VariantsTabletComponent,
    VariantsDesktopComponent,

    TermsAndConditionsOfShipmentBaseComponent,
    TermsAndConditionsOfShipmentMobileComponent,
    TermsAndConditionsOfShipmentTabletComponent,
    TermsAndConditionsOfShipmentDesktopComponent,

    InitialConfigComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class HomeModule { }
