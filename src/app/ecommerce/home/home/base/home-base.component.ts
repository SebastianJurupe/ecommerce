import { Component, Injector, NgZone, OnInit, ViewChild } from '@angular/core';
import { Keyboard } from '@geor360/capacitor-keyboard';
import { ApiException, AppTabService, ViewComponent } from '@geor360/core';
import { IonContent, Platform } from '@ionic/angular';
import { BasketServiceProxy } from '@shared/proxies/basket/basket.proxie.service';
import {
  ProductGetBannersOutputDataDto,
  ProductGetCategoriesDetailOutputProductsDto,
  ProductServiceProxy
} from '@shared/proxies/home/product.proxie';
import { AuthTokenService } from '@shared/services/auth-token.service';
import { BasketService } from '@shared/services/basket.service';


@Component({
  templateUrl: 'home-base.component.html',
  styleUrls: ['home-base.component.scss'],
  host: { 'app.home.home-base': 'true' }
})
export class HomeBaseComponent extends ViewComponent implements OnInit {

  private _basketService: BasketService;
  private _basketServiceProxy: BasketServiceProxy;
  private _ngZone: NgZone;
  private _platform: Platform;
  private _productServiceProxy: ProductServiceProxy;

  // myBasket$: Observable<CartGetDataDto> | undefined;

  @ViewChild('content', { static: true }) content!: IonContent;

  authTokenService: AuthTokenService;
  basketIdProductInFocus = 0;
  basketProductQuantity: any[] = [];
  currentIndex: number = 0;
  device: string = '';
  featuredProducts: ProductGetCategoriesDetailOutputProductsDto[] = [];
  forYouProducts: ProductGetCategoriesDetailOutputProductsDto[] = [];
  forYouProductsDesktop: ProductGetCategoriesDetailOutputProductsDto[] = [];
  indexCardProductNow: number = -1;
  isActionClearPressed = false;
  isActionOkPressed = false;
  isCardProductFocused: boolean = false;
  keyboardWillShow: boolean = false;
  placeholders: { [key: string]: string; } = {};
  showCartShopping: boolean = true;
  showInputCartShopping: boolean = false;
  showMenuInput: boolean = false;
  slides: ProductGetBannersOutputDataDto[] = [];
  toolbar: AppTabService;
  userIsAuthenticated: boolean = false;
  page: number = 2;
  totalPages: number = 0;
  constructor(_injector: Injector) {
    super(_injector);
    this.authTokenService = _injector.get(AuthTokenService);
    this._basketService = _injector.get(BasketService);
    this._basketServiceProxy = _injector.get(BasketServiceProxy);
    this._ngZone = _injector.get(NgZone);
    this._platform = _injector.get(Platform);
    this._productServiceProxy = _injector.get(ProductServiceProxy);
    this.toolbar = _injector.get(AppTabService);
    this.refreshPlaceholders();
    this.handleKeyboardListener();
    this.getStateLoged();

  }

  get platform(): string {
    return this._platform.is('ios') ? 'ios' : 'android';
  }

  get platformIsCapacitor(): boolean {
    return this._platform.is('capacitor') || this._platform.is('mobileweb');
  }

  get isAuthenticated(): Promise<boolean> {
    return new Promise((resolve) => {
      this.authTokenService.isAuthenticated()
        .subscribe((isAuthenticated) => {
          this.userIsAuthenticated = isAuthenticated;
          resolve(isAuthenticated);
        });
    });
  }

  ngOnInit() {
    this.getBanners();
    this.getForYouCategoryDetails();
    this.getFeaturedCategoryDetails();
    console.log('si cambiooo');
  }

  ionViewWillEnter() {
    this.refreshPlaceholders();
    this.toolbar.show();
    this.getStateLoged();
    this.getFeaturedCategoryDetails();

    if (this.featuredProducts.length != 0) {
      let featuredProductsBackup = [...this.featuredProducts];
      this.featuredProducts = [];
      setTimeout(() => {
        this.basketProductQuantity = [];
        this.featuredProducts = featuredProductsBackup;
        this.featuredProducts.forEach(
          (product) => {
            this.basketProductQuantity.push({
              productId: product.id,
              quantity: undefined,
              lastQuantity: ''
            });
          }
        );
        this.matchWithBasket(this.featuredProducts);
      }, 10);

    }
  }

  handleKeyboardListener() {
    if (this.platformIsCapacitor) {
      Keyboard.addListener('keyboardWillShow', () => {
        this._ngZone.run(() => {
          this.keyboardWillShow = true;


        });
      });

      Keyboard.addListener('keyboardWillHide', () => {
        this._ngZone.run(() => {
          this.keyboardWillShow = false;
        });
      });
    }
  }

