import { Component, Injector } from '@angular/core';
import { ProductsFilterBaseComponent } from '../base/products-filter-base.component';
@Component({
  templateUrl: 'products-filter-mobile.component.html',
  styleUrls: ['products-filter-mobile.component.scss'],
  host: { 'app.products-filter-mobile': 'true' }
})
export class ProductsFilterMobileComponent extends ProductsFilterBaseComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }

  navigateToBasket() {
    this.navigation.forward('/app/ecommerce/basket');
  }

  onBackButtonPressed() {
    this.navigation.back('/app/ecommerce/categories');
  }
}