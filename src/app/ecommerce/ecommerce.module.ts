import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModule } from '@geor360/core';
import { ComponentsModule } from '@geor360/ecommerce-components';
import { IonicModule } from '@ionic/angular';
import { EcommerceRoutingModule } from './ecommerce-routing.module';
import { EcommerceComponent } from './ecommerce.component';

@NgModule({
  declarations: [EcommerceComponent],
  imports: [
    CoreModule,
    IonicModule,
    CommonModule,
    EcommerceRoutingModule,
    ComponentsModule
  ]
})
export class EcommerceModule { }
