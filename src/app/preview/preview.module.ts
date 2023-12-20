import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ComponentsModule } from '@geor360/ecommerce-components';
import { CoreModule } from '@geor360/core';
import { PreviewComponent } from './preview.component';
import { PreviewRoutingModule } from './preview-routing.module';

@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    PreviewRoutingModule,
    ReactiveFormsModule,
    CoreModule
  ],
  declarations: [PreviewComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class PreviewPageModule {}
