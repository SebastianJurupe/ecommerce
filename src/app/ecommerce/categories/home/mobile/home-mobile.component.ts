import { Component, Injector } from '@angular/core';
import { HomeBaseComponent } from '../base/home-base.component';

@Component({
  templateUrl: 'home-mobile.component.html',
  styleUrls: ['home-mobile.component.scss'],
  host: { 'app.categories.home-mobile': 'true' }
})
export class HomeMobileComponent extends HomeBaseComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }

  navigateToCategory(category: any) {
    const categoryId = category.id;
    const categoryName = category.name;
    const slug = category.slug;

    this.navigation.forward(
      `/app/ecommerce/categories/category-products/${categoryId}`,
      { id: categoryId, name: categoryName, slug: slug }
    );
  }

}