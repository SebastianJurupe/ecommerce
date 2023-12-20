import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppTabService } from '@geor360/core';
import { HeaderDesktopService } from '@shared/services/header-desktop.service';
import { FilterDesktopComponent } from '../../filter';
import { CategoryProductsBaseComponent } from '../base/category-products-base.component';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  templateUrl: 'category-products-desktop.component.html',
  styleUrls: ['category-products-desktop.component.scss'],
  host: { 'app.category-products-desktop': 'true' },
})
export class CategoryProductsDesktopComponent extends CategoryProductsBaseComponent implements OnInit, ViewWillEnter {

  @ViewChild(FilterDesktopComponent) filterComponent!: FilterDesktopComponent;

  headerDesktopService: HeaderDesktopService;
  openedFromCategoryProducts: boolean = true;
  showCategories: boolean = false;
  toolbar: AppTabService;

  constructor(_injector: Injector) {
    super(_injector);
    this.headerDesktopService = _injector.get(HeaderDesktopService);
    this.toolbar = _injector.get(AppTabService);
  }

  override ionViewWillEnter() {
    this.toolbar.show();
    this.productDetail = false
  }

  ngAfterViewInit() {
    this.filterComponent.onFilterApplied
      .subscribe((selectedFilters) => {
        this.dataFilteredAdvanced = selectedFilters

        this.selectedCategory = selectedFilters.selectedCategory;
        this.selectedVariants = selectedFilters.selectedVariants;
        this.selectedColor = selectedFilters.selectedColor;
        this.selectedMaxPrice = selectedFilters.selectedMaxPrice;
        this.selectedMinPrice = selectedFilters.selectedMinPrice;
        this.onFilterVariantsAndCategory();
      });

  }
  ionViewWillLeave() {
    this.products = []
    this.noResultsMessageVisible = false
    this.filterComponent.onCleanFilters();
  }

  onFilterVariantsAndCategory() {
    // if (Object.keys(this.selectedVariants).length != 0 || this.selectedColor || this.selectedMaxPrice !== 0 || this.selectedMinPrice !== 0) {
    //   this.onFilterVariantsDesktop();
    // } else {
    //   this.onGetProducts();
    //   console.log('entro');
    // }

    if (this.selectedMinPrice === 0 || this.selectedMinPrice === '' || this.selectedMinPrice === undefined) {
      this.selectedMinPriceFiltered = 1
    } else {
      this.selectedMinPriceFiltered = this.selectedMinPrice
    }
    if (this.selectedMaxPrice === 0 || this.selectedMaxPrice === '' || this.selectedMaxPrice === undefined) {
      this.selectedMaxPriceFiltered = 99999999999
    } else {
      this.selectedMaxPriceFiltered = this.selectedMaxPrice
    }

    if (this.dataFilteredAdvanced.variantsAll.length === 0) {
      this.arrayVariants = []
    } else {
      this.arrayVariants = this.dataFilteredAdvanced.variantsAll
    }

    this.getAllProductsFilteres()
  }



  onFilterByPrice() {
    if (this.selectedMaxPrice !== null && this.selectedMinPrice !== null && this.selectedMaxPrice < this.selectedMinPrice) {
      this.noResultsMessageVisible = true;
      this.mainInfo.itemCount = 0;
      this.products = [];
      return;
    }

    const filteredProducts = this.products.filter((product) => (
      (this.selectedMinPrice === null || product.price >= this.selectedMinPrice) &&
      (this.selectedMaxPrice === null || product.price <= this.selectedMaxPrice)
    ));

    const hasResults = filteredProducts.length > 0;

    this.noResultsMessageVisible = !hasResults;
    this.mainInfo.itemCount = this.noResultsMessageVisible ? 0 : filteredProducts.length;
    this.products = filteredProducts;

    if (hasResults) {
      this.onUpdateMainInfo();
    }
  }

  navigateToHome() {
    this.navigation.backNoAnimation('/app/ecommerce/home/home');
  }

  navigateToInbox() {
    // this.navigation.backNoAnimation('/app/ecommerce/inbox');
  }

  onCleanFilters() {
    this.selectedCategory = '';
    this.selectedColor = '';
    this.selectedVariants = {};
    this.selectedMaxPrice = 0;
    this.selectedMinPrice = 0;
    this.arrayVariants = []
    this.onGetProducts();
  }

  onBackButtonPressed() {
    this.navigation.backNoAnimation('/app/ecommerce/home/home');
  }
}
