import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiException, ViewComponent } from '@geor360/core';
import { IonContent } from '@ionic/angular';
import {
  ProductGetCategoriesDetailOutputDataDto,
  ProductGetCategoriesDetailOutputProductsDto,
  ProductServiceProxy
} from '@shared/proxies/home/product.proxie';
import { AuthTokenService } from '@shared/services/auth-token.service';
import { BasketService } from '@shared/services/basket.service';
import { Observable, Subscription } from 'rxjs';
import { FilterMobileComponent } from '../../filter';

export interface variantCommonI {
  name: string;
  values: string[];
  codes: string[];
}

interface MainInfo {
  itemCount: number;
  categoryCounts: { [key: string]: number; };
}

@Component({
  templateUrl: 'category-products-base.component.html',
  styleUrls: ['category-products-base.component.scss'],
  host: { 'app.category-products-base': 'true' }
})
export class CategoryProductsBaseComponent extends ViewComponent implements OnInit {

  _activateRoute: ActivatedRoute;
  private _authTokenService: AuthTokenService;
  _basketService: BasketService;
  private _productServiceProxy: ProductServiceProxy;
  idCategory: number = 0
  @ViewChild('content') content!: IonContent;

  actionClear = false;
  basketIdProductInFocus = 0;
  basketProductQuantity: any[] = [];
  basketQuantityProductInFocus = 0;
  categories: ProductGetCategoriesDetailOutputDataDto[] = [];
  categoryName: any = '';
  categorySlug: string = '';
  count$: Observable<number> | undefined;
  filterChanged: boolean = false;
  isActionClearPressed = false;
  isActionOkPressed = false;
  isCardProductFocused: boolean = false;
  keyboardWillShow: boolean = false;
  mainInfo: MainInfo = { itemCount: 0, categoryCounts: {}, };
  noResultsMessageVisible: boolean = false;
  onFocusCardProduct: boolean = false;
  placeholders: any;
  platform: string = '';
  products: ProductGetCategoriesDetailOutputProductsDto[] = [];
  productsVariants: ProductGetCategoriesDetailOutputProductsDto[] = [];
  productsInitial: ProductGetCategoriesDetailOutputProductsDto[] = [];
  searchProducts: string = '';
  searchValue: string = '';
  selectedCategory: string = '';
  selectedColor: string = '';
  selectedMaxPrice: any;
  selectedMinPrice: any;
  selectedMaxPriceFiltered: number = 0;
  selectedMinPriceFiltered: number = 0;
  selectedVariants: { [key: string]: string | null; } = {};
  showAllProducts: boolean = true;
  showFilterIcon: boolean = false;
  showMenuInput: boolean = false;
  subscriber: Subscription = new Subscription;
  totalItems: number = 0;
  variantsCommonsWithValues: any[] | undefined;
  variantsCommonsWithValuesInitial: any[] | undefined;
  productDetail: boolean = false
  page: number = 2;
  totalPages: number = 0;
  arrayVariants = []
  dataFilteredAdvanced: any
  searching: boolean = false
  constructor(_injector: Injector,) {
    super(_injector);
    this._activateRoute = _injector.get(ActivatedRoute);
    this._authTokenService = _injector.get(AuthTokenService);
    this._basketService = _injector.get(BasketService);
    this._productServiceProxy = _injector.get(ProductServiceProxy);
  }

  get isAuthenticated(): Promise<boolean> {
    return new Promise((resolve) => {
      this._authTokenService.isAuthenticated()
        .subscribe((isAuthenticated) => {
          resolve(isAuthenticated);
        });
    });
  }

  ngOnInit() {
    this.subscriber = this._activateRoute.queryParams.subscribe(params => {
      const name = params['name'];
      const slug = params['slug'];
      const id = params['id']
      this.idCategory = id
      this.categoryName = name;
      this.categorySlug = slug;
      this.count$ = this._basketService.getCount();

      if (!this.productDetail) {
        this.onGetCategories();
        this.onGetProducts();
        this.onGetProductsVariants()
        this.onGetTotalItems();
      }

      // this.productsInitial = [];
      this.variantsCommonsWithValues = this.onGetVariantsCommons(this.products);
    });
  }

