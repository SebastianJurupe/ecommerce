import { Component, Injector } from '@angular/core';
import { CategoryProductsBaseComponent } from '../base/category-products-base.component';


@Component({
  templateUrl: 'category-products-mobile.component.html',
  styleUrls: ['category-products-mobile.component.scss'],
  host: { 'app.category-products-mobile': 'true' },
})
export class CategoryProductsMobileComponent extends CategoryProductsBaseComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }

  async navigateToScanner() {
    if (!await this.isAuthenticated) {
      return this.navigation.forward('/app/ecommerce/profile/login');
    }
    this.navigation.forward('/app/ecommerce/scanner/scan');
  }

  navigateToBasket() {
    this.navigation.forward('/app/ecommerce/basket');
  }

  onBackButtonPressed() {
    this.navigation.back('/app/ecommerce/categories');
  }

}