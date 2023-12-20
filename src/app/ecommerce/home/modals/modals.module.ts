import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '@geor360/core';
import { ComponentsModule } from '@geor360/ecommerce-components';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '@shared/pipes/pipes.module';
import { AddProductComponent } from './add-product/add-product.component';
import { ImageProductCompleteBaseComponent, ImageProductCompleteDesktopComponent, ImageProductCompleteMobileComponent, ImageProductCompleteTabletComponent } from './image-product-complete';
import { MenuComponent } from './menu/menu.component';
import { ShareComponent } from './share/share.component';
import { AddProductDesktopComponent } from './add-product-desktop/add-product-desktop.component';

@NgModule({
  imports: [
    IonicModule,
    CoreModule,
    CommonModule,
    ComponentsModule,
    FormsModule,
    PipesModule,
  ],
  declarations: [
    AddProductComponent,
    ShareComponent,
    ImageProductCompleteBaseComponent,
    ImageProductCompleteDesktopComponent,
    ImageProductCompleteMobileComponent,
    ImageProductCompleteTabletComponent,
    MenuComponent,
    AddProductDesktopComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ModalsModule { }
