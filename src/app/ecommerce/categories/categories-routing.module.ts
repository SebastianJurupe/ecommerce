import { NgModule } from '@angular/core';
import { ROUTES, RouterModule, Routes } from '@angular/router';
import { AppConfigurationService } from '@geor360/core';
import { BarProductsDesktopComponent, BarProductsMobileComponent } from './bar-products';
import { CategoryProductsDesktopComponent, CategoryProductsMobileComponent } from './category-products';
import { FilterDesktopComponent, FilterMobileComponent } from './filter';
import { HomeMobileComponent } from './home';
import { ProductsFilterDesktopComponent, ProductsFilterMobileComponent } from './products-filter';

const mobileRoutes: Routes = [
  { path: 'home', component: HomeMobileComponent },
  { path: 'products-filter', component: ProductsFilterMobileComponent },
  { path: 'filter', component: FilterMobileComponent },
  { path: 'category-products/:id', component: CategoryProductsMobileComponent },
  { path: 'bar-products/:category', component: BarProductsMobileComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

// const tabletRoutes: Routes = [
//   { path: 'home', component: HomeTabletComponent },
//   { path: 'products-filter', component: ProductsFilterTabletComponent },
//   { path: 'filter', component: FilterTabletComponent },
//   { path: 'category-products/:id', component: CategoryProductsTabletComponent },
//   { path: 'bar-products/:category', component: BarProductsTabletComponent },
//   { path: '**', redirectTo: 'home', pathMatch: 'full' },
//   { path: '', redirectTo: 'home', pathMatch: 'full' },
// ];

const desktopRoutes: Routes = [
  // { path: 'home', component: HomeDesktopComponent },
  { path: 'products-filter', component: ProductsFilterDesktopComponent },
  { path: 'filter', component: FilterDesktopComponent },
  { path: 'category-products/:id', component: CategoryProductsDesktopComponent },
  { path: 'bar-products/:category', component: BarProductsDesktopComponent },
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
export class CategoriesRoutingModule { }