  ionViewWillEnter() {

  }
  onProductCardBlur() {
    this.isCardProductFocused = false;

    setTimeout(() => {
      if (this.isCardProductFocused === false) {
        this.showMenuInput = false;
      }
    }, 500);

    if (!this.isActionClearPressed && !this.isActionOkPressed) {
      this.onUpdateBasket();
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
        this._basketService.updateQuantityProduct(this.basketIdProductInFocus, basketQuantityProductInFocus).then(
          () => {
            this._basketService.getBasket();
            this.onGetTotalItems();
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
              this.onGetTotalItems();
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
        this.navigateToProductDetail(productId, description);
      }
    } else {
      this.navigation.forward('/app/ecommerce/profile/login');
    }
  }

  navigateToProductDetail(id: number, description: string) {
    this.productDetail = true
    const formattedDescription = description.replace(/\s+/g, '-');
    this.navigation.forward(`/app/ecommerce/home/detail-product/${id}/${formattedDescription}`, { categories: true });
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

  onSetSelectedProductCardIndex(index: number) {
    this.basketIdProductInFocus = index;
  }

  onHandleOffsetTop(offset: number, hasVariants: boolean) {
    if (offset !== 0 && !hasVariants) {
      this.content.scrollToPoint(0, offset - 300, 1000);
    }
  }

  onClickOk() {
    this.showMenuInput = false;
    this.onUpdateBasket();
    this.isActionOkPressed = true;
  }

  onClickClearOption() {
    this.isActionClearPressed = true;

    const index = this.basketProductQuantity.findIndex(product => product.productId === this.basketIdProductInFocus);
    this.basketProductQuantity[index].quantity = undefined;
    this._basketService.getBasketCode()
      .then(() => {
        this._basketService.removeItemOfBasket(this.basketIdProductInFocus);
      });
  }

  async onSearch(term: string) {
    const text = term.toLowerCase();
    this.searchValue = term;

    if (text === '') {
      this.showAllProducts = true;
      // this.onGetProducts();
    } else {
      this.showAllProducts = false;

    }

    this.getAllProductsFilteres()
  }

  onGetCategories() {
    this._productServiceProxy.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  onGetProducts() {
    this._productServiceProxy.getAll('', 1, 20, [this.idCategory]).subscribe({
      next: (response) => {
        this.products = response.data;

        if (response.data.length === 0) {
          this.noResultsMessageVisible = true;
          return
        }

        this.productsInitial = this.products;
        // this.variantsCommonsWithValuesInitial = this.onGetVariantsCommons(this.products);
        const pageSize = 20; // Tamaño de página
        const totalProducts = response.meta.total; // Cantidad total de productos
        this.totalPages = Math.ceil(totalProducts / pageSize);
        this.products.forEach(
          (product) => {
            this.basketProductQuantity.push({
              productId: product.id,
              quantity: undefined
            });
          }
        );
        this.productsInitial.forEach(
          (product) => {
            this.basketProductQuantity.push({
              productId: product.id,
              quantity: undefined
            });
          }
        );
        this.onGetVariantsCommons(this.products);
        this.mainInfo = {
          itemCount: response.meta.total,
          categoryCounts: this.onCalculateProductCounts(this.products),
        };
        // this.mainInfo.itemCount = Object.values(
        //   this.mainInfo.categoryCounts
        // ).reduce((total, count) => total + count, 0);
        this.onMatchWithBasket(this.products);
      },
      error: (error) => {
        this.noResultsMessageVisible = true;
        return
      },
    });
  }

  onGetProductsVariants() {
    this.searching = true
    this._productServiceProxy.getAll('', 1, 500).subscribe({
      next: (response) => {
        this.productsInitial = response.data;
        this.variantsCommonsWithValuesInitial = this.onGetVariantsCommons(this.products);

        // this.productsInitial.forEach(
        //   (product) => {
        //     this.basketProductQuantity.push({
        //       productId: product.id,
        //       quantity: undefined
        //     });
        //   }
        // );
        this.searching = false
        // this.onGetVariantsCommons(this.products);
        // this.mainInfo = {
        //   itemCount: this.products.length,
        //   categoryCounts: this.onCalculateProductCounts(this.products),
        // };
        // this.mainInfo.itemCount = Object.values(
        //   this.mainInfo.categoryCounts
        // ).reduce((total, count) => total + count, 0);
        // this.onMatchWithBasket(this.products);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  onCalculateProductCounts(products: ProductGetCategoriesDetailOutputProductsDto[]) {
    const categoryCounts: { [key: number]: number; } = {};

    for (const product of products) {
      const categoryId = product.id;
      if (categoryCounts[categoryId]) {
        categoryCounts[categoryId]++;
      } else {
        categoryCounts[categoryId] = 1;
      }
    }

    return categoryCounts;
  }

  onShowFilterModal() {
    this.variantsCommonsWithValues = this.onGetVariantsCommons(this.products);
    this.dialog.showWithData<any>({
      component: FilterMobileComponent,
      componentProps: {
        openedFromCategoryProducts: true,
        selectedColor: this.selectedColor,
        selectedMaxPrice: this.selectedMaxPrice,
        selectedMinPrice: this.selectedMinPrice,
        selectedVariants: this.selectedVariants,
        showCategories: false,
        variantsCommonsWithValues: this.variantsCommonsWithValuesInitial,
      },
    }).then((res: any) => {
      if (res.data.result != 'cancel') {
        this.searching = true
        // this.dataFilteredAdvanced = res.data.result
        this.selectedColor = res.data.result.selectedColor;
        this.selectedMaxPrice = res.data.result.selectedMaxPrice;
        this.selectedMinPrice = res.data.result.selectedMinPrice;
        this.selectedVariants = res.data.result.selectedVariants;
        this.filterChanged = false;
        let changeMin: boolean = false
        let changeMax: boolean = false
        if (this.selectedMinPrice === 0 || this.selectedMinPrice === '' || this.selectedMinPrice === undefined) {
          this.selectedMinPriceFiltered = 1
          changeMin = false
        } else {
          this.selectedMinPriceFiltered = this.selectedMinPrice
          changeMin = true
        }
        if (this.selectedMaxPrice === 0 || this.selectedMaxPrice === '' || this.selectedMaxPrice === undefined) {
          this.selectedMaxPriceFiltered = 99999999999
          changeMax = false
        } else {
          this.selectedMaxPriceFiltered = this.selectedMaxPrice
          changeMax = true
        }
        if (res.data.result.variantsAll.length === 0) {
          this.arrayVariants = []
        } else {
          this.arrayVariants = res.data.result.variantsAll
        }

        if (this.selectedColor === '' && !changeMin && !changeMax && this.arrayVariants.length == 0 && Object.keys(this.selectedVariants).length === 0) {
          this.showFilterIcon = false
        } else {
          this.showFilterIcon = true
        }


        this.getAllProductsFilteres()
      }
    });
  }

  onFilterVariantsDesktop() {
    let filteredProducts: any = []
    if (Object.keys(this.selectedVariants).length != 0 || this.selectedColor) {
      filteredProducts = this.productsInitial.filter((product) => {
        const variantCondition = this.selectedVariants
          ? product.variants.some((variant) =>
            Object.entries(this.selectedVariants || {}).every(([attribute, selectedValue]) => {
              return variant.values.some((value) => {
                return value.attribute === attribute && value.value === selectedValue;
              });
            })
          )
          : true;

        const colorCondition = this.selectedColor
          ? product.variants.some((variant) =>
            variant.values.some((value) => value.color === this.selectedColor)
          )
          : true;

        return variantCondition && colorCondition;
      });
    } else {
      filteredProducts = this.productsInitial
    }


    if (this.selectedMaxPrice !== 0 || this.selectedMinPrice !== 0) {

      filteredProducts = filteredProducts.filter((product: any) => (
        (this.selectedMinPrice === 0 || product.price >= this.selectedMinPrice) &&
        (this.selectedMaxPrice === 0 || product.price <= this.selectedMaxPrice)
      ));
    }

    const hasResults = filteredProducts.length > 0;

    if (!hasResults) {
      this.noResultsMessageVisible = true;
    } else {
      this.products = filteredProducts;
    }

    this.products = filteredProducts;
    return filteredProducts;
  }

  onFilterByPriceRange() {
    if (this.selectedMinPrice === null || this.selectedMinPrice === 0) {
      this.selectedMinPrice = 1;
    }

    const filteredProducts = this.products.filter((product) => {
      return (
        (this.selectedMinPrice === null || product.price >= this.selectedMinPrice) &&
        (this.selectedMaxPrice === null || product.price <= this.selectedMaxPrice)
      );
    });

    const hasResults = filteredProducts.length > 0;

    if (!hasResults) {
      this.mainInfo.itemCount = 0;
      this.noResultsMessageVisible = true;
      this.showFilterIcon = false;
      this.onGetProducts();
    } else {
      this.noResultsMessageVisible = false;
      this.products = filteredProducts;
      this.onUpdateMainInfo();
    }

    this.products = filteredProducts;
  }

  onFilterVariants() {
    if (this.selectedVariants === null && this.selectedColor === null) {
      return;
    }

    const filteredProducts = this.products.filter((product) => {
      const variantCondition = this.selectedVariants
        ? product.variants.some((variant) =>
          Object.entries(this.selectedVariants || {}).every(([attribute, selectedValue]) =>
            variant.values.some((value) => value.attribute === attribute && value.value === selectedValue)
          )
        )
        : true;

      const colorCondition = this.selectedColor
        ? product.variants.some((variant) =>
          variant.values.some((value) => value.color === this.selectedColor)
        )
        : true;

      return variantCondition && colorCondition;
    });

    const hasResults = filteredProducts.length > 0;

    if (!hasResults) {
      this.noResultsMessageVisible = true;
      this.mainInfo.itemCount = 0;
      this.showFilterIcon = false;
      this.onGetProducts();
    } else {
      this.noResultsMessageVisible = false;
      this.products = filteredProducts;
      this.onUpdateMainInfo();
    }

    this.products = filteredProducts;
  }

  onUpdateMainInfo() {
    this.mainInfo = {
      itemCount: this.products.length,
      categoryCounts: this.onCalculateProductCounts(this.products),
    };
    this.mainInfo.itemCount = Object.values(
      this.mainInfo.categoryCounts
    ).reduce((total, count) => total + count, 0);
  }

  onClearInput() {
    this.searchValue = '';
    this.showAllProducts = true;
    this.onGetProducts();
  }

  onGetVariantsCommons(products: ProductGetCategoriesDetailOutputProductsDto[] = []) {
    const variantsCommons: string[] = [];

    products.forEach((product) => {
      if (product.has_variants == true) {
        product.variants[0].values.forEach((value) => {
          if (!variantsCommons.includes(value.attribute)) {
            variantsCommons.push(value.attribute);
          }
        });
      }
    });

    const variantsCommonsWithValues: any[] = [];
    variantsCommons.forEach((variantCommon) => {
      const variantCommonWithValues: variantCommonI = {
        name: variantCommon,
        values: [],
        codes: []
      };
      products.forEach((product) => {
        if (product.has_variants == true) {
          product.variants.forEach((variant) => {
            if (variant.values.length > 0) {
              const valueVariant = variant.values.filter((e) => {
                return e.attribute === variantCommon;
              });
              if (valueVariant.length > 0) {
                if (!variantCommonWithValues.values.includes(valueVariant[0].value)) {
                  variantCommonWithValues.values.push(valueVariant[0].value);
                  if (variantCommon == 'Color')
                    variantCommonWithValues.codes.push(valueVariant[0].color);
                }
              }
            }
          });
        }
      });
      variantsCommonsWithValues.push(variantCommonWithValues);
    });


    return variantsCommonsWithValues;
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

  async loadMoreDataMobile(event: any) {

    if (this.page <= this.totalPages) {
      this._productServiceProxy.getAll(this.searchValue, this.page, 20, [this.idCategory], this.arrayVariants, this.selectedMinPriceFiltered, this.selectedMaxPriceFiltered).subscribe({

        next: (response) => {
          // Puedes hacer lo que necesites con los productos de la página actual aquí
          this.page++;
          this.products.push(...response.data);


          if (this.products.length != 0) {
            let featuredProductsBackup = [...this.products];
            this.basketProductQuantity = [];
            // this.featuredProducts = [];
            setTimeout(() => {
              this.products = featuredProductsBackup;
              this.products.forEach(
                (product) => {
                  this.basketProductQuantity.push({
                    productId: product.id,
                    quantity: undefined,
                    lastQuantity: ''
                  });
                }
              );
              this.onMatchWithBasket(this.products)
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

  loadMoreDataDestkop() {
    if (this.page <= this.totalPages) {
      this._productServiceProxy.getAll(this.searchValue, this.page, 20, [this.idCategory], this.arrayVariants, this.selectedMinPriceFiltered, this.selectedMaxPriceFiltered)
        .subscribe({
          next: (response) => {
            // Puedes hacer lo que necesites con los productos de la página actual aquí
            this.page++;
            this.products.push(...response.data);
            // this.onMatchWithBasket(this.products)
            // this.productsInitial.forEach(
            //   (product) => {
            //     this.basketProductQuantity.push({
            //       productId: product.id,
            //       quantity: undefined,
            //       lastQuantity: ''
            //     });
            //   }
            // );
            // this.onMatchWithBasket(this.products);

            if (this.products.length != 0) {
              let featuredProductsBackup = [...this.products];
              this.basketProductQuantity = [];
              // this.featuredProducts = [];
              setTimeout(() => {
                this.products = featuredProductsBackup;
                this.products.forEach(
                  (product) => {
                    this.basketProductQuantity.push({
                      productId: product.id,
                      quantity: undefined,
                      lastQuantity: ''
                    });
                  }
                );
                this.onMatchWithBasket(this.products)
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

  getAllProductsFilteres() {
    this._productServiceProxy.getAll(this.searchValue, 1, 20, [this.idCategory], this.arrayVariants, this.selectedMinPriceFiltered, this.selectedMaxPriceFiltered).subscribe({
      next: (response) => {
        this.searching = false
        this.page = 2
        // this.products = response.data
        this.mainInfo = {
          itemCount: response.meta.total,
          categoryCounts: this.onCalculateProductCounts(this.products),
        };
        const pageSize = 20; // Tamaño de página
        const totalProducts = response.meta.total; // Cantidad total de productos
        this.totalPages = Math.ceil(totalProducts / pageSize);
        setTimeout(() => {
          this.basketProductQuantity = [];
          this.products = response.data;
          this.products.forEach(
            (product) => {
              this.basketProductQuantity.push({
                productId: product.id,
                quantity: undefined,
                lastQuantity: ''
              });
            }
          );
          this.onMatchWithBasket(this.products)
        }, 10);
        if (response.data.length === 0) {
          this.noResultsMessageVisible = true;
          return
        }
        // if (Object.keys(this.selectedVariants).length != 0 || this.selectedColor || this.selectedMaxPrice !== 0 || this.selectedMinPrice !== 0) {

        //   this.onFilterVariantsDesktop();
        // } else {
        //   this.onGetProducts();
        //   this.showFilterIcon = false
        //   console.log('entro');

        // }
      },
      error: (error) => {
        this.noResultsMessageVisible = true;
        this.searching = false
        return
      },
    });
  }


}