  goToProductDetail(id: number, description: string) {
    const formattedDescription = description.replace(/\s+/g, '-');
    this.navigation.forward(`/app/ecommerce/home/detail-product/${id}/${formattedDescription}`);
  }

  clickClearOption() {
    this.isActionClearPressed = true;
    const index = this.basketProductQuantity.findIndex(product => product.productId === this.basketIdProductInFocus);
    this.basketProductQuantity[index].quantity = undefined;
    this._basketService.getBasketCode()
      .then(() => {
        this._basketService.removeItemOfBasket(this.basketIdProductInFocus);
      });
  }

  clickOkOption() {
    this.showMenuInput = false;
    this.updateBasket();
    this.isActionOkPressed = true;
  }

  refreshPlaceholders() {
    this.placeholders = {
      forYou: this.localization.localize('home.forYou', 'ecommerce'),
      featured: this.localization.localize('home.featured', 'ecommerce')
    };
  }

  setSelectedProductCardIndex(index: number) {
    this.basketIdProductInFocus = index;
  }

  getBanners() {
    this._productServiceProxy.getBanners()
      .subscribe({
        next: (response) => {
          this.slides = response.data;
        },
        error: (error: ApiException) => { this.message.exception(error); }
      });
  }

  getForYouCategoryDetails() {
    this._productServiceProxy.getCategoriesDetail('para-ti', '30')
      .subscribe({
        next: (response) => {
          this.forYouProducts = response.data.products;
          this.updateDisplayedProducts();
        },
        error: (error: ApiException) => { },
      });
  }

  getFeaturedCategoryDetails() {
    this._productServiceProxy.getCategoriesDetail('destacados', '20')
      .subscribe({
        next: (response) => {
          this.featuredProducts = response.data.products;
          const pageSize = 20; // Tamaño de página
          const totalProducts = response.data.products_count; // Cantidad total de productos
          this.page = 2
          this.totalPages = Math.ceil(totalProducts / pageSize);
          this.featuredProducts.forEach(
            (product) => {
              this.basketProductQuantity.push({
                productId: product.id,
                quantity: undefined,
                lastQuantity: ''
              });
            }
          );
          this.matchWithBasket(this.featuredProducts);
        },
        error: (error: ApiException) => { }
      });
  }

