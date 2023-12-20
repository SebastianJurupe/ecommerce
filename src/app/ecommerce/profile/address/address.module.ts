import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { CoreModule } from '@geor360/core';
import { ComponentsModule } from '@geor360/ecommerce-components';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '@shared/pipes/pipes.module';

import { NationalDivisionModalComponent } from './national-division-modal/mobile/national-division-modal.component';
import { OptionAddressPopoverComponent } from './option-address-popover/option-address-popover.component';
import { GoogleMapService } from './services/google-maps/google-map.service';

import { SharedModule } from '@shared/shared.module';
import { AddressItemBaseComponent, AddressItemDesktopComponent, AddressItemMobileComponent, AddressItemTabletComponent } from './address-item';
import { FormAddressDesktopComponent, FormAddressMobileComponent } from './form-address';
import { ListAddressDesktopComponent, ListAddressMobileComponent } from './list-address';
import { MapDesktopComponent, MapMobileComponent } from './map';
import { NationalDivisionModalDesktopComponent } from './national-division-modal/desktop/national-division-modal-desktop.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    CoreModule,
    FormsModule,
    IonicModule,
    PipesModule,
    SharedModule
  ],
  declarations: [
    AddressItemBaseComponent,
    AddressItemMobileComponent,
    AddressItemTabletComponent,
    AddressItemDesktopComponent,
    FormAddressMobileComponent,
    FormAddressDesktopComponent,
    ListAddressMobileComponent,
    MapMobileComponent,
    OptionAddressPopoverComponent,
    NationalDivisionModalComponent,
    NationalDivisionModalDesktopComponent,
    ListAddressDesktopComponent,
    MapDesktopComponent
  ],
  providers: [
    GoogleMapService,
    LocationAccuracy,
  ]
})
export class AddressModule { }
