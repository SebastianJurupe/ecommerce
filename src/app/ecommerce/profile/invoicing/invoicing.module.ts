import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '@geor360/core';
import { ComponentsModule } from '@geor360/ecommerce-components';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../../../shared/pipes/pipes.module';
import { ListBaseComponent, ListDesktopComponent, ListMobileComponent, ListTabletComponent } from './list';
import { FormBaseComponent, FormDesktopComponent, FormMobileComponent, FormTabletComponent } from './form';
import { OptionsPopoverComponent } from './options-popover/options-popover.component';
import { InvoiceItemBaseComponent, InvoiceItemDesktopComponent, InvoiceItemMobileComponent, InvoiceItemTabletComponent } from './invoice-item';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    CoreModule,
    IonicModule,
    PipesModule,
    FormsModule,
    SharedModule
  ],
  declarations: [
    ListBaseComponent,
    ListMobileComponent,
    ListTabletComponent,
    ListDesktopComponent,

    FormBaseComponent,
    FormMobileComponent,
    FormTabletComponent,
    FormDesktopComponent,

    OptionsPopoverComponent,

    InvoiceItemBaseComponent,
    InvoiceItemMobileComponent,
    InvoiceItemTabletComponent,
    InvoiceItemDesktopComponent,
  ]
})
export class InvoicingModule { }
