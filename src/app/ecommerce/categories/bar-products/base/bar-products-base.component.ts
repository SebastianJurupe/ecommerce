import { Component, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiException, AppConfigurationService, AppTabService, ViewComponent } from '@geor360/core';
import { Platform, ViewWillEnter } from '@ionic/angular';
import { ProductGetCategoriesDetailOutputProductsDto, ProductServiceProxy } from '@shared/proxies/home/product.proxie';
import { AuthTokenService } from '@shared/services/auth-token.service';
import { BasketService } from '@shared/services/basket.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  templateUrl: 'bar-products-base.component.html',
  styleUrls: ['bar-products-base.component.scss'],
  host: { 'app.bar-products-base': 'true' }
})
export class BarProductsBaseComponent extends ViewComponent implements ViewWillEnter {

  private _appConfigurationService: AppConfigurationService;
  private _basketService: BasketService;
  private _platform: Platform;
  private _productServiceProxy: ProductServiceProxy;

  activatedRoute: ActivatedRoute;
  authTokenService: AuthTokenService;
  banner: string = '';
  basketIdProductInFocus = 0;
  basketProductQuantity: any[] = [];
  count$: Observable<number> | undefined;
  inputValue: number = 0;
  isActionClearPressed = false;
  isActionOkPressed = false;
  isCardProductFocused: boolean = false;
  isLoading: boolean = false;
  keyboardWillShow: boolean = false;
  platform: string = '';
  products: ProductGetCategoriesDetailOutputProductsDto[] = [];
  showMenuInput: boolean = false;
  toolbar: AppTabService;
  totalItems: number = 0;
  userIsAuthenticated: boolean = false;
  page: number = 2;
  totalPages: number = 0;
  category: string = ''
  constructor(_injector: Injector) {
    super(_injector);
    this._appConfigurationService = _injector.get(AppConfigurationService);
    this._basketService = _injector.get(BasketService);
    this._platform = _injector.get(Platform);
    this._productServiceProxy = _injector.get(ProductServiceProxy);
    this.activatedRoute = _injector.get(ActivatedRoute);
    this.authTokenService = _injector.get(AuthTokenService);
    this.platform = this._platform.is('ios') ? 'ios' : 'android';
    this.toolbar = _injector.get(AppTabService);
  }

  get isAuthenticated(): Promise<boolean> {
    return new Promise((resolve) => {
      this.authTokenService.isAuthenticated()
        .subscribe((isAuthenticated) => {
          resolve(isAuthenticated);
        });
    });
  }

  ionViewWillEnter() {
    this.toolbar.hide();
    this.onGetTotalItems();
  }

  ngOnInit() {
    const { category } = this.activatedRoute.snapshot.params;
    this.category = category
    this.onGetProducts(category);
    this.onGetLoginState();
    this.count$ = this._basketService.getCount();
  }

  onGetProducts(category: string) {
    this.isLoading = true;
    this._productServiceProxy.getCategoriesDetail(category, '20')
      .subscribe({
        next: (response) => {
          this.isLoading = false;

          const pageSize = 20; // Tamaño de página
          const totalProducts = response.data.products_count; // Cantidad total de productos

          this.totalPages = Math.ceil(totalProducts / pageSize);

          this.banner = this._appConfigurationService.screen() === 'mobile' ? this.banner = response.data.cover_movil : response.data.cover_desktop;
          this.products = response.data.products;
          this.products.forEach(product => { this.basketProductQuantity.push({ productId: product.id, quantity: undefined, lastQuantity: '' }); });
          this.onMatchWithBasket(this.products);
        },
        error: (error: ApiException) => {
          this.isLoading = false;
          this.message.exception(error);
        }
      });
  }

  onClearInput() { }

  onClickOk() { }

  onProductCardBlur() {
    this.isCardProductFocused = false;

    setTimeout(() => {
      if (this.isCardProductFocused === false) {
        this.showMenuInput = false;
      }
    }, 500);

    if (!this.isActionClearPressed && !this.isActionOkPressed) {
      this.onUpdateBasket();
      this.onGetTotalItems();
    } else {
      this.isActionOkPressed = false;
    }
  }

  onUpdateBasket() {
    const product = this.basketProductQuantity.filter(({ productId }) => productId === this.basketIdProductInFocus);
    const basketQuantityProductInFocus = parseInt(product[0].quantity as string);
    const productIndex = this.basketProductQuantity.findIndex(({ productId }) => productId === this.basketIdProductInFocus);

    if (Number.isNaN(basketQuantityProductInFocus)) {
      this._basketService.getBasketCode()
        .then(() => {
          const indexInBasket = this._basketService.getIdInBasket(product[0].productId);
          this._basketService.deleteProductInBasket(indexInBasket);
          this.basketProductQuantity[productIndex].quantity = undefined;
        });
    }
    if (!Number.isNaN(basketQuantityProductInFocus) && basketQuantityProductInFocus == 0) {
      this._basketService.getBasketCode()
        .then(() => {
          const indexInBasket = this._basketService.getIdInBasket(product[0].productId);
          this._basketService.deleteProductInBasket(indexInBasket);
          this.basketProductQuantity[productIndex].quantity = undefined;
        });
    }

    if (!Number.isNaN(basketQuantityProductInFocus)) {
      const stockAvailable = this.onGetStock(this.products, product[0].productId);

      if (stockAvailable >= basketQuantityProductInFocus) {
        this._basketService.updateQuantityProduct(this.basketIdProductInFocus, basketQuantityProductInFocus);
      } else {
        const message = this.localization.localize('general.insufficientStock', 'ecommerce');
        this.notify.warn(message, 1000);
        this._basketService.updateQuantityProduct(this.basketIdProductInFocus, stockAvailable, false)
          .then(() => {
            setTimeout(() => {
              const indexProduct = this.basketProductQuantity.findIndex(({ productId }) => productId === this.basketIdProductInFocus);
              this.basketProductQuantity[indexProduct].quantity = stockAvailable;
            }, 10);
          });
      }
    }
  }

