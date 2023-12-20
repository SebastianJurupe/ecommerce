import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppTabService, ViewComponent } from '@geor360/core';
import { ViewWillEnter, PopoverController } from '@ionic/angular';
import { ProductGetAllOutputDataDto, ProductGetCategoriesDetailOutputDataDto, ProductServiceProxy } from '@shared/proxies/home/product.proxie';
import { AuthTokenService } from '@shared/services/auth-token.service';
import { BasketService } from '@shared/services/basket.service';
import { HeaderDesktopService } from '@shared/services/header-desktop.service';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs/internal/Observable';
import { debounceTime } from 'rxjs/operators';
import { HeaderExtendedComponent } from '@geor360/ecommerce-components';

interface Category {
  id: number;
  name: string;
  slug: string;
  products_count: number;
}

interface SearchItem {
  text: string;
  url: string;
}

@Component({
  templateUrl: 'home-base.component.html',
  styleUrls: ['home-base.component.scss'],
  host: { 'app.categories.home-base': 'true' },
})
export class HomeBaseComponent extends ViewComponent implements OnInit, ViewWillEnter {
  @ViewChild('headerExtended') headerExtended!: HeaderExtendedComponent;

  private _authTokenService: AuthTokenService;
  private _basketService: BasketService;
  private _productServiceProxy: ProductServiceProxy;
  _searchSubject = new Subject<string>();
  private _toolbar: AppTabService;
  popoverController: PopoverController;
  allProducts: ProductGetAllOutputDataDto[] = [];
  allSearches: SearchItem[] = [];
  categories: ProductGetCategoriesDetailOutputDataDto[] = [];
  count$: Observable<number> | undefined;
  headerDesktopService: HeaderDesktopService;
  searching: boolean = false;
  searchResults: ProductGetAllOutputDataDto[] = [];
  searchValue = '';
  showAllRecentSearches = false;
  showDeleteAllButton = false;
  showRecentSearchesSection = false;
  value: any;

  constructor(_injector: Injector) {
    super(_injector);
    this._authTokenService = _injector.get(AuthTokenService);
    this._basketService = _injector.get(BasketService);
    this._productServiceProxy = _injector.get(ProductServiceProxy);
    this.popoverController = _injector.get(PopoverController);
    this._toolbar = _injector.get(AppTabService);
    this.headerDesktopService = _injector.get(HeaderDesktopService);
  }

  get isAuthenticated(): Promise<boolean> {
    return new Promise((resolve) => {
      this._authTokenService.isAuthenticated()
        .subscribe((isAuthenticated) => {
          resolve(isAuthenticated);
        });
    });
  }

  ionViewWillEnter() {
    this._toolbar.show();
  }

  ngOnInit() {
    this.value = this.headerDesktopService.getText();
    this.searchValue = this.value.value;

    this._searchSubject.pipe(debounceTime(500)).subscribe((text) => {
      if (text.length > 0) {
        this.searching = true;
        this.onGetProductsSearch(text).then(() => {
          this.searchResults = this.allProducts.filter((product) =>
            product.description.toLowerCase().includes(text)
          );
          this.searching = false;
        });
      } else {
        this.searchResults = [];
        this.searching = false;
      }
    });

    this.onGetCategories();
    this.onGetProducts();
    this.count$ = this._basketService.getCount();
  }

  onPerformSearch(text: string) {
    if (text) {
      const lowercasedText = text.toLowerCase();
      const isDuplicate = this.allSearches.some(searchItem => searchItem.text.toLowerCase() === lowercasedText);
      if (!isDuplicate) {
        const searchUrl = `/app/ecommerce/categories/products-filter?searchValue=${encodeURIComponent(text)}`;
        this.allSearches.unshift({ text: lowercasedText, url: searchUrl });
        if (this.allSearches.length > 20) {
          this.allSearches.pop();
        }
        this.showRecentSearchesSection = true;
      }
    }
  }

  navigateToSearch(search: { text: string; url: string; }) {
    this.navigation.forward(search.url);
  }

  onSearch(event: Event) {
    const inputEvent = event as InputEvent;
    if (inputEvent && inputEvent.target instanceof HTMLInputElement) {
      const text = inputEvent.target.value.toLowerCase().trim();
      this.searchValue = text;
      this._searchSubject.next(text);
    }
  }

  async onSaveSearch(sentence: string) {
    const text = sentence.toLowerCase();
    this.searchValue = sentence;

    if (text !== '') {
      this.onPerformSearch(text);
      this.onSearchResult();
      this.headerExtended.setBlur();
      this.popoverController.dismiss();
    }
  }

  onGetProductsSearch(description: string) {
    return new Promise<void>((resolve, reject) => {
      this._productServiceProxy.getAll(description).subscribe({
        next: (response) => {
          this.allProducts = response.data;
          resolve();
        },
        error: (error) => {
          console.error(error);
          reject(error);
        },
      });
    });
  }

  onGetProducts() {
    this._productServiceProxy.getAll().subscribe({
      next: (response) => {
        this.allProducts = response.data;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  onGetCategories() {
    this._productServiceProxy.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data.filter((category: Category) => category.products_count > 0);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  onClearInput() {
    this.showRecentSearchesSection = this.allSearches.length > 0;
    this.searchResults = [];
    this.searchValue = '';
  }

  onShowAllSearchesButton() {
    this.showAllRecentSearches = true;
    this.showDeleteAllButton = true;
  }

  onDeleteAllRecentSearchesButton() {
    this.allSearches = [];
    this.showDeleteAllButton = false;
    this.showAllRecentSearches = false;
    this.showRecentSearchesSection = false;
  }

  onClear(search: SearchItem) {
    const index = this.allSearches.indexOf(search);
    if (index !== -1) {
      this.allSearches.splice(index, 1);
    }
  }

  async navigateToScanner() {
    if (!await this.isAuthenticated) {
      return this.navigation.forward('/app/ecommerce/profile/login');
    }
    this.navigation.forward('/app/ecommerce/scanner/scan');
  }

  onClickSearch() {
    this.navigation.forward('/app/ecommerce/categories/products-filter');
  }

  onSearchResult() {
    if (this.searchValue && typeof this.searchValue === 'string') {
      const lowercasedText = this.searchValue.toLowerCase();
      const isDuplicate = this.allSearches.some(searchItem => searchItem.text.toLowerCase() === lowercasedText);

      if (!isDuplicate) {
        const searchUrl = `/app/ecommerce/categories/products-filter?searchValue=${encodeURIComponent(this.searchValue)}`;
        this.allSearches.unshift({ text: lowercasedText, url: searchUrl });

        if (this.allSearches.length > 20) {
          this.allSearches.pop();
        }
      }

      this.navigation.forward(`/app/ecommerce/categories/products-filter`, {
        searchValue: this.searchValue,
      });
    }
  }

  navigateToSearchResult(selectedProduct: ProductGetAllOutputDataDto) {
    const productId = selectedProduct.id;
    const formattedDescription = selectedProduct.description.replace(/\s+/g, '-');
    const searchText = selectedProduct.description.toLowerCase();
    const searchUrl = `/app/ecommerce/home/detail-product/${productId}/${formattedDescription}`;
    const isDuplicate = this.allSearches.some(searchItem => searchItem.text === searchText);

    if (!isDuplicate) {
      this.allSearches.unshift({ text: searchText, url: searchUrl });

      if (this.allSearches.length > 20) {
        this.allSearches.pop();
      }
    }
    this.navigation.forward(`/app/ecommerce/home/detail-product/${productId}/${formattedDescription}`, { categories: true });
  }

}