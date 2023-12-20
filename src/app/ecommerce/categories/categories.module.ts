import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '@geor360/core';
import { ComponentsModule } from '@geor360/ecommerce-components';
import { IonicModule } from '@ionic/angular';
import { BarProductsBaseComponent, BarProductsDesktopComponent, BarProductsMobileComponent, BarProductsTabletComponent } from './bar-products';
import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoryProductsBaseComponent, CategoryProductsDesktopComponent, CategoryProductsMobileComponent, CategoryProductsTabletComponent } from './category-products';
import { FilterBaseComponent, FilterDesktopComponent, FilterMobileComponent, FilterTabletComponent } from './filter';
import { HomeBaseComponent, HomeDesktopComponent, HomeMobileComponent, HomeTabletComponent } from './home';
import { ProductsFilterBaseComponent, ProductsFilterDesktopComponent, ProductsFilterMobileComponent, ProductsFilterTabletComponent } from './products-filter';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    CategoriesRoutingModule,
    ComponentsModule,
    CoreModule,
    SharedModule
  ],
  declarations: [
    HomeBaseComponent,
    HomeMobileComponent,
    HomeTabletComponent,
    HomeDesktopComponent,

    ProductsFilterBaseComponent,
    ProductsFilterMobileComponent,
    ProductsFilterTabletComponent,
    ProductsFilterDesktopComponent,

    FilterBaseComponent,
    FilterMobileComponent,
    FilterTabletComponent,
    FilterDesktopComponent,

    BarProductsBaseComponent,
    BarProductsMobileComponent,
    BarProductsTabletComponent,
    BarProductsDesktopComponent,

    CategoryProductsBaseComponent,
    CategoryProductsMobileComponent,
    CategoryProductsTabletComponent,
    CategoryProductsDesktopComponent,

  ],
})
export class CategoriesModule { }