  onGetStock(products: any, idProduct: number) {
    const index = products.findIndex((product: any) => { return product.id === idProduct; });
    if (index == -1) {
      return -1;
    } else {
      return products[index].stock;
    }
  }

  async onClickShoppingCart(_index: number, productHasVariants: boolean, productId: number, description: string) {
    if (await this.isAuthenticated) {
      if (!productHasVariants) {
        this.showMenuInput = true;
      } else {
        this.onViewProductDetail(productId, description);
      }
    } else {
      this.navigation.forward('/app/ecommerce/profile/login');
    }
  }

  onViewProductDetail(id: number, description: string) {
    const formattedDescription = description.replace(/\s+/g, '-');
    this.navigation.forward(`/app/ecommerce/home/detail-product/${id}/${formattedDescription}`, { fromBanner: true });
  }

  async onClickInputCartShopping(_index: number) {
    if (await this.isAuthenticated) {
      this.showMenuInput = true;
    } else {
      this.navigation.forward('/app/ecommerce/profile/login');
    }
  }

  onProductCardFocus() {
    this.isCardProductFocused = true;
    this.showMenuInput = true;
  }

  setSelectedProductCardIndex(index: number) {
    this.basketIdProductInFocus = index;
  }

  onGetTotalItems() {
    this.totalItems = this._basketService.getTotalItems();
  }

  onMatchWithBasket(basketProductQuantity: any) {
    const basket = this._basketService.getUserBasket();
    basket.items.forEach(item => {
      const element = basketProductQuantity.find((e: any) => e.id == item.data.item_id);
      const elementIndex = basketProductQuantity.findIndex((e: any) => e.id == item.data.item_id);
      if (elementIndex != -1 && element.has_variants == false) {
        this.basketProductQuantity[elementIndex].quantity = item.quantity;
      }
    });
  }

  async onGetLoginState(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.authTokenService.isAuthenticated()
        .subscribe((isAuthenticated) => {
          this.userIsAuthenticated = isAuthenticated;
          resolve(isAuthenticated);
        }, (error) => {
          reject(error);
        });
    });
  }

  async loadMoreData(event: any) {

    if (this.page <= this.totalPages) {
      this._productServiceProxy.getCategoriesDetail(this.category, '20', this.page.toString())
        .subscribe({
          next: (response) => {
            // Puedes hacer lo que necesites con los productos de la página actual aquí
            this.page++;
            this.products.push(...response.data.products);
            if (this.products.length != 0) {
              let featuredProductsBackup = [...this.products];
              // this.featuredProducts = [];
              setTimeout(() => {
                this.products = featuredProductsBackup;
                this.basketProductQuantity = [];
                this.products.forEach(
                  (product) => {
                    this.basketProductQuantity.push({
                      productId: product.id,
                      quantity: undefined,
                      lastQuantity: ''
                    });
                  }
                );
                this.onMatchWithBasket(this.products);
              }, 10);

            }
            event.target.complete();
          },
          error: (error: ApiException) => {
            event.target.complete();
            console.error(`Error en la página ${this.page}:`, error);
            // Manejar el error según sea necesario
          }
        });
    } else {
      event.target.complete();
    }

  }

  nextGetFeaturedCategoryDetails() {
    if (this.page <= this.totalPages) {
      this._productServiceProxy.getCategoriesDetail('destacados', '20', this.page.toString())
        .subscribe({
          next: (response) => {
            // Puedes hacer lo que necesites con los productos de la página actual aquí
            this.page++;
            this.products.push(...response.data.products);

            if (this.products.length != 0) {
              let featuredProductsBackup = [...this.products];
              // this.featuredProducts = [];
              setTimeout(() => {
                this.products = featuredProductsBackup;
                this.basketProductQuantity = [];
                this.products.forEach(
                  (product) => {
                    this.basketProductQuantity.push({
                      productId: product.id,
                      quantity: undefined,
                      lastQuantity: ''
                    });
                  }
                );
                this.onMatchWithBasket(this.products);
              }, 10);

            }
          },
          error: (error: ApiException) => {
            console.error(`Error en la página ${this.page}:`, error);
            // Manejar el error según sea necesario
          }
        });
    }
  }

}