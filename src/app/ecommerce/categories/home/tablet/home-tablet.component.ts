import { Component, Injector, OnInit } from '@angular/core';
import { HomeBaseComponent } from '../base/home-base.component';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  templateUrl: 'home-tablet.component.html',
  styleUrls: ['home-tablet.component.scss'],
  host: { 'app.categories.home-tablet': 'true' }
})
export class HomeTabletComponent extends HomeBaseComponent implements OnInit, ViewWillEnter {

  constructor(_injector: Injector) {
    super(_injector);
  }

  viewCategories(category: any) {
    const categoryId = category.id;
    const categoryName = category.name;
    const slug = category.slug;

    this.navigation.forward(
      `/app/ecommerce/categories/category-products/${categoryId}`,
      { name: categoryName, slug: slug }
    );
  }

}