  nextGetFeaturedCategoryDetails() {
    if (this.page <= this.totalPages) {
      this._productServiceProxy.getCategoriesDetail('destacados', '20', this.page.toString())
        .subscribe({
          next: (response) => {
            // Puedes hacer lo que necesites con los productos de la página actual aquí
            this.page++;
            this.featuredProducts.push(...response.data.products);

            if (this.featuredProducts.length != 0) {
              let featuredProductsBackup = [...this.featuredProducts];
              // this.featuredProducts = [];
              setTimeout(() => {
                this.basketProductQuantity = [];

                this.featuredProducts = featuredProductsBackup;
                this.featuredProducts.forEach(
                  (product) => {
                    this.basketProductQuantity.push({
                      productId: product.id,
                      quantity: undefined,
                      lastQuantity: ''
                    });
                  }
                );
                this.matchWithBasket(this.featuredProducts);
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

  async loadMoreData(event: any) {

    if (this.page <= this.totalPages) {
      this._productServiceProxy.getCategoriesDetail('destacados', '20', this.page.toString())
        .subscribe({
          next: (response) => {
            // Puedes hacer lo que necesites con los productos de la página actual aquí
            this.page++;
            this.featuredProducts.push(...response.data.products);
            if (this.featuredProducts.length != 0) {
              let featuredProductsBackup = [...this.featuredProducts];
              // this.featuredProducts = [];
              setTimeout(() => {
                this.basketProductQuantity = [];
                this.featuredProducts = featuredProductsBackup;
                this.featuredProducts.forEach(
                  (product) => {
                    this.basketProductQuantity.push({
                      productId: product.id,
                      quantity: undefined,
                      lastQuantity: ''
                    });
                  }
                );
                this.matchWithBasket(this.featuredProducts);
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

  updateProductQuantity(id: number, quantity: number) {
    this._basketServiceProxy.cartAddProduct(id, quantity)
      .subscribe({
        next: () => {
          const message = this.localization.localize('general.productAddedToCart', 'ecommerce');
          this._basketService.getBasket();
          this.notify.success(message, 2500);
        },
        error: (error: ApiException) => {
          this.message.exception(error);
        }
      });
  }

  async onClickShoppingCart(_index: number, productHasVariants: boolean, productId: number, description: string) {
    if (this.userIsAuthenticated) {
      if (!productHasVariants) {
        this.showMenuInput = true;
      } else {
        this.goToProductDetail(productId, description);
      }
    } else {
      this.navigation.forward('/app/ecommerce/profile/login');
    }
  }

  async clickInputCartShopping(_index: number, description: string, productHasVariants?: boolean, productId: number = -1) {
    if (this.userIsAuthenticated) {
      if (!productHasVariants) {
        this.showMenuInput = true;
      } else {
        this.goToProductDetail(productId, description);
      }
    } else {
      this.navigation.forward('/app/ecommerce/profile/login');
    }
  }

  onProductCardFocus() {
    this.isCardProductFocused = true;
    this.showMenuInput = true;
  }

  onProductCardBlur() {
    this.isCardProductFocused = false;

    setTimeout(() => {
      if (this.isCardProductFocused === false) {
        this.showMenuInput = false;
      }
    }, 500);

    if (!this.isActionClearPressed && !this.isActionOkPressed) {
      this.updateBasket();
    } else {
      this.isActionOkPressed = false;
    }
  }

  getQuantityProduct(id: number) {
    return this._basketService.getQuantityProduct(id);
  }

  updateDisplayedProducts() {
    // Asegúrate de que displayedProducts solo contenga los próximos 6 elementos
    this.forYouProductsDesktop = this.forYouProducts.slice(this.currentIndex, this.currentIndex + 6);
  }

  showNextSix() {
    if (this.currentIndex + 6 < this.forYouProducts.length) {
      this.currentIndex += 6;
      this.updateDisplayedProducts();
    } else {
      console.warn('No hay suficientes elementos para mostrar en los próximos 6.');
    }
  }

  showPreviousSix() {
    if (this.currentIndex - 6 >= 0) {
      this.currentIndex -= 6;
      this.updateDisplayedProducts();
    } else {
      console.warn('Ya estás en la primera página.');
    }
  }

  updateBasket() {
    const product = this.basketProductQuantity.filter(({ productId }) => productId === this.basketIdProductInFocus);
    const productIndex = this.basketProductQuantity.findIndex(({ productId }) => productId === this.basketIdProductInFocus);
    const basketQuantityProductInFocus = parseInt(product[0].quantity as string);

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
    if (!Number.isNaN(basketQuantityProductInFocus) && basketQuantityProductInFocus != 0) {
      const stockAvailable = this.getStock(this.featuredProducts, product[0].productId);
      if (stockAvailable >= basketQuantityProductInFocus) {
        this._basketService.updateQuantityProduct(this.basketIdProductInFocus, basketQuantityProductInFocus).then(
          () => {
            this.notify.success("Producto agregado a la cesta", 1000);
            this._basketService.getBasket();
          }
        );
      } else {
        const message = this.localization.localize('general.insufficientStock', 'ecommerce');
        this.notify.warn(message, 1000);
        this._basketService.updateQuantityProduct(this.basketIdProductInFocus, stockAvailable, false)
          .then(() => {
            setTimeout(() => {
              const indexProduct = this.basketProductQuantity.findIndex(({ productId }) => productId === this.basketIdProductInFocus);
              this.basketProductQuantity[indexProduct].quantity = stockAvailable;
              this._basketService.getBasket();
            }, 10);
          });
      }
    }
  }

  goToBannerProducts(path: string) {
    if (!path || path === 'null') return;
    this.navigation.forward(`/app/ecommerce/categories/bar-products/${path}`);
  }

  getStock(products: any, idProduct: number) {
    const index = products.findIndex((product: any) => { return product.id === idProduct; });
    if (index == -1) {
      return -1;
    } else {
      return products[index].stock;
    }
  }

  matchWithBasket(basketProductQuantity: any) {
    const basket = this._basketService.getUserBasket();
    basket.items.forEach(item => {
      const element = basketProductQuantity.find((e: any) => e.id == item.data.item_id);
      const elementIndex = basketProductQuantity.findIndex((e: any) => e.id == item.data.item_id);
      if (elementIndex != -1 && element.has_variants == false) {
        this.basketProductQuantity[elementIndex].quantity = item.quantity;
      }
    });
  }

  async getStateLoged(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.authTokenService.isAuthenticated()
        .subscribe((isAuthenticated) => {
          this.userIsAuthenticated = isAuthenticated;
          resolve(isAuthenticated);
        }, (error) => {
          // Manejo de errores si es necesario
          reject(error);
        });
    });
  }
}