import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { HeaderDesktopService } from '@shared/services/header-desktop.service';
import { HomeDesktopComponent as HomeDesktopComponentPopover } from 'src/app/ecommerce/categories/home';
import { ProductsFilterBaseComponent } from '../base/products-filter-base.component';
import { FilterDesktopComponent } from '../../filter';

@Component({
  templateUrl: 'products-filter-desktop.component.html',
  styleUrls: ['products-filter-desktop.component.scss'],
  host: { 'app.products-filter-desktop': 'true' }
})
export class ProductsFilterDesktopComponent extends ProductsFilterBaseComponent implements OnInit {

  @ViewChild(FilterDesktopComponent) filterComponent!: FilterDesktopComponent;
  private _popoverController: PopoverController;

  headerDesktopService: HeaderDesktopService;

  constructor(_injector: Injector) {
    super(_injector);
    this.headerDesktopService = _injector.get(HeaderDesktopService);
    this._popoverController = _injector.get(PopoverController);
  }

  ngAfterViewInit() {
    this.filterComponent.onFilterApplied.subscribe((selectedFilters) => {
      this.dataFilteredAdvanced = selectedFilters

      this.selectedCategoryId = selectedFilters.selectedCategoryId
      this.selectedCategory = selectedFilters.selectedCategory;
      this.selectedVariants = selectedFilters.selectedVariants;
      this.selectedColor = selectedFilters.selectedColor;
      this.selectedMinPrice = selectedFilters.selectedMinPrice;
      this.selectedMaxPrice = selectedFilters.selectedMaxPrice;
      this.filterVariantsAndCategory();

    });
  }

  ionViewWillEnter() {
    this.toolbar.show();
    this.productDetail = false
  }

  override ngOnInit() {
    this.subscriber = this._activateRoute.queryParams.subscribe(params => {
      const { searchValue } = params;
      this.productSubscription?.unsubscribe();
      this.productSubscriptionVariants?.unsubscribe();
      this.filterComponent?.onCleanFilters();
      this.products = []
      this.noResultsMessageVisible = false
      this.searchValue = searchValue || '';
      this.onGetProductsSearch();
      this.onGetProductsVariants()
      this.count$ = this._basketService.getCount();
    });
  }

  async inputClicked(event: PointerEvent | Event) {
    const popover = await this._popoverController.create({
      component: HomeDesktopComponentPopover,
      event: event,
      alignment: 'center',
      size: 'cover',
      arrow: false,
      dismissOnSelect: true,
      cssClass: 'popover-search-desktop',
    });
    popover.onDidDismiss().then(() => {
      window.location.reload();
    });
    await popover.present();
  }

  filterVariantsAndCategory() {


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
    console.log(this.dataFilteredAdvanced);

    if (this.dataFilteredAdvanced.variantsAll.length === 0) {
      this.arrayVariants = []
    } else {
      this.arrayVariants = this.dataFilteredAdvanced.variantsAll
    }
    console.log(this.arrayVariants);

    this.getAllProductsFilteres()
  }


  ionViewWillLeave() {
    this.productSubscription?.unsubscribe();
    this.productSubscriptionVariants?.unsubscribe();

    this.products = []
    this.noResultsMessageVisible = false
    this.filterComponent.onCleanFilters();

  }


  filterByPrice() {
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

  cleanFilters() {
    this.selectedCategory = null;
    // this.selectedVariants = null;
    this.selectedColor = null;
    this.selectedMinPrice = 0;
    this.selectedMaxPrice = 0;
    this.arrayVariants = []
    this.selectedCategoryId = 0
    this.onGetProductsSearch();
    console.log('aca');

  }


  backHome() {
    this.navigation.backNoAnimation('/app/ecommerce/home/home');
  }